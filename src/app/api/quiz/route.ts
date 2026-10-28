import { NextResponse } from "next/server";
import { getStudentStore, submitDailyQuizAnswers } from "@/lib/student-platform";

export async function GET() {
  const store = getStudentStore();
  // Strip isCorrect for client view before submission
  const clientQuestions = store.dailyQuiz.map((q) => ({
    id: q.id,
    cycle: q.cycle,
    gradeCode: q.gradeCode,
    subject: q.subject,
    question: q.question,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  }));

  return NextResponse.json({
    questions: clientQuestions,
    isCompletedToday: store.quizCompletedToday,
    scoreToday: store.quizScoreToday,
    totalToday: store.dailyQuiz.length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body.answers as Record<number, string>;
    if (!answers) {
      return NextResponse.json({ error: "Answers object required" }, { status: 400 });
    }

    const result = submitDailyQuizAnswers(answers);
    const store = getStudentStore();

    // Include explanations
    const fullQuestions = store.dailyQuiz.map((q) => ({
      id: q.id,
      correctOptionId: q.options.find((o) => o.isCorrect)?.id,
      explanation: q.explanation,
    }));

    return NextResponse.json({
      ok: true,
      ...result,
      review: fullQuestions,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
