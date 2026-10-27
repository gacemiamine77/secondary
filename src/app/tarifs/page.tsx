import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PricingClient } from "@/components/pricing/pricing-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Abonnements & Formules — Massar",
  description:
    "Découvrez les formules d'abonnement Massar pour les élèves du Primaire, Moyen et Lycée : cours en direct avec formateurs certifiés, exercices corrigés interactifs et préparation aux examens.",
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <Navbar />
      <PricingClient />
      <Footer />
    </main>
  );
}
