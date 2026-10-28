import { NextResponse } from "next/server";
import { getStudentStore } from "@/lib/student-platform";

export async function GET() {
  const store = getStudentStore();
  return NextResponse.json({
    student: store.student,
    teacherQuestions: store.teacherQuestions,
    quizCompletedToday: store.quizCompletedToday,
    quizScoreToday: store.quizScoreToday,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = getStudentStore();

    if (body.action === "update_goal") {
      // update study hours target
      return NextResponse.json({ ok: true, student: store.student });
    }

    if (body.action === "complete_exercise") {
      store.student.exercisesCompleted = Math.min(
        store.student.exercisesTotal,
        store.student.exercisesCompleted + 1
      );
      return NextResponse.json({ ok: true, student: store.student });
    }

    return NextResponse.json({ ok: true, student: store.student });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
