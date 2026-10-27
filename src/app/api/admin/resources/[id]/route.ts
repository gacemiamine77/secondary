import { unlink } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { deleteInMemoryResource } from "@/lib/in-memory-db";

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

  let fileUrl: string | null = null;

  if (process.env.DATABASE_URL) {
    try {
      const [row] = await db
        .delete(resources)
        .where(eq(resources.id, resourceId))
        .returning({ fileUrl: resources.fileUrl });
      if (row) fileUrl = row.fileUrl;
    } catch {
      // Fallback below
    }
  }

  if (!fileUrl) {
    const deleted = deleteInMemoryResource(resourceId);
    if (!deleted) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    fileUrl = deleted.fileUrl;
  }

  // Best-effort removal of the file from disk.
  if (fileUrl?.startsWith("/api/files/")) {
    const name = path.basename(fileUrl);
    await unlink(path.join(process.cwd(), "public", "files", name)).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
