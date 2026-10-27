"use client";

import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CYCLES, type EducationalCycle, type InteractiveExercise } from "@/lib/constants";
import { useI18n } from "@/components/providers";

interface Props {
  initialExercises: InteractiveExercise[];
}

export function ExercisesClient({ initialExercises }: Props) {
  const { dir } = useI18n();
  const [exercises] = useState<InteractiveExercise[]>(initialExercises);
  const [selectedCycle, setSelectedCycle] = useState<EducationalCycle | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Active exercise modal / drawer
  const [activeExercise, setActiveExercise] = useState<InteractiveExercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    pointsEarned: number;
  } | null>(null);
  const [isSubmitting, startSubmit] = useTransition();

  // User score & completed exercises
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const filtered = exercises.filter((ex) => {
    if (selectedCycle !== "all" && ex.cycle !== selectedCycle) return false;
    if (selectedDifficulty !== "all" && ex.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.statement.toLowerCase().includes(q) ||
        ex.subjectName.toLowerCase().includes(q) ||
        ex.gradeCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenExercise = (ex: InteractiveExercise) => {
    setActiveExercise(ex);
    setSelectedOption(null);
    setShowHint(false);
    setShowSolution(false);
    setResult(null);
  };

  const handleSubmitAnswer = () => {
    if (!activeExercise || !selectedOption) return;

    startSubmit(async () => {
      try {
        const res = await fetch("/api/exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit_answer",
            exerciseId: activeExercise.id,
            selectedOptionId: selectedOption,
          }),
        });
        const data = await res.json();
        setResult(data);
        setShowSolution(true);

        if (!completedIds.includes(activeExercise.id)) {
          setCompletedIds((prev) => [...prev, activeExercise.id]);
          if (data.isCorrect) {
            setScore((prev) => prev + data.pointsEarned);
          }
        }
      } catch (err) {
        console.error("submit answer error", err);
      }
    });
  };

  const handleResetCurrent = () => {
    setSelectedOption(null);
    setShowHint(false);
    setShowSolution(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-paper pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-8 shadow-sm lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Auto-Évaluation & Correction Guidée en Ligne
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Correction des Exercices en Ligne
              </h1>
              <p className="text-base text-soft sm:text-lg">
                Entraînez-vous avec des exercices interactifs tous cycles (Primaire, Moyen, Lycée). Bénéficiez d’une correction instantanée étape par étape et des conseils méthodologiques de nos formateurs.
              </p>
            </div>

            {/* Score Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-soft">Votre score</div>
                <div className="font-display text-2xl font-black text-ink">{score} pts</div>
                <div className="text-xs text-soft">{completedIds.length} exercice(s) résolu(s)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Cycle tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
            <button
              onClick={() => setSelectedCycle("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                selectedCycle === "all"
                  ? "bg-ink text-paper shadow-sm"
                  : "bg-panel border border-line text-soft hover:text-ink"
              }`}
            >
              Tous les cycles ({exercises.length})
            </button>
            {(["primaire", "moyen", "lycee"] as EducationalCycle[]).map((cKey) => {
              const meta = CYCLES[cKey];
              const count = exercises.filter((e) => e.cycle === cKey).length;
              const isSelected = selectedCycle === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => setSelectedCycle(cKey)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-accent text-accent-ink shadow-md shadow-accent/20"
                      : "bg-panel border border-line text-soft hover:text-ink"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.nameFr}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search & Difficulty bar */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-8">
              <Search className={`absolute top-3.5 h-4 w-4 text-soft ${dir === "rtl" ? "right-3.5" : "left-3.5"}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par notion, matière, classe (ex: Thalès, Suites, 3AS, 4AM)..."
                className={`w-full rounded-2xl border border-line bg-panel py-3 text-sm text-ink placeholder:text-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="all">Toutes les difficultés</option>
                <option value="facile">Niveau Facile (Notions de base)</option>
                <option value="moyen">Niveau Moyen (Application)</option>
                <option value="bac_bem">Type Examen Officiel (BAC / BEM / 5e)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => {
            const isCompleted = completedIds.includes(ex.id);
            const cycleMeta = CYCLES[ex.cycle];
            return (
              <div
                key={ex.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
              >
                <div className="space-y-4">
                  {/* Top tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${cycleMeta.color}18`,
                          color: cycleMeta.color,
                        }}
                      >
                        {cycleMeta.nameFr} · {ex.gradeCode}
                      </span>
                      {ex.difficulty === "bac_bem" && (
                        <span className="rounded-full bg-rose/10 px-2.5 py-0.5 text-xs font-bold text-rose">
                          BAC / BEM
                        </span>
                      )}
                    </div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-2 py-0.5 text-xs font-semibold text-teal">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Validé
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-soft">
                        +{ex.points} pts
                      </span>
                    )}
                  </div>

                  {/* Subject & Title */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-soft">
                      {ex.subjectName}
                    </div>
                    <h3 className="font-display mt-1 text-lg font-bold text-ink group-hover:text-accent">
                      {ex.title}
                    </h3>
                  </div>

                  {/* Preview Statement */}
                  <p className="line-clamp-3 text-xs leading-relaxed text-soft">
                    {ex.statement}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <span className="text-xs text-soft">
                    {ex.solutionSteps.length} étapes de correction
                  </span>
                  <button
                    onClick={() => handleOpenExercise(ex)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                  >
                    Résoudre & Corriger
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-line bg-panel p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-soft" />
            <h3 className="mt-4 text-lg font-bold text-ink">Aucun exercice trouvé</h3>
            <p className="mt-1 text-sm text-soft">
              Essayez de modifier votre recherche ou le cycle sélectionné.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Interactive Exercise Solver & Step-by-Step Correction */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-panel p-6 shadow-2xl sm:p-8">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                    {CYCLES[activeExercise.cycle].nameFr} · {activeExercise.gradeCode}
                  </span>
                  <span className="text-xs font-semibold text-soft">
                    {activeExercise.subjectName}
                  </span>
                </div>
                <h2 className="font-display mt-2 text-xl font-extrabold text-ink sm:text-2xl">
                  {activeExercise.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="rounded-full border border-line bg-panel-2 p-2 text-soft transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Statement */}
            <div className="mt-6 space-y-4 rounded-2xl border border-line/80 bg-paper p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-soft">
                Énoncé de l’exercice :
              </div>
              <p className="text-sm font-medium leading-relaxed text-ink whitespace-pre-line">
                {activeExercise.statement}
              </p>
              <div className="border-t border-line/60 pt-3">
                <span className="text-xs font-bold text-accent">Question : </span>
                <span className="text-sm font-bold text-ink">
                  {activeExercise.question}
                </span>
              </div>
            </div>

            {/* Answer Options (QCM) */}
            {activeExercise.options && activeExercise.options.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-soft">
                  Choisissez votre réponse :
                </div>
                <div className="space-y-2">
                  {activeExercise.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isRevealed = showSolution;
                    let optionStyle = "border-line bg-panel hover:bg-panel-2";

                    if (isSelected && !isRevealed) {
                      optionStyle = "border-accent bg-accent/10 text-accent font-semibold";
                    }
                    if (isRevealed) {
                      if (opt.isCorrect) {
                        optionStyle = "border-teal bg-teal/15 text-teal font-semibold";
                      } else if (isSelected && !opt.isCorrect) {
                        optionStyle = "border-rose bg-rose/15 text-rose font-semibold";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => !showSolution && setSelectedOption(opt.id)}
                        disabled={showSolution}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm transition-all ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-current text-xs font-bold uppercase">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isRevealed && opt.isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-teal" />
                        )}
                        {isRevealed && isSelected && !opt.isCorrect && (
                          <XCircle className="h-5 w-5 text-rose" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-soft transition-colors hover:text-ink"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  {showHint ? "Masquer l'indice" : "Besoin d'un indice ?"}
                </button>
                {showSolution && (
                  <button
                    type="button"
                    onClick={handleResetCurrent}
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-3 py-2 text-xs font-semibold text-soft transition-colors hover:text-ink"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Recommencer
                  </button>
                )}
              </div>

              {!showSolution && (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Validation..." : "Valider ma réponse"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHint && activeExercise.hints && (
              <div className="mt-4 space-y-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold">
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Indice(s) pour vous débloquer :
                </div>
                <ul className="list-inside list-disc space-y-1 pl-1">
                  {activeExercise.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instant Result Banner */}
            {result && (
              <div
                className={`mt-6 rounded-2xl border p-4 ${
                  result.isCorrect
                    ? "border-teal/30 bg-teal/10 text-teal"
                    : "border-rose/30 bg-rose/10 text-rose"
                }`}
              >
                <div className="flex items-center gap-2 font-display text-base font-bold">
                  {result.isCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Bonne réponse ! (+{result.pointsEarned} points)
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      Réponse incorrecte (+{result.pointsEarned} pts d’encouragement)
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed opacity-90">{result.feedback}</p>
              </div>
            )}

            {/* Step-by-Step Detailed Solution */}
            {showSolution && (
              <div className="mt-6 space-y-4 rounded-2xl border border-line bg-panel-2 p-5">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                    <BookOpen className="h-4 w-4 text-accent" />
                    Corrigé Type Détaillé & Méthode de Résolution
                  </div>
                  <span className="text-[11px] font-semibold text-soft">
                    {activeExercise.authorTeacher}
                  </span>
                </div>

                <div className="space-y-4">
                  {activeExercise.solutionSteps.map((step) => (
                    <div key={step.step} className="space-y-1.5 rounded-xl bg-panel p-4 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-accent">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[11px]">
                          {step.step}
                        </span>
                        {step.title}
                      </div>
                      <p className="text-xs leading-relaxed text-ink/90 whitespace-pre-line pl-7">
                        {step.content}
                      </p>
                      {step.keyFormula && (
                        <div className="mt-2 ml-7 rounded-lg bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-accent">
                          Formule clé : {step.keyFormula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {activeExercise.teacherTip && (
                  <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs text-ink">
                    <span className="font-bold text-accent">Conseil du formateur : </span>
                    {activeExercise.teacherTip}
                  </div>
                )}

                {/* Tutor connection CTA */}
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-accent/15 via-teal/15 to-transparent p-4">
                  <div>
                    <div className="text-xs font-bold text-ink">Vous bloquez sur une notion similaire ?</div>
                    <div className="text-[11px] text-soft">
                      Posez votre question directement à nos enseignants en direct.
                    </div>
                  </div>
                  <Link
                    href="/cours-en-ligne"
                    className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-ink hover:scale-105"
                  >
                    Voir les cours en direct
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
