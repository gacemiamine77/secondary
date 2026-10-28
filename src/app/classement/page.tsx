import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";
import { getStudentStore } from "@/lib/student-platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement & Élève le Plus Productif — Massar",
  description:
    "Découvrez le classement national des élèves, les statistiques d'assiduité et la section spéciale consacrée à l'élève le plus productif de la semaine.",
};

export default function ClassementPage() {
  const store = getStudentStore();
  const sortedByFocus = [...store.leaderboard].sort(
    (a, b) => b.focusHoursThisWeek - a.focusHoursThisWeek
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <LeaderboardView
          initialLeaderboard={store.leaderboard}
          initialMostProductive={sortedByFocus[0] ?? null}
        />
      </main>
      <Footer />
    </div>
  );
}
