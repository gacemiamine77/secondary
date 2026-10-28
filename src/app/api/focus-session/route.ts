import { NextResponse } from "next/server";
import { logFocusSession } from "@/lib/student-platform";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const minutes = Number(body.minutes) || 25;
    const taskLabel = body.taskLabel as string | undefined;

    const result = logFocusSession(minutes, taskLabel);

    return NextResponse.json({
      ok: true,
      message: `Session de ${minutes} min enregistrée !`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
