import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { resources, subjects } from "@/db/schema";
import type { MetaDTO, ResourceDTO } from "@/lib/constants";

export type ResourceFilters = {
  q?: string;
  type?: string;
  subject?: string; // slug
  level?: number;
  trimester?: number;
  year?: number;
  sort?: "new" | "downloads" | "views";
  page?: number;
  pageSize?: number;
};

const selection = {
  id: resources.id,
  titleFr: resources.titleFr,
  titleAr: resources.titleAr,
  titleEn: resources.titleEn,
  type: resources.type,
  subjectId: resources.subjectId,
  subjectSlug: subjects.slug,
  subjectNameFr: subjects.nameFr,
  subjectNameAr: subjects.nameAr,
  subjectNameEn: subjects.nameEn,
  subjectColor: subjects.color,
  level: resources.level,
  trimester: resources.trimester,
  year: resources.year,
  fileUrl: resources.fileUrl,
  videoUrl: resources.videoUrl,
  thumbnailUrl: resources.thumbnailUrl,
  durationMin: resources.durationMin,
  pages: resources.pages,
  sizeMb: resources.sizeMb,
  views: resources.views,
  downloads: resources.downloads,
  featured: resources.featured,
  teacherName: resources.teacherName,
  createdAt: resources.createdAt,
};

export async function getResources(filters: ResourceFilters): Promise<{
  items: ResourceDTO[];
  total: number;
  hasMore: boolean;
}> {
  const conds: SQL[] = [];

  if (filters.q && filters.q.trim().length > 0) {
    const pattern = `%${filters.q.trim()}%`;
    const search = or(
      ilike(resources.titleFr, pattern),
      ilike(resources.titleAr, pattern),
      ilike(resources.titleEn, pattern),
      ilike(subjects.nameFr, pattern),
      ilike(subjects.nameAr, pattern),
      ilike(subjects.nameEn, pattern)
    );
    if (search) conds.push(search);
  }
  if (filters.type) conds.push(eq(resources.type, filters.type));
  if (filters.subject) conds.push(eq(subjects.slug, filters.subject));
  if (filters.level) conds.push(eq(resources.level, filters.level));
  if (filters.trimester) conds.push(eq(resources.trimester, filters.trimester));
  if (filters.year) conds.push(eq(resources.year, filters.year));

  const where = conds.length > 0 ? and(...conds) : undefined;

  const orderBy =
    filters.sort === "downloads"
      ? [desc(resources.downloads), desc(resources.id)]
      : filters.sort === "views"
        ? [desc(resources.views), desc(resources.id)]
        : [desc(resources.createdAt), desc(resources.id)];

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(4, filters.pageSize ?? 12));

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resources)
    .innerJoin(subjects, eq(resources.subjectId, subjects.id))
    .where(where);

  const rows = await db
    .select(selection)
    .from(resources)
    .innerJoin(subjects, eq(resources.subjectId, subjects.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const items: ResourceDTO[] = rows.map(({ createdAt: _createdAt, ...rest }) => rest);

  return { items, total: count, hasMore: page * pageSize < count };
}

export async function getMeta(): Promise<MetaDTO> {
  const subjectRows = await db
    .select({
      id: subjects.id,
      slug: subjects.slug,
      nameFr: subjects.nameFr,
      nameAr: subjects.nameAr,
      nameEn: subjects.nameEn,
      color: subjects.color,
      icon: subjects.icon,
      count: sql<number>`count(${resources.id})::int`,
    })
    .from(subjects)
    .leftJoin(resources, eq(resources.subjectId, subjects.id))
    .groupBy(subjects.id)
    .orderBy(subjects.id);

  const yearRows = await db
    .selectDistinct({ year: resources.year })
    .from(resources)
    .orderBy(desc(resources.year));

  const [stats] = await db
    .select({
      resources: sql<number>`count(*)::int`,
      downloads: sql<number>`coalesce(sum(${resources.downloads}), 0)::int`,
      videos: sql<number>`count(*) filter (where ${resources.type} = 'video')::int`,
    })
    .from(resources);

  const typeRows = await db
    .select({
      type: resources.type,
      count: sql<number>`count(*)::int`,
    })
    .from(resources)
    .groupBy(resources.type);

  const typeCounts: Record<string, number> = {};
  for (const r of typeRows) typeCounts[r.type] = r.count;

  return {
    subjects: subjectRows,
    years: yearRows.map((r) => r.year),
    stats: {
      resources: stats?.resources ?? 0,
      downloads: stats?.downloads ?? 0,
      videos: stats?.videos ?? 0,
      subjects: subjectRows.length,
    },
    typeCounts,
  };
}

export async function getFeaturedVideos(limit = 4) {
  const result = await getResources({ type: "video", sort: "views", page: 1, pageSize: limit });
  return result.items;
}

export async function getLatest(limit = 6) {
  const result = await getResources({ sort: "new", page: 1, pageSize: limit });
  return result.items;
}

export const EMPTY_META: MetaDTO = {
  subjects: [],
  years: [],
  stats: { resources: 0, downloads: 0, videos: 0, subjects: 0 },
  typeCounts: {},
};
