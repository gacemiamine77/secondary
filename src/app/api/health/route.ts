import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      await db.execute(sql`select 1`);
      return Response.json({ ok: true, mode: "database" });
    }
    return Response.json({ ok: true, mode: "in-memory" });
  } catch {
    // If db query failed but in-memory is active, return healthy in-memory status
    return Response.json({ ok: true, mode: "in-memory-fallback" });
  }
}
