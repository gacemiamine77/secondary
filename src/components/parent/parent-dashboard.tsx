"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  Award,
  AlertCircle,
  TrendingUp,
  Download,
  BookOpen,
} from "lucide-react";
import { useI18n } from "../providers";

export function ParentDashboard() {
  const { locale } = useI18n();
  const [studentCode, setStudentCode] = useState("MASSAR-2026-DZ");
  const [isLinked, setIsLinked] = useState(true);

  // Countdown to BAC and BEM 2026 (June 2026)
  const bacDaysLeft = 214;
  const bemDaysLeft = 207;

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-6 shadow-sm sm:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Espace Parents & Tuteurs Légaux
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Suivi de la Scolarité & Préparation aux Examens
              </h1>
              <p className="mt-1 text-xs text-soft max-w-xl">
                Consultez le temps de révision hebdomadaire certifié de votre enfant, ses matières fortes et ses échéances d'examens nationaux (BAC & BEM).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Compte Élève Lié
              </span>
            </div>
          </div>
        </div>

        {/* Child Profile Bar */}
        <div className="mb-8 rounded-3xl border border-line bg-panel p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                alt="Amina Benali"
                className="h-16 w-16 rounded-2xl border-2 border-accent object-cover shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Amina Benali
                  </h3>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                    3AS Scientifique · Baccalauréat
                  </span>
                </div>
                <p className="text-xs text-soft">
                  Élève au Lycée Émir Abdelkader (Alger) · Code : <code className="font-mono text-ink">MASSAR-2026-DZ</code>
                </p>
              </div>
            </div>

            {/* Countdown badge */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-line bg-paper/60 px-4 py-2 text-center">
                <span className="text-[10px] uppercase font-bold text-soft block">Compte à Rebours BAC</span>
                <span className="font-display text-lg font-black text-rose-500">J - {bacDaysLeft}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics for Parents */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-soft font-semibold">
              <span>Temps d'Étude Hebdomadaire</span>
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-ink">14.5 h</span>
              <span className="text-xs font-bold text-emerald-400">+29% vs sem. passée</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              Objectif recommandé : 12h à 15h par semaine.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold">
              <span>Régularité & Série Active</span>
              <Flame className="h-4 w-4 fill-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-ink">14 jours</span>
              <span className="text-xs font-semibold text-amber-500">Ininterrompus</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              Connectée quotidiennement pour réviser et s'entraîner.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-soft font-semibold">
              <span>Exercices Corrigés Validés</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-ink">64 / 80</span>
              <span className="text-xs font-bold text-accent">80% du programme</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              Précision globale des réponses : 88.5%.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-soft font-semibold">
              <span>Matière Prioritaire</span>
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-lg font-bold text-ink">Philosophie (72%)</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              Conseil : encourager la rédaction de plans de dissertation.
            </p>
          </div>
        </div>

        {/* Exam Schedule & Important Milestones */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Examinations Calendar */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-ink">
                Calendrier des Épreuves Officielles
              </h3>
              <Calendar className="h-4 w-4 text-accent" />
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: "Compositions du 1er Trimestre", date: "Fin Novembre 2025", status: "En préparation active" },
                { title: "BAC Blanc Régional (1ère session)", date: "Février 2026", status: "À venir" },
                { title: "Compositions du 2ème Trimestre", date: "Mars 2026", status: "À venir" },
                { title: "Examen Officiel du Baccalauréat 2026", date: "Début Juin 2026", status: "Date officielle" },
              ].map((ev, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-line/60 bg-paper/60 p-3.5">
                  <div>
                    <span className="font-bold text-ink block">{ev.title}</span>
                    <span className="text-[11px] text-soft">{ev.date}</span>
                  </div>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher observations & Advice for Parents */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-ink mb-2">
              Observations des Enseignants Partenaires
            </h3>
            <p className="text-xs text-soft mb-4">
              Notes pédagogiques transmises par les professeurs lors des cours en direct.
            </p>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-line/60 bg-paper/60 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-ink">M. Benali (Mathématiques)</span>
                  <span className="text-[10px] text-soft">Il y a 3 jours</span>
                </div>
                <p className="text-soft leading-relaxed">
                  « Amina fait preuve d'une excellente rigueur dans l'étude des suites et des fonctions. Je lui conseille de consolider la rapidité de calcul sur les limites indéterminées. »
                </p>
              </div>

              <div className="rounded-2xl border border-line/60 bg-paper/60 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-ink">Mme Khelifi (Physique-Chimie)</span>
                  <span className="text-[10px] text-soft">La semaine dernière</span>
                </div>
                <p className="text-soft leading-relaxed">
                  « Participation active lors des séances directes. Les schémas de montages électriques sont très bien maîtrisés. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
