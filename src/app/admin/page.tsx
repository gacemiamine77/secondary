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

  const subjectRows: AdminSubject[] = await db
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
    .catch(() => []);

  return <AdminDashboard subjects={subjectRows} />;
}
