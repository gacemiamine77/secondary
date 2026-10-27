import { NextResponse } from "next/server";
import type { EducationalCycle } from "@/lib/constants";
import {
  addInteractiveExercise,
  getInteractiveExerciseById,
  getInteractiveExercises,
} from "@/lib/in-memory-db";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cycle = searchParams.get("cycle") as EducationalCycle | null;
    const gradeCode = searchParams.get("gradeCode") ?? undefined;
    const subjectSlug = searchParams.get("subject") ?? undefined;
    const difficulty = searchParams.get("difficulty") ?? undefined;
    const q = searchParams.get("q") ?? undefined;

    const items = getInteractiveExercises({
      cycle: cycle ?? undefined,
      gradeCode,
      subjectSlug,
      difficulty,
      q,
    });

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error("[api/exercises] error", error);
    return NextResponse.json({ items: [], total: 0, error: "failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Case 1: Student submitting an answer for instant verification & grading
    if (body.action === "submit_answer") {
      const exerciseId = Number(body.exerciseId);
      const selectedOptionId = String(body.selectedOptionId || "");
      const numericAnswer = Number(body.numericAnswer);

      const exercise = getInteractiveExerciseById(exerciseId);
      if (!exercise) {
        return NextResponse.json({ error: "exercise_not_found" }, { status: 404 });
      }

      let isCorrect = false;
      let feedback = "";

      if (exercise.type === "qcm" && exercise.options) {
        const option = exercise.options.find((o) => o.id === selectedOptionId);
        if (option) {
          isCorrect = option.isCorrect;
          feedback = option.feedback;
        }
      } else if (exercise.type === "numeric" && exercise.correctNumericAnswer !== undefined) {
        const tol = exercise.tolerance ?? 0.01;
        isCorrect = Math.abs(numericAnswer - exercise.correctNumericAnswer) <= tol;
        feedback = isCorrect
          ? `Excellent ! La réponse attendue est bien ${exercise.correctNumericAnswer}.`
          : `Ce n'est pas tout à fait ça. La valeur attendue est ${exercise.correctNumericAnswer}. Regardez la solution détaillée ci-dessous.`;
      } else {
        // Guided or open: provide solution steps
        isCorrect = true;
        feedback = "Votre démarche a été enregistrée. Comparez vos résultats avec le corrigé type étape par étape.";
      }

      return NextResponse.json({
        isCorrect,
        feedback,
        pointsEarned: isCorrect ? exercise.points : Math.round(exercise.points * 0.25),
        hints: exercise.hints,
        solutionSteps: exercise.solutionSteps,
        teacherTip: exercise.teacherTip,
      });
    }

    // Case 2: Admin adding a new interactive exercise
    if (await isAdmin()) {
      const {
        cycle,
        gradeCode,
        subjectSlug,
        subjectName,
        subjectColor,
        title,
        difficulty,
        type,
        statement,
        question,
        options,
        correctNumericAnswer,
        hints,
        solutionSteps,
        teacherTip,
        points,
        authorTeacher,
      } = body;

      if (!title || !statement || !question || !subjectSlug) {
        return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
      }

      const created = addInteractiveExercise({
        cycle: cycle || "lycee",
        gradeCode: gradeCode || "3AS",
        subjectSlug,
        subjectName: subjectName || "Mathématiques",
        subjectColor: subjectColor || "#4f3ef0",
        title,
        difficulty: difficulty || "moyen",
        type: type || "qcm",
        statement,
        question,
        options: Array.isArray(options) ? options : [],
        correctNumericAnswer: correctNumericAnswer ? Number(correctNumericAnswer) : undefined,
        hints: Array.isArray(hints) ? hints : ["Relisez attentivement l'énoncé."],
        solutionSteps: Array.isArray(solutionSteps) ? solutionSteps : [],
        teacherTip: teacherTip || "Travaillez régulièrement les exercices types !",
        points: Number(points) || 10,
        authorTeacher: authorTeacher || "Équipe pédagogique Massar",
      });

      return NextResponse.json({ ok: true, item: created });
    }

    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("[api/exercises] POST error", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
