import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { buildResourcePdf } from "@/lib/pdfgen";
import { getStore } from "@/lib/in-memory-db";

export const dynamic = "force-dynamic";

const TR_FR = ["1er trimestre", "2eme trimestre", "3eme trimestre"];
const LV_FR = [
  "1ere annee secondaire",
  "2eme annee secondaire",
  "3eme annee secondaire (BAC)",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const safeName = path.basename(name ?? "");

  if (!safeName || !safeName.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const filesDir = path.join(process.cwd(), "public", "files");
  const filePath = path.join(filesDir, safeName);

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
    // Generate the PDF on the fly if not yet created on disk!
    try {
      const store = getStore();
      const res = store.resources.find(
        (r) => r.fileUrl === `/api/files/${safeName}`
      );

      const subject = store.subjects.find(
        (s) => s.id === (res?.subjectId ?? 1) || s.slug === (res?.subjectSlug ?? "mathematiques")
      ) ?? store.subjects[0];

      const typeLabel =
        res?.type === "course"
          ? "Cours"
          : res?.type === "exercise"
            ? "Exercices corriges"
            : res?.type === "homework"
              ? "Devoir maison"
              : res?.type === "devoir"
                ? "Devoir surveille"
                : "Examen";

      const pdfBytes = await buildResourcePdf({
        title: res?.titleFr ?? safeName.replace(".pdf", ""),
        subjectName: subject?.nameFr ?? "Enseignement secondaire",
        typeLabel,
        levelLabel: LV_FR[(res?.level ?? 1) - 1] ?? "Niveau secondaire",
        trimesterLabel: TR_FR[(res?.trimester ?? 1) - 1] ?? "Trimestre",
        year: res?.year ?? 2024,
        pages: res?.pages && res.pages > 0 ? res.pages : 4,
        color: subject?.rgb ?? [0.31, 0.24, 0.94],
      });

      await mkdir(filesDir, { recursive: true }).catch(() => {});
      await writeFile(filePath, Buffer.from(pdfBytes)).catch(() => {});

      const asAttachment = new URL(request.url).searchParams.has("dl");
      return new NextResponse(new Uint8Array(pdfBytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${asAttachment ? "attachment" : "inline"}; filename="${safeName}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (genErr) {
      console.error("[files/get] generator error", genErr);
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
  }
}
