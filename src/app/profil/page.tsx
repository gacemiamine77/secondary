import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UserProfile } from "@/components/profile/user-profile";
import { getStudentStore } from "@/lib/student-platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil & Tableau de Bord de l'Élève — Massar",
  description:
    "Suivez votre taux de complétion, votre série d'apprentissage quotidienne, votre vélocité et analysez vos lacunes avec votre compagnon d'étude.",
};

export default function ProfilPage() {
  const store = getStudentStore();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <UserProfile
          initialStudent={store.student}
          initialTeacherQuestions={store.teacherQuestions}
        />
      </main>
      <Footer />
    </div>
  );
}
