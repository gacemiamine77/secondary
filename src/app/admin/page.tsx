import { asc } from "drizzle-orm";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/admin-login";
import {
  AdminDashboard,
  type AdminSubject,
} from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration — Massar",
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const dbSubjects: AdminSubject[] = process.env.DATABASE_URL
    ? await db
        .select({
          id: subjects.id,
          slug: subjects.slug,
          nameFr: subjects.nameFr,
          nameAr: subjects.nameAr,
          nameEn: subjects.nameEn,
          color: subjects.color,
        })
        .from(subjects)
        .orderBy(asc(subjects.id))
        .catch(() => [])
    : [];

  const subjectRows =
    dbSubjects.length > 0
      ? dbSubjects
      : (await import("@/lib/in-memory-db")).getInMemorySubjects().map((s) => ({
          id: s.id,
          slug: s.slug,
          nameFr: s.nameFr,
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          color: s.color,
        }));

  return <AdminDashboard subjects={subjectRows} />;
}
