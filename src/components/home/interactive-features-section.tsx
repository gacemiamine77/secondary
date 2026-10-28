"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Flame,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Radio,
  Sparkles,
  Timer,
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
              Écosystème Éducatif Complet
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
              Plus qu’une Bibliothèque : Une Vraie Salle de Classe en Ligne
            </h2>
            <p className="text-base text-soft">
              Apprenez activement grâce aux exercices interactifs, révisez en groupe dans les salons virtuels et suivez votre vélocité d'apprentissage au quotidien.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1: Correction en Ligne */}
          <Reveal delay={0.05}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl sm:p-7">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Exercices Corrigés en Ligne
                  </h3>
                  <p className="mt-1.5 text-xs text-soft leading-relaxed">
                    Auto-évaluation immédiate avec corrigés détaillés étape par étape et indices progressifs.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper p-3 text-[11px] text-soft">
                  <span className="font-bold text-teal block">Astuces officielles du BAC/BEM</span>
                  Feedback instantané à chaque étape.
                </div>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4">
                <Link
                  href="/exercices-en-ligne"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-strong"
                >
                  <span>S'entraîner maintenant</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Feature 2: Formations & Cours en Direct */}
          <Reveal delay={0.1}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:border-teal/40 hover:shadow-xl sm:p-7">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/15 text-teal shadow-inner">
                  <Radio className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Cours en Visioconférence Directe
                  </h3>
                  <p className="mt-1.5 text-xs text-soft leading-relaxed">
                    Séances hebdomadaires avec formateurs certifiés, micro ouvert et replays illimités en HD.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper p-3 text-[11px] text-soft">
                  <span className="font-bold text-rose-500 block">Stages intensifs BAC & BEM</span>
                  Tableau blanc interactif & questions en direct.
                </div>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4">
                <Link
                  href="/cours-en-ligne"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal/80"
                >
                  <span>Voir le planning live</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Feature 3: Espace d'Étude & Digital Notebook */}
          <Reveal delay={0.15}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl sm:p-7">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 shadow-inner">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Espace d'Étude & Cahier Partagé
                  </h3>
                  <p className="mt-1.5 text-xs text-soft leading-relaxed">
                    Rédigez et exportez des fiches de cours collaboratives en groupe sur le Digital Notebook.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper p-3 text-[11px] text-soft">
                  <span className="font-bold text-indigo-400 block">Salons d'entraide thématiques</span>
                  Export PDF & Markdown en 1 clic.
                </div>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4">
                <Link
                  href="/espace-etude"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Rejoindre un salon</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Feature 4: Profil, Vélocité & Classement */}
          <Reveal delay={0.2}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl sm:p-7">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-inner">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Tableau de Bord & Productivité
                  </h3>
                  <p className="mt-1.5 text-xs text-soft leading-relaxed">
                    Série quotidienne (flamme), radar de compétences, compagnon d'étude et classement national.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper p-3 text-[11px] text-soft">
                  <span className="font-bold text-amber-500 block">Chrono Focus & Pomodoro</span>
                  Vélocité d'apprentissage calculée chaque semaine.
                </div>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400"
                >
                  <span>Mon tableau de bord</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Subscription banner preview */}
        <Reveal delay={0.25}>
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
