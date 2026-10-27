"use client";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Radio,
  Sparkles,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";

export function InteractiveFeaturesSection() {
  const { dir } = useI18n();

  return (
    <section className="relative overflow-hidden border-t border-line/60 bg-gradient-to-b from-panel-2 via-paper to-panel py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3.5 py-1 text-xs font-bold text-teal">
              <Sparkles className="h-3.5 w-3.5" />
              Nouveautés Interactives
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
              Plus qu’une Bibliothèque : Une Vraie Salle de Classe en Ligne
            </h2>
            <p className="text-base text-soft">
              Apprenez activement grâce à nos modules de correction automatisée et participez à des cours en visioconférence animés par des enseignants chevronnés.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Feature 1: Correction en Ligne */}
          <Reveal delay={0.1}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 sm:p-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner">
                    <FileCheck2 className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    Auto-Évaluation Gratuite
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Correction des Exercices en Ligne
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">
                    Testez vos connaissances en temps réel avec nos séries d’exercices interactifs couvrant tous les cycles (Primaire, Moyen, Lycée).
                  </p>
                </div>

                {/* Micro demo visual */}
                <div className="space-y-2 rounded-2xl border border-line bg-paper p-4 text-xs">
                  <div className="flex items-center justify-between text-soft">
                    <span className="font-semibold text-accent">Exemple interactif :</span>
                    <span className="font-bold text-teal">+20 pts</span>
                  </div>
                  <p className="font-medium text-ink">
                    « Soit (u_n) définie par u_0 = 4 et u_{"{n+1}"} = (1/2)u_n + 3. Calculer sa limite... »
                  </p>
                  <div className="flex items-center gap-2 rounded-xl bg-teal/15 p-2 text-teal font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Corrigé type détaillé pas à pas & astuce du formateur révélés !</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-soft">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Feedback immédiat avec explications des erreurs courantes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Indices progressifs pour vous aider à débloquer le raisonnement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Suivi des scores et points de réussite
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-line/60 pt-6">
                <Link
                  href="/exercices-en-ligne"
                  className="inline-flex items-center gap-2 font-bold text-accent transition-colors hover:text-accent-strong"
                >
                  <span>Démarrer un exercice interactif</span>
                  <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Feature 2: Formations & Cours en Direct */}
          <Reveal delay={0.2}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-8 shadow-sm transition-all duration-300 hover:border-teal/40 hover:shadow-xl hover:shadow-teal/5 sm:p-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/15 text-teal shadow-inner">
                    <Radio className="h-7 w-7 animate-pulse" />
                  </div>
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                    Visioconférence & Replays
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Cours en Direct & Mise en Relation Formateurs
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">
                    Rejoignez nos formateurs diplômés et inspecteurs pour des cours hebdomadaires en direct, des séances de questions-réponses et des révisions ciblées pour les examens.
                  </p>
                </div>

                {/* Micro demo visual */}
                <div className="space-y-2 rounded-2xl border border-line bg-paper p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose animate-ping" />
                      <span className="font-bold text-rose">Prochaine session en direct :</span>
                    </div>
                    <span className="text-[11px] font-semibold text-soft">Samedi 18:00</span>
                  </div>
                  <p className="font-bold text-ink">
                    Stage Intensif BAC : Les Suites Numériques avec M. Benali
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-soft">
                    <span>Micro ouvert aux élèves · Tableau blanc partagé</span>
                    <span className="font-bold text-accent">24 / 30 inscrits</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-soft">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Plateforme interactive avec chat en direct et levée de main
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Enregistrements HD disponibles en replay illimité
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    Fiches résumées et supports de cours téléchargeables
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-line/60 pt-6">
                <Link
                  href="/cours-en-ligne"
                  className="inline-flex items-center gap-2 font-bold text-teal transition-colors hover:text-teal/80"
                >
                  <span>Consulter le planning des cours</span>
                  <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Subscription banner preview */}
        <Reveal delay={0.3}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-accent/10 via-panel to-panel-2 p-8 sm:p-10 shadow-sm flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Abonnements Élèves & Familles
              </span>
              <h3 className="font-display text-2xl font-bold text-ink">
                Passez à la vitesse supérieure avec le Pass Révision ou le Pass VIP
              </h3>
              <p className="text-xs sm:text-sm text-soft">
                Accédez à l’intégralité des cours en direct, aux corrigés interactifs illimités et à la correction personnalisée de vos devoirs par nos enseignants sous 24h.
              </p>
            </div>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-105 transition-transform shrink-0"
            >
              <span>Voir les formules & tarifs</span>
              <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
