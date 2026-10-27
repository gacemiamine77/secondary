import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { db } from "@/db";
import { resources, subjects } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";

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
  const [subject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .limit(1);
  return subject ?? null;
}

/** GET /api/admin/resources — last 100 documents (admin only). */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
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
      return NextResponse.json({ ok: true, id: created.id });
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

    return NextResponse.json({ ok: true, id: created.id, pages: pageCount });
  } catch (error) {
    console.error("[admin/resources] error", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
