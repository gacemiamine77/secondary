import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LiveCoursesClient } from "@/components/courses/live-courses-client";
import { getLiveCourses } from "@/lib/in-memory-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Formations & Cours en Direct — Massar",
  description:
    "Mise en relation entre formateurs et étudiants : sessions de cours en visioconférence, ateliers de révision intensifs pour Primaire, Moyen et Lycée (5e, BEM, BAC).",
};

export default async function LiveCoursesPage() {
  const courses = getLiveCourses();

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <Navbar />
      <LiveCoursesClient initialCourses={courses} />
      <Footer />
    </main>
  );
}
