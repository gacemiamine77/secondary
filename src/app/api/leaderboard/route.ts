import { NextResponse } from "next/server";
import { getStudentStore } from "@/lib/student-platform";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cycle = searchParams.get("cycle");
  const sortBy = searchParams.get("sortBy") || "points"; // points, focus, accuracy, completion

  const store = getStudentStore();
  let list = [...store.leaderboard];

  if (cycle && cycle !== "all") {
    list = list.filter((s) => s.cycle === cycle);
  }

  if (sortBy === "focus") {
    list.sort((a, b) => b.focusHoursThisWeek - a.focusHoursThisWeek);
  } else if (sortBy === "accuracy") {
    list.sort((a, b) => b.accuracyPct - a.accuracyPct);
  } else if (sortBy === "completion") {
    list.sort((a, b) => b.completionPct - a.completionPct);
  } else {
    list.sort((a, b) => b.points - a.points);
  }

  // Recalculate rank for current view
  list = list.map((s, idx) => ({ ...s, rank: idx + 1 }));

  // Find the overall Most Productive Student this week based on focusHoursThisWeek
  const allSortedByFocus = [...store.leaderboard].sort(
    (a, b) => b.focusHoursThisWeek - a.focusHoursThisWeek
  );
  const mostProductiveStudent = allSortedByFocus[0] ?? null;

  return NextResponse.json({
    leaderboard: list,
    mostProductiveStudent,
    totalStudents: store.leaderboard.length,
  });
}
