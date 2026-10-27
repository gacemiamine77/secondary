import { NextResponse } from "next/server";
import type { EducationalCycle } from "@/lib/constants";
import {
  addLiveCourse,
  bookLiveCourse,
  getLiveCourses,
} from "@/lib/in-memory-db";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cycle = searchParams.get("cycle") as EducationalCycle | null;
    const gradeCode = searchParams.get("gradeCode") ?? undefined;
    const subjectSlug = searchParams.get("subject") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const q = searchParams.get("q") ?? undefined;

    const items = getLiveCourses({
      cycle: cycle ?? undefined,
      gradeCode,
      subjectSlug,
      status,
      q,
    });

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error("[api/live-courses] error", error);
    return NextResponse.json({ items: [], total: 0, error: "failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Case 1: Student booking a seat in a live class
    if (body.action === "book_seat") {
      const courseId = Number(body.courseId);
      const studentName = String(body.studentName || "Étudiant");
      const result = bookLiveCourse(courseId);

      if (!result.ok) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      return NextResponse.json({
        ok: true,
        message: `Inscription confirmée pour ${studentName} ! Vous recevrez le lien de visioconférence et les supports de cours.`,
        seatsBooked: result.seatsBooked,
      });
    }

    // Case 2: Admin adding a new scheduled live formation
    if (await isAdmin()) {
      const {
        title,
        cycle,
        gradeCode,
        subjectSlug,
        subjectName,
        subjectColor,
        teacherName,
        teacherTitle,
        teacherAvatar,
        scheduledDate,
        scheduledTime,
        durationMin,
        seatsTotal,
        roomUrl,
        description,
        syllabus,
        tierRequired,
        status,
        tags,
      } = body;

      if (!title || !subjectSlug || !scheduledDate || !scheduledTime) {
        return NextResponse.json({ error: "missing_fields" }, { status: 400 });
      }

      const created = addLiveCourse({
        title,
        cycle: cycle || "lycee",
        gradeCode: gradeCode || "3AS",
        subjectSlug,
        subjectName: subjectName || "Mathématiques",
        subjectColor: subjectColor || "#4f3ef0",
        teacher: {
          name: teacherName || "Formateur Massar",
          title: teacherTitle || "Enseignant certifié",
          avatar:
            teacherAvatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
          rating: 4.9,
          reviewsCount: 15,
          bio: "Spécialiste de l'accompagnement pédagogique en ligne.",
        },
        scheduledDate,
        scheduledTime,
        durationMin: Number(durationMin) || 90,
        seatsTotal: Number(seatsTotal) || 30,
        seatsBooked: 0,
        roomUrl: roomUrl || "https://meet.google.com/ais-massar-session",
        description: description || "Session de formation et révision interactive.",
        syllabus: Array.isArray(syllabus) ? syllabus : ["Méthodes", "Exercices types", "Questions-réponses"],
        tierRequired: tierRequired || "revision",
        status: status || "upcoming",
        tags: Array.isArray(tags) ? tags : ["Direct", "Formation"],
      });

      return NextResponse.json({ ok: true, item: created });
    }

    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("[api/live-courses] POST error", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
