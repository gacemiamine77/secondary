import { unlink } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const resourceId = Number(id);
  if (!Number.isInteger(resourceId)) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const [row] = await db
    .delete(resources)
    .where(eq(resources.id, resourceId))
    .returning({ fileUrl: resources.fileUrl });

  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Best-effort removal of the file from disk.
  if (row.fileUrl?.startsWith("/api/files/")) {
    const name = path.basename(row.fileUrl);
    await unlink(path.join(process.cwd(), "public", "files", name)).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
