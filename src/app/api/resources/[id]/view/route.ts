import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { incrementInMemoryViews } from "@/lib/in-memory-db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = Number(id);
    if (!Number.isFinite(resourceId)) {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      try {
        const [row] = await db
          .update(resources)
          .set({ views: sql`${resources.views} + 1` })
          .where(eq(resources.id, resourceId))
          .returning({ views: resources.views });
        if (row) return NextResponse.json(row);
      } catch {
        // Fallback below
      }
    }

    const mem = incrementInMemoryViews(resourceId);
    if (!mem) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(mem);
  } catch (error) {
    console.error("[view] error", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
