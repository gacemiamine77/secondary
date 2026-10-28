import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StudyRoomView } from "@/components/study-room/study-room-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace d'Étude Virtuel & Digital Notebook — Massar",
  description:
    "Rejoignez les salons d'entraide par matière, rédigez et exportez des notes collaboratives sur le cahier numérique partagé, et planifiez des sessions de révision.",
};

export default function EspaceEtudePage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <StudyRoomView />
      </main>
      <Footer />
    </div>
  );
}
