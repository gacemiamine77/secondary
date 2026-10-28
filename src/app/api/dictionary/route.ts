import { NextResponse } from "next/server";
import { getStudentStore } from "@/lib/student-platform";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const store = getStudentStore();
  let entries = store.dictionary;

  if (q) {
    entries = entries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.defFr.toLowerCase().includes(q) ||
        e.defAr.toLowerCase().includes(q) ||
        e.defEn.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ entries });
}
