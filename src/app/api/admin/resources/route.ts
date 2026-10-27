import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { db } from "@/db";
import { resources, subjects } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import {
  addInMemoryResource,
  getInMemorySubjects,
  getStore,
} from "@/lib/in-memory-db";

export const dynamic = "force-dynamic";

const DOC_TYPES = ["course", "exercise", "homework", "devoir", "exam"];
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

function int(value: unknown, min: number, max: number): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function validSubject(subjectId: number) {
  if (process.env.DATABASE_URL) {
    try {
      const [subject] = await db
        .select()
        .from(subjects)
        .where(eq(subjects.id, subjectId))
        .limit(1);
      if (subject) return subject;
    } catch {
      // Fallback below
    }
  }
  const match = getInMemorySubjects().find((s) => s.id === subjectId);
  return match ?? null;
}

/** GET /api/admin/resources — last 100 documents (admin only). */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (process.env.DATABASE_URL) {
    try {
      const rows = await db
        .select({
          id: resources.id,
          titleFr: resources.titleFr,
          type: resources.type,
          subjectSlug: subjects.slug,
          subjectNameFr: subjects.nameFr,
          subjectColor: subjects.color,
          level: resources.level,
          trimester: resources.trimester,
          year: resources.year,
          fileUrl: resources.fileUrl,
          videoUrl: resources.videoUrl,
          views: resources.views,
          downloads: resources.downloads,
          createdAt: resources.createdAt,
        })
        .from(resources)
        .innerJoin(subjects, eq(resources.subjectId, subjects.id))
        .orderBy(desc(resources.id))
        .limit(100);
      if (rows && rows.length > 0) {
        return NextResponse.json({ items: rows });
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  const rows = getStore().resources.slice(0, 100).map((r) => ({
    id: r.id,
    titleFr: r.titleFr,
    type: r.type,
    subjectSlug: r.subjectSlug,
    subjectNameFr: r.subjectNameFr,
    subjectColor: r.subjectColor,
    level: r.level,
    trimester: r.trimester,
    year: r.year,
    fileUrl: r.fileUrl,
    videoUrl: r.videoUrl,
    views: r.views,
    downloads: r.downloads,
    createdAt: r.createdAt,
  }));

  return NextResponse.json({ items: rows });
}

/** POST /api/admin/resources — create a PDF document (multipart) or a video (JSON). */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    // ---------- Video resource (JSON) ----------
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      const titleFr = str(body.titleFr);
      const subjectId = int(body.subjectId, 1, 1_000_000);
      const level = int(body.level, 1, 3);
      const trimester = int(body.trimester, 1, 3);
      const year = int(body.year, 2000, 2100);
      const videoUrl = str(body.videoUrl);
      const durationMin = int(body.durationMin, 1, 600);

      if (!titleFr || !subjectId || !level || !trimester || !year || !videoUrl || !durationMin) {
        return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
      }
      try {
        new URL(videoUrl);
      } catch {
        return NextResponse.json({ error: "invalid_video_url" }, { status: 400 });
      }
      const subject = await validSubject(subjectId);
      if (!subject) {
        return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
      }
      const thumbnailUrl = str(body.thumbnailUrl) || null;

      if (process.env.DATABASE_URL) {
        try {
          const [created] = await db
            .insert(resources)
            .values({
              titleFr,
              titleAr: str(body.titleAr) || titleFr,
              titleEn: str(body.titleEn) || titleFr,
              type: "video",
              subjectId,
              level,
              trimester,
              year,
              videoUrl,
              thumbnailUrl,
              durationMin,
              pages: 0,
              sizeMb: "—",
              teacherName: str(body.teacherName) || null,
              featured: body.featured === true,
            })
            .returning({ id: resources.id });
          if (created) return NextResponse.json({ ok: true, id: created.id });
        } catch {
          // Fallback to in-memory
        }
      }

      const mem = addInMemoryResource({
        titleFr,
        titleAr: str(body.titleAr) || titleFr,
        titleEn: str(body.titleEn) || titleFr,
        type: "video",
        subjectId,
        subjectSlug: subject.slug,
        subjectNameFr: subject.nameFr,
        subjectNameAr: subject.nameAr,
        subjectNameEn: subject.nameEn,
        subjectColor: subject.color,
        level,
        trimester,
        year,
        fileUrl: null,
        videoUrl,
        thumbnailUrl,
        durationMin,
        pages: 0,
        sizeMb: "—",
        teacherName: str(body.teacherName) || null,
        featured: body.featured === true,
      });

      return NextResponse.json({ ok: true, id: mem.id });
    }

    // ---------- PDF document (multipart/form-data) ----------
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "invalid_content_type" }, { status: 400 });
    }
    const form = await request.formData();
    const titleFr = str(form.get("titleFr"));
    const type = str(form.get("type"));
    const subjectId = int(form.get("subjectId"), 1, 1_000_000);
    const level = int(form.get("level"), 1, 3);
    const trimester = int(form.get("trimester"), 1, 3);
    const year = int(form.get("year"), 2000, 2100);
    const file = form.get("pdf");

    if (!titleFr || !DOC_TYPES.includes(type) || !subjectId || !level || !trimester || !year) {
      return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
    const subject = await validSubject(subjectId);
    if (!subject) {
      return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Validate PDF integrity and read its page count.
    let pageCount = 1;
    try {
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pageCount = doc.getPageCount();
    } catch {
      return NextResponse.json({ error: "invalid_pdf" }, { status: 400 });
    }

    const filesDir = path.join(process.cwd(), "public", "files");
    await mkdir(filesDir, { recursive: true });
    const baseName = `${subject.slug}-${Date.now().toString(36)}.pdf`;
    await writeFile(path.join(filesDir, baseName), bytes);

    if (process.env.DATABASE_URL) {
      try {
        const [created] = await db
          .insert(resources)
          .values({
            titleFr,
            titleAr: str(form.get("titleAr")) || titleFr,
            titleEn: str(form.get("titleEn")) || titleFr,
            type,
            subjectId,
            level,
            trimester,
            year,
            fileUrl: `/api/files/${baseName}`,
            pages: pageCount,
            sizeMb: `${(bytes.length / 1024 / 1024).toFixed(1)} Mo`,
            teacherName: str(form.get("teacherName")) || null,
            featured: form.get("featured") === "true",
          })
          .returning({ id: resources.id });

        if (created) {
          return NextResponse.json({ ok: true, id: created.id, pages: pageCount });
        }
      } catch {
        // Fallback to in-memory
      }
    }

    const mem = addInMemoryResource({
      titleFr,
      titleAr: str(form.get("titleAr")) || titleFr,
      titleEn: str(form.get("titleEn")) || titleFr,
      type,
      subjectId,
      subjectSlug: subject.slug,
      subjectNameFr: subject.nameFr,
      subjectNameAr: subject.nameAr,
      subjectNameEn: subject.nameEn,
      subjectColor: subject.color,
      level,
      trimester,
      year,
      fileUrl: `/api/files/${baseName}`,
      videoUrl: null,
      thumbnailUrl: null,
      durationMin: null,
      pages: pageCount,
      sizeMb: `${(bytes.length / 1024 / 1024).toFixed(1)} Mo`,
      teacherName: str(form.get("teacherName")) || null,
      featured: form.get("featured") === "true",
    });

    return NextResponse.json({ ok: true, id: mem.id, pages: pageCount });
  } catch (error) {
    console.error("[admin/resources] error", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
