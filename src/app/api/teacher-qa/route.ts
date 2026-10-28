import { NextResponse } from "next/server";
import { askTeacherQuestion, getStudentStore } from "@/lib/student-platform";

export async function GET() {
  const store = getStudentStore();
  return NextResponse.json({
    questions: store.teacherQuestions,
    count: store.teacherQuestions.length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, subject, question, contextReference } = body;

    if (!question || !subject) {
      return NextResponse.json({ error: "Sujet et question requis" }, { status: 400 });
    }

    const newQuestion = askTeacherQuestion({
      studentName,
      subject,
      question,
      contextReference,
    });

    return NextResponse.json({
      ok: true,
      message: "Votre question a été transmise aux enseignants tuteurs. Vous recevrez une réponse sous 24h.",
      question: newQuestion,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
