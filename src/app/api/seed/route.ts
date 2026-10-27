import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { resources, subjects } from "@/db/schema";
import { buildResourcePdf } from "@/lib/pdfgen";
import { SUBJECT_SEED, TEACHERS, TOPICS, VIDEO_SEED } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

// Deterministic pseudo-random generator for stable seed data.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TR_FR = ["1er trimestre", "2eme trimestre", "3eme trimestre"];
const TR_AR = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"];
const TR_EN = ["Term 1", "Term 2", "Term 3"];
const LV_FR = [
  "1ere annee secondaire",
  "2eme annee secondaire",
  "3eme annee secondaire (BAC)",
];

function titles(
  type: string,
  topic: { fr: string; ar: string; en: string },
  extra: { n?: number; term?: number; subject?: { fr: string; ar: string; en: string } }
) {
  switch (type) {
    case "course":
      return {
        fr: `Cours : ${topic.fr}`,
        ar: `درس: ${topic.ar}`,
        en: `Lesson: ${topic.en}`,
      };
    case "exercise":
      return {
        fr: `Exercices corrigés : ${topic.fr}`,
        ar: `تمارين محلولة: ${topic.ar}`,
        en: `Solved exercises: ${topic.en}`,
      };
    case "homework":
      return {
        fr: `Devoir maison : ${topic.fr}`,
        ar: `فرض منزلي: ${topic.ar}`,
        en: `Homework: ${topic.en}`,
      };
    case "devoir":
      return {
        fr: `Devoir surveillé N°${extra.n ?? 1} : ${topic.fr}`,
        ar: `فرض مراقبة رقم ${extra.n ?? 1}: ${topic.ar}`,
        en: `Supervised test #${extra.n ?? 1}: ${topic.en}`,
      };
    case "exam":
      return {
        fr: `Examen du ${TR_FR[(extra.term ?? 3) - 1]} : ${extra.subject?.fr ?? ""}`,
        ar: `اختبار ${TR_AR[(extra.term ?? 3) - 1]}: مادة ${extra.subject?.ar ?? ""}`,
        en: `${TR_EN[(extra.term ?? 3) - 1]} exam: ${extra.subject?.en ?? ""}`,
      };
    case "video":
      return {
        fr: `Vidéo explicative : ${topic.fr}`,
        ar: `فيديو تعليمي: ${topic.ar}`,
        en: `Explainer video: ${topic.en}`,
      };
    default:
      return { fr: topic.fr, ar: topic.ar, en: topic.en };
  }
}

export async function GET() {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(subjects);
    if (count > 0) {
      return NextResponse.json({
        seeded: false,
        message: "Database already seeded",
        subjects: count,
      });
    }

    const rand = mulberry32(20250917);
    const filesDir = path.join(process.cwd(), "public", "files");
    await mkdir(filesDir, { recursive: true });

    // 1. Subjects
    const subjectIds = new Map<string, number>();
    for (const s of SUBJECT_SEED) {
      const [row] = await db
        .insert(subjects)
        .values({
          slug: s.slug,
          nameFr: s.nameFr,
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          color: s.color,
          icon: s.icon,
        })
        .returning({ id: subjects.id });
      subjectIds.set(s.slug, row.id);
    }

    // 2. Resources
    const rows: (typeof resources.$inferInsert)[] = [];
    let seq = 0;

    const pushDoc = async (opts: {
      type: string;
      subjectSlug: string;
      level: number;
      trimester: number;
      year: number;
      t: { fr: string; ar: string; en: string };
      titleExtra?: { n?: number; term?: number; subject?: { fr: string; ar: string; en: string } };
      pages: number;
    }) => {
      const subject = SUBJECT_SEED.find((x) => x.slug === opts.subjectSlug)!;
      const subjectId = subjectIds.get(opts.subjectSlug)!;
      const tt = titles(opts.type, opts.t, opts.titleExtra ?? {});
      seq += 1;
      const fileName = `${opts.subjectSlug}-${opts.level}as-t${opts.trimester}-${opts.type}-${String(seq).padStart(3, "0")}.pdf`;

      const pdfBytes = await buildResourcePdf({
        title: tt.fr,
        subjectName: subject.nameFr,
        typeLabel:
          opts.type === "course"
            ? "Cours"
            : opts.type === "exercise"
              ? "Exercices corriges"
              : opts.type === "homework"
                ? "Devoir maison"
                : opts.type === "devoir"
                  ? "Devoir surveille"
                  : "Examen",
        levelLabel: LV_FR[opts.level - 1],
        trimesterLabel: TR_FR[opts.trimester - 1],
        year: opts.year,
        pages: opts.pages,
        color: subject.rgb,
      });
      await writeFile(path.join(filesDir, fileName), Buffer.from(pdfBytes));

      rows.push({
        titleFr: tt.fr,
        titleAr: tt.ar,
        titleEn: tt.en,
        type: opts.type,
        subjectId,
        level: opts.level,
        trimester: opts.trimester,
        year: opts.year,
        fileUrl: `/api/files/${fileName}`,
        pages: opts.pages,
        sizeMb: `${(0.6 + opts.pages * 0.22 + rand() * 0.4).toFixed(1)} Mo`,
        views: Math.floor(400 + rand() * 42000),
        downloads: Math.floor(150 + rand() * 18000),
        featured: rand() > 0.82,
        teacherName: TEACHERS[Math.floor(rand() * TEACHERS.length)],
        createdAt: new Date(2025, Math.floor(rand() * 12), 1 + Math.floor(rand() * 27)),
      });
    };

    for (let si = 0; si < SUBJECT_SEED.length; si++) {
      const subject = SUBJECT_SEED[si];
      const topics = TOPICS[subject.slug];
      const examTerm = [3, 2, 3, 1, 3, 1, 2, 3, 1, 2][si % 10];

      // Courses: one per level, spread across trimesters
      for (let level = 1; level <= 3; level++) {
        await pushDoc({
          type: "course",
          subjectSlug: subject.slug,
          level,
          trimester: level,
          year: 2023 + ((si + level) % 3),
          t: topics[(si + level) % topics.length],
          pages: 5 + ((si + level) % 4),
        });
      }

      // Exercises (2)
      for (let k = 0; k < 2; k++) {
        await pushDoc({
          type: "exercise",
          subjectSlug: subject.slug,
          level: ((si + k) % 3) + 1,
          trimester: ((si + k + 1) % 3) + 1,
          year: 2023 + ((si + k) % 3),
          t: topics[(si + k + 2) % topics.length],
          pages: 3 + ((si + k) % 3),
        });
      }

      // Homework (1)
      await pushDoc({
        type: "homework",
        subjectSlug: subject.slug,
        level: (si % 3) + 1,
        trimester: ((si + 2) % 3) + 1,
        year: 2023 + (si % 3),
        t: topics[(si + 3) % topics.length],
        pages: 2 + (si % 2),
      });

      // Supervised tests (2)
      for (let k = 0; k < 2; k++) {
        await pushDoc({
          type: "devoir",
          subjectSlug: subject.slug,
          level: ((si + k + 1) % 3) + 1,
          trimester: ((si + k) % 3) + 1,
          year: 2022 + ((si + k) % 4),
          t: topics[(si + k + 1) % topics.length],
          titleExtra: { n: k + 1 },
          pages: 2 + ((si + k) % 3),
        });
      }

      // Exam (1)
      await pushDoc({
        type: "exam",
        subjectSlug: subject.slug,
        level: 3,
        trimester: examTerm,
        year: 2021 + (si % 5),
        t: topics[si % topics.length],
        titleExtra: {
          term: examTerm,
          subject: { fr: subject.nameFr, ar: subject.nameAr, en: subject.nameEn },
        },
        pages: 3 + (si % 3),
      });
    }

    // 3. Videos
    for (const video of VIDEO_SEED) {
      const subject = SUBJECT_SEED.find((x) => x.slug === video.subject)!;
      const topics = TOPICS[video.subject];
      const topic = topics[video.topicIndex % topics.length];
      const tt = titles("video", topic, {});
      seq += 1;
      rows.push({
        titleFr: tt.fr,
        titleAr: tt.ar,
        titleEn: tt.en,
        type: "video",
        subjectId: subjectIds.get(video.subject)!,
        level: (video.topicIndex % 3) + 1,
        trimester: ((video.topicIndex + 1) % 3) + 1,
        year: 2024 + (video.topicIndex % 2),
        fileUrl: null,
        videoUrl: video.url,
        thumbnailUrl: video.thumb,
        durationMin: video.duration,
        pages: 0,
        sizeMb: "—",
        views: Math.floor(2000 + rand() * 60000),
        downloads: Math.floor(50 + rand() * 1500),
        featured: true,
        teacherName: TEACHERS[Math.floor(rand() * TEACHERS.length)],
        createdAt: new Date(2025, Math.floor(rand() * 12), 1 + Math.floor(rand() * 27)),
      });
    }

    // Insert resources in chunks
    const CHUNK = 25;
    for (let i = 0; i < rows.length; i += CHUNK) {
      await db.insert(resources).values(rows.slice(i, i + CHUNK));
    }

    return NextResponse.json({
      seeded: true,
      subjects: SUBJECT_SEED.length,
      resources: rows.length,
      pdfs: rows.filter((r) => r.fileUrl).length,
    });
  } catch (error) {
    console.error("[api/seed] error", error);
    return NextResponse.json(
      { seeded: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 500 }
    );
  }
}
