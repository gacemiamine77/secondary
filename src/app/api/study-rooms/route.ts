import { NextResponse } from "next/server";
import {
  getStudentStore,
  postStudyRoomMessage,
  toggleEventRsvp,
  updateDigitalNotebook,
} from "@/lib/student-platform";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId") || "maths-bac-2026";
  const topicId = searchParams.get("topicId") || channelId;

  const store = getStudentStore();
  const messages = store.studyRoomMessages.filter((m) => m.channelId === channelId);
  const notebook = store.notebooks[topicId] || null;

  return NextResponse.json({
    channelId,
    messages,
    notebook,
    peerEvents: store.peerEvents,
    allNotebooks: store.notebooks,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "send_message") {
      const msg = postStudyRoomMessage(body.channelId, body.text, body.sender);
      return NextResponse.json({ ok: true, message: msg });
    }

    if (body.action === "save_notebook") {
      const updated = updateDigitalNotebook(body.topicId, body.content, body.editorName);
      return NextResponse.json({ ok: true, notebook: updated });
    }

    if (body.action === "toggle_rsvp") {
      const res = toggleEventRsvp(body.eventId);
      return NextResponse.json({ ...res });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
