import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { KeyboardShortcutsModal } from "@/components/keyboard-shortcuts";
import { OfflineIndicator } from "@/components/offline-indicator";
import "./globals.css";

export const metadata: Metadata = {
  title: "Massar — Plateforme Éducative Primaire, Moyen & Lycée",
  description:
    "Plateforme éducative pour les élèves du Primaire, Moyen et Lycée : cours, exercices corrigés en ligne, cours en direct avec formateurs certifiés et formules d'abonnement.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router: global fonts belong in the root layout */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink antialiased">
        <Providers>
          {children}
          <KeyboardShortcutsModal />
          <OfflineIndicator />
        </Providers>
      </body>
    </html>
  );
}
