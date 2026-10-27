import { LibraryClient, type InitialFilters } from "@/components/library/library-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bibliothèque — Massar",
  description:
    "Recherchez et filtrez les cours, exercices, devoirs maison, devoirs surveillés, examens et vidéos du lycée par matière, niveau, trimestre et année.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const str = (key: string): string => {
    const v = sp[key];
    return typeof v === "string" ? v : "";
  };

  const initial: InitialFilters = {
    q: str("q"),
    type: str("type"),
    subject: str("subject"),
    cycle: str("cycle") || undefined,
    gradeCode: str("gradeCode") || undefined,
    level: Number(str("level")) || 0,
    trimester: Number(str("trimester")) || 0,
    year: Number(str("year")) || 0,
    sort:
      str("sort") === "downloads" || str("sort") === "views"
        ? (str("sort") as "downloads" | "views")
        : "new",
  };

  return <LibraryClient initial={initial} />;
}
