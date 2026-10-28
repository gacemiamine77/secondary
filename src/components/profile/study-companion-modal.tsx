"use client";

import { useState } from "react";
import {
  Users,
  X,
  Flame,
  Award,
  Timer,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";
import type { StudentProfile } from "@/lib/student-platform";
import { useI18n } from "../providers";

interface CompanionData {
  id: string;
  name: string;
  avatar: string;
  gradeCode: string;
  streakDays: number;
  studyHoursThisWeek: number;
  exercisesCompleted: number;
  overallAccuracy: number;
  mathsScore: number;
  physiqueScore: number;
  sciencesScore: number;
}

const PEER_COMPANIONS: CompanionData[] = [
  {
    id: "comp-1",
    name: "Yacine Touati",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    gradeCode: "3AS Maths",
    streakDays: 18,
    studyHoursThisWeek: 21.5,
    exercisesCompleted: 78,
    overallAccuracy: 93.4,
    mathsScore: 94,
    physiqueScore: 90,
    sciencesScore: 88,
  },
  {
    id: "comp-2",
    name: "Karim Mansouri",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    gradeCode: "3AS Math-Élem",
    streakDays: 12,
    studyHoursThisWeek: 16.8,
    exercisesCompleted: 68,
    overallAccuracy: 86.2,
    mathsScore: 86,
    physiqueScore: 84,
    sciencesScore: 82,
  },
  {
    id: "comp-3",
    name: "Sara Khelifi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
    gradeCode: "4AM BEM",
    streakDays: 16,
    studyHoursThisWeek: 13.2,
    exercisesCompleted: 82,
    overallAccuracy: 91.0,
    mathsScore: 91,
    physiqueScore: 88,
    sciencesScore: 95,
  },
];

export function StudyCompanionModal({
  currentStudent,
  triggerButton,
}: {
  currentStudent: StudentProfile;
  triggerButton?: {
    className?: string;
    label?: string;
  };
}) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompanionId, setSelectedCompanionId] = useState("comp-1");
  const [challengeSent, setChallengeSent] = useState(false);

  const companion =
    PEER_COMPANIONS.find((c) => c.id === selectedCompanionId) || PEER_COMPANIONS[0];

  const handleSendChallenge = () => {
    setChallengeSent(true);
    setTimeout(() => setChallengeSent(false), 3000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerButton?.className ??
          "inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm"
        }
      >
        <Users className="h-4 w-4 text-accent" />
        <span>
          {triggerButton?.label ??
            (locale === "ar" ? "مقارنة مع رفيق دراسة" : "Comparer avec un Compagnon d'étude")}
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-md">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {locale === "ar"
                      ? "المقارنة الثنائية والمنافسة الإيجابية"
                      : "Study Companion : Comparateur d'Apprentissage"}
                  </h3>
                  <p className="text-xs text-soft">
                    {locale === "ar"
                      ? "قارن إحصائياتك مع زملائك لتحفيز الاستمرارية والتفوق"
                      : "Mesurez vos statistiques côte-à-côte pour vous motiver mutuellement"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-soft hover:bg-panel-2 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Select companion */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-semibold text-soft">
                {locale === "ar" ? "اختر الرفيق : " : "Compagnon :"}
              </span>
              {PEER_COMPANIONS.map((peer) => (
                <button
                  key={peer.id}
                  type="button"
                  onClick={() => setSelectedCompanionId(peer.id)}
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCompanionId === peer.id
                      ? "border-accent bg-accent/10 text-accent font-semibold shadow-sm"
                      : "border-line bg-paper text-soft hover:text-ink"
                  }`}
                >
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span>{peer.name}</span>
                </button>
              ))}
            </div>

            {/* Side-by-side comparison grid */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              {/* Left: Current Student */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-center">
                <div className="relative mx-auto mb-2 h-14 w-14">
                  <img
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
                    className="h-full w-full rounded-full border-2 border-accent object-cover shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-accent px-1.5 py-0.2 text-[9px] font-bold text-accent-ink">
                    Vous
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-ink">{currentStudent.name}</h4>
                <p className="text-[11px] text-soft">{currentStudent.gradeCode} · Lycée</p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Série active
                    </span>
                    <span className="font-bold text-ink">{currentStudent.streakDays} jours</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Timer className="h-3.5 w-3.5 text-accent" />
                      Focus cette sem.
                    </span>
                    <span className="font-bold text-ink">
                      {currentStudent.studyHoursThisWeek}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Exercices faits
                    </span>
                    <span className="font-bold text-ink">
                      {currentStudent.exercisesCompleted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Award className="h-3.5 w-3.5 text-indigo-400" />
                      Précision
                    </span>
                    <span className="font-bold text-ink">
                      {currentStudent.overallAccuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Companion */}
              <div className="rounded-2xl border border-line bg-paper/60 p-4 text-center">
                <div className="relative mx-auto mb-2 h-14 w-14">
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    className="h-full w-full rounded-full border-2 border-line object-cover shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-panel-2 px-1.5 py-0.2 text-[9px] font-bold text-soft">
                    Binôme
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-ink">{companion.name}</h4>
                <p className="text-[11px] text-soft">{companion.gradeCode}</p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Série active
                    </span>
                    <span className="font-bold text-ink">{companion.streakDays} jours</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Timer className="h-3.5 w-3.5 text-accent" />
                      Focus cette sem.
                    </span>
                    <span className="font-bold text-ink">
                      {companion.studyHoursThisWeek}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Exercices faits
                    </span>
                    <span className="font-bold text-ink">
                      {companion.exercisesCompleted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-panel px-3 py-2">
                    <span className="flex items-center gap-1.5 text-soft">
                      <Award className="h-3.5 w-3.5 text-indigo-400" />
                      Précision
                    </span>
                    <span className="font-bold text-ink">
                      {companion.overallAccuracy}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Mastery Comparison Bars */}
            <div className="mt-5 rounded-2xl border border-line bg-paper/40 p-4">
              <h5 className="text-xs font-bold text-ink mb-3">
                {locale === "ar" ? "مقارنة التمكن من المواد" : "Maîtrise comparative par matière"}
              </h5>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-soft">Mathématiques (Vous 88% vs {companion.mathsScore}%)</span>
                    <span className="font-bold text-accent">
                      {88 >= companion.mathsScore ? "Avantage Vous" : `Avantage ${companion.name.split(" ")[0]}`}
                    </span>
                  </div>
                  <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-accent rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-soft">Physique & Chimie (Vous 82% vs {companion.physiqueScore}%)</span>
                    <span className="font-bold text-accent">
                      {82 >= companion.physiqueScore ? "Avantage Vous" : `Avantage ${companion.name.split(" ")[0]}`}
                    </span>
                  </div>
                  <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-xs text-soft">
                Code ami : <code className="font-mono text-ink">MASSAR-2026-DZ</code>
              </span>

              <button
                type="button"
                onClick={handleSendChallenge}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-ink shadow-md shadow-accent/25 hover:scale-105 transition-transform"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {challengeSent
                    ? "Défi d'étude 2h envoyé !"
                    : `Défier ${companion.name.split(" ")[0]} en session`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
