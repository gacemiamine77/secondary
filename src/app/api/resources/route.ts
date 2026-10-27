import { NextResponse } from "next/server";
import { getResources, type ResourceFilters } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const num = (key: string): number | undefined => {
      const v = searchParams.get(key);
      if (!v) return undefined;
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };

    const sortParam = searchParams.get("sort");
    const filters: ResourceFilters = {
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      subject: searchParams.get("subject") ?? undefined,
      level: num("level"),
      trimester: num("trimester"),
      year: num("year"),
      sort:
        sortParam === "downloads" || sortParam === "views" ? sortParam : "new",
      page: num("page") ?? 1,
      pageSize: num("pageSize") ?? 12,
    };

    const result = await getResources(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/resources] error", error);
    return NextResponse.json(
      { items: [], total: 0, hasMore: false, error: "failed" },
      { status: 200 }
    );
  }
}
