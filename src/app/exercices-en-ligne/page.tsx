import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExercisesClient } from "@/components/exercises/exercises-client";
import { getInteractiveExercises } from "@/lib/in-memory-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Correction des Exercices en Ligne — Massar",
  description:
    "Résolvez et corrigez en ligne des exercices de Mathématiques, Physique, Sciences et Langues pour tous les niveaux (Primaire, Moyen, Lycée). Corrigés pas à pas et conseils méthodologiques.",
};

export default async function ExercisesPage() {
  const exercises = getInteractiveExercises();

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <Navbar />
      <ExercisesClient initialExercises={exercises} />
      <Footer />
    </main>
  );
}
