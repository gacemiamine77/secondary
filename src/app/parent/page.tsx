import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParentDashboard } from "@/components/parent/parent-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portail Parents & Suivi de Scolarité — Massar",
  description:
    "Suivez l'assiduité, les heures de travail et les dates des examens officiels (BEM, BAC) de votre enfant en toute transparence.",
};

export default function ParentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <ParentDashboard />
      </main>
      <Footer />
    </div>
  );
}
