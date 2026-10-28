"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Crown,
  Timer,
  Flame,
  CheckCircle2,
  Award,
  Filter,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "../providers";
import type { LeaderboardStudent } from "@/lib/student-platform";
import { FocusTimerModal } from "../focus/focus-timer-modal";

interface LeaderboardViewProps {
  initialLeaderboard: LeaderboardStudent[];
  initialMostProductive: LeaderboardStudent | null;
}

export function LeaderboardView({
  initialLeaderboard,
  initialMostProductive,
}: LeaderboardViewProps) {
  const { locale } = useI18n();
  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>(initialLeaderboard);
  const [mostProductive, setMostProductive] = useState<LeaderboardStudent | null>(initialMostProductive);
  const [selectedCycle, setSelectedCycle] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("points");

  useEffect(() => {
    fetch(`/api/leaderboard?cycle=${selectedCycle}&sortBy=${selectedSort}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.mostProductiveStudent) setMostProductive(data.mostProductiveStudent);
      })
      .catch((err) => console.error(err));
  }, [selectedCycle, selectedSort]);

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-6 shadow-sm sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent mb-2">
                <Trophy className="h-3.5 w-3.5" />
                {locale === "ar" ? "لوحة الشرف الوطنية" : "Tableau d'Honneur & Classement"}
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {locale === "ar"
                  ? "ترتيب التلاميذ المتفوقين في الجزائر"
                  : "Classement des Élèves & Productivité"}
              </h1>
              <p className="mt-1 text-xs text-soft max-w-xl">
                {locale === "ar"
                  ? "المنافسة الإيجابية قائمة على ساعات التركيز المسجلة، إتمام الدروس ودقة حل التمارين."
                  : "Basé sur les heures enregistrées au chronomètre de focus, la complétion des cours et la précision des exercices."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <FocusTimerModal
                triggerButton={{
                  className: "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-105 transition-transform",
                  label: "Lancer une session Focus (+XP)",
                }}
              />
            </div>
          </div>
        </div>

        {/* MOST PRODUCTIVE STUDENT SECTION (User Request #5) */}
        {mostProductive && (
          <div className="mb-10 overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-panel to-amber-500/10 p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <img
                    src={mostProductive.avatar}
                    alt={mostProductive.name}
                    className="h-full w-full rounded-2xl border-2 border-amber-500 object-cover shadow-md"
                  />
                  <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-amber-950 shadow-md">
                    <Crown className="h-4 w-4 fill-amber-950" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-950 shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      ÉLÈVE LE PLUS PRODUCTIF DE LA SEMAINE
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mt-1">
                    {mostProductive.name}
                  </h3>
                  <p className="text-xs text-soft">
                    {mostProductive.gradeCode} · Code : {mostProductive.studentIdCode}
                  </p>
                </div>
              </div>

              {/* Productive metrics pill */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl border border-amber-500/30 bg-panel px-5 py-3 text-center shadow-sm">
                  <span className="text-[11px] font-semibold text-soft block">
                    Heures Focus Enregistrées
                  </span>
                  <span className="font-display text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                    <Timer className="h-5 w-5" />
                    {mostProductive.focusHoursThisWeek}h
                  </span>
                </div>

                <div className="rounded-2xl border border-line bg-panel px-5 py-3 text-center shadow-sm">
                  <span className="text-[11px] font-semibold text-soft block">
                    Précision Exercices
                  </span>
                  <span className="font-display text-2xl font-bold text-ink">
                    {mostProductive.accuracyPct}%
                  </span>
                </div>

                <div className="rounded-2xl border border-line bg-panel px-5 py-3 text-center shadow-sm">
                  <span className="text-[11px] font-semibold text-soft block">
                    Score Global
                  </span>
                  <span className="font-display text-2xl font-bold text-accent">
                    {mostProductive.points} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Cycle Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "Tous les cycles" },
              { id: "lycee", label: "Lycée (1AS - 3AS BAC)" },
              { id: "moyen", label: "Moyen (1AM - 4AM BEM)" },
              { id: "primaire", label: "Primaire (1AP - 5AP)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCycle(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCycle === tab.id
                    ? "bg-accent text-accent-ink shadow-sm"
                    : "border border-line bg-panel text-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-soft">Classer par :</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="rounded-2xl border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-accent"
            >
              <option value="points">Points Globaux (XP)</option>
              <option value="focus">Heures Focus Chronométrées (Cette semaine)</option>
              <option value="accuracy">Précision des réponses (%)</option>
              <option value="completion">Taux de complétion (%)</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-sm">
          <div className="divide-y divide-line">
            {leaderboard.map((student) => {
              const isTop3 = student.rank <= 3;
              const isCurrentUser = student.isCurrentUser;

              return (
                <div
                  key={student.id}
                  className={`flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                    isCurrentUser
                      ? "bg-accent/10 border-l-4 border-accent font-semibold"
                      : "hover:bg-panel-2/50"
                  }`}
                >
                  {/* Left: Rank & Student Profile */}
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center font-display text-sm font-extrabold">
                      {student.rank === 1 && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-amber-950 shadow-md">
                          1
                        </span>
                      )}
                      {student.rank === 2 && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-slate-900 shadow-md">
                          2
                        </span>
                      )}
                      {student.rank === 3 && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-amber-100 shadow-md">
                          3
                        </span>
                      )}
                      {student.rank > 3 && (
                        <span className="text-soft">#{student.rank}</span>
                      )}
                    </div>

                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-11 w-11 rounded-2xl border border-line object-cover"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-ink">
                          {student.name}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-accent px-2 py-0.2 text-[10px] font-bold text-accent-ink">
                            Vous
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-soft">{student.gradeCode}</span>
                    </div>
                  </div>

                  {/* Right: Metrics */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                    {/* Focus Hours */}
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-soft block">
                        Focus Sem.
                      </span>
                      <span className="font-display font-bold text-amber-500 flex items-center justify-center sm:justify-end gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        {student.focusHoursThisWeek}h
                      </span>
                    </div>

                    {/* Accuracy */}
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-soft block">
                        Précision
                      </span>
                      <span className="font-display font-bold text-emerald-400">
                        {student.accuracyPct}%
                      </span>
                    </div>

                    {/* Completion */}
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-soft block">
                        Complétion
                      </span>
                      <span className="font-display font-bold text-ink">
                        {student.completionPct}%
                      </span>
                    </div>

                    {/* Points */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-soft block">
                        Points
                      </span>
                      <span className="font-display text-sm font-black text-accent">
                        {student.points} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
