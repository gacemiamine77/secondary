import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const safeName = path.basename(name ?? "");

  if (!safeName || !safeName.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "files", safeName);

  try {
    const data = await readFile(filePath);
    const asAttachment = new URL(request.url).searchParams.has("dl");
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${asAttachment ? "attachment" : "inline"}; filename="${safeName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
