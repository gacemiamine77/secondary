"use client";

import { useState } from "react";
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  X,
  Layers,
  ChevronRight,
  ChevronLeft,
  Flame,
} from "lucide-react";
import { useI18n } from "../providers";

interface Flashcard {
  id: number;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  formula?: string;
  tip?: string;
  box: 1 | 2 | 3; // Leitner box
}

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    subject: "Mathématiques",
    topic: "Suites géométriques",
    question: "Quelle est la condition nécessaire et suffisante pour qu'une suite géométrique (q^n) converge vers 0 ?",
    answer: "La raison q doit vérifier |q| < 1 (soit -1 < q < 1).",
    formula: "\\lim_{n \\to +\\infty} q^n = 0 \\iff -1 < q < 1",
    tip: "Attention : si q = 1, la suite est constante (lim = 1), et si q ≤ -1, elle n'a pas de limite.",
    box: 1,
  },
  {
    id: 2,
    subject: "Physique & Chimie",
    topic: "Circuit RC",
    question: "Dans la charge d'un condensateur, que vaut la tension u_C à l'instant t = τ = RC ?",
    answer: "La tension atteint environ 63% de sa valeur maximale E (u_C = 0,63 E).",
    formula: "u_C(\\tau) = E(1 - e^{-1}) \\approx 0,632 \\times E",
    tip: "Pour la décharge, à t = τ, la tension résiduelle est de 37% de E (e^-1 ≈ 0,37).",
    box: 1,
  },
  {
    id: 3,
    subject: "Mathématiques",
    topic: "Théorème de Thalès",
    question: "Quelle est la différence fondamentale d'utilisation entre le théorème direct de Thalès et sa réciproque ?",
    answer: "Le théorème direct calcule des longueurs d'un triangle, tandis que la réciproque sert à démontrer que deux droites sont parallèles.",
    formula: "\\frac{OA}{OB} = \\frac{OC}{OD} \\text{ (alignement dans le même ordre)}",
    tip: "Rappelez toujours l'ordre des points alignés sur les sécantes !",
    box: 2,
  },
  {
    id: 4,
    subject: "Sciences Naturelles",
    topic: "Code Génétique",
    question: "Qu'est-ce qu'un codon non-sens (ou codon stop) et citez-en au moins un exemple ?",
    answer: "C'est un triplet de nucléotides sur l'ARNm qui ne correspond à aucun acide aminé et commande l'arrêt de la traduction. Exemples : UAA, UAG, UGA.",
    formula: "\\text{UAA, UAG, UGA = Codons Stop}",
    tip: "Ne confondez pas avec le codon d'initiation AUG qui code bien pour la Méthionine.",
    box: 2,
  },
  {
    id: 5,
    subject: "Philosophie",
    topic: "Dissertation",
    question: "En quoi consiste la 'Synthèse' dans un plan dialectique de dissertation ?",
    answer: "Elle ne consiste pas en un compromis tiède (50/50), mais en un dépassement conceptuel élevant la problématique à un niveau supérieur.",
    tip: "La synthèse répond à la question : sous quelle condition ou nouvelle perspective la contradiction thèse/antithèse est-elle résolue ?",
    box: 1,
  },
];

export function FlashcardsModal({
  defaultTopic,
  triggerButton,
}: {
  defaultTopic?: string;
  triggerButton?: {
    className?: string;
    label?: string;
  };
}) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleBoxReview = (success: boolean) => {
    setCards((prev) =>
      prev.map((c, idx) => {
        if (idx !== currentIndex) return c;
        const newBox = success
          ? (Math.min(3, c.box + 1) as 1 | 2 | 3)
          : (1 as const);
        return { ...c, box: newBox };
      })
    );

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const box1Count = cards.filter((c) => c.box === 1).length;
  const box2Count = cards.filter((c) => c.box === 2).length;
  const box3Count = cards.filter((c) => c.box === 3).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerButton?.className ??
          "inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm"
        }
      >
        <Layers className="h-4 w-4 text-accent" />
        <span>
          {triggerButton?.label ??
            (locale === "ar"
              ? "بطاقات المراجعة التفاعلية (Leitner)"
              : "Flashcards Répétition Espacée")}
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
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-md">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {locale === "ar"
                      ? "نظام لايتنر للتكرار المتباعد"
                      : "Flashcards : Système Leitner (Répétition Espacée)"}
                  </h3>
                  <p className="text-xs text-soft">
                    {defaultTopic
                      ? `Notion ciblée : ${defaultTopic}`
                      : "Comblez vos lacunes avec la mémorisation active"}
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

            {/* Leitner Boxes indicator */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-center text-xs">
                <span className="block font-bold text-rose-400">Boîte 1 (Tous les jours)</span>
                <span className="text-[11px] text-soft">{box1Count} cartes</span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-center text-xs">
                <span className="block font-bold text-amber-400">Boîte 2 (Tous les 3j)</span>
                <span className="text-[11px] text-soft">{box2Count} cartes</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-xs">
                <span className="block font-bold text-emerald-400">Boîte 3 (Maîtrisé)</span>
                <span className="text-[11px] text-soft">{box3Count} cartes</span>
              </div>
            </div>

            {/* Flip Card Container */}
            <div className="mt-5 min-h-[260px]">
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className={`group relative flex min-h-[260px] cursor-pointer flex-col justify-between rounded-3xl border border-line p-6 text-center transition-all duration-300 shadow-sm ${
                  isFlipped
                    ? "bg-accent/10 border-accent/40"
                    : "bg-paper hover:border-line hover:shadow-md"
                }`}
              >
                {/* Card Top Pill */}
                <div className="flex items-center justify-between text-xs text-soft">
                  <span className="rounded-full bg-panel px-3 py-1 font-semibold text-accent">
                    {currentCard.subject} · {currentCard.topic}
                  </span>
                  <span className="font-mono text-[11px]">
                    Boîte {currentCard.box} · {currentIndex + 1}/{cards.length}
                  </span>
                </div>

                {/* Question or Answer */}
                <div className="my-auto px-4 py-6">
                  {!isFlipped ? (
                    <div>
                      <h4 className="font-display text-base font-bold text-ink leading-relaxed">
                        {currentCard.question}
                      </h4>
                      <p className="mt-3 text-xs text-soft flex items-center justify-center gap-1">
                        <RotateCw className="h-3 w-3" />
                        Cliquez sur la carte pour révéler la réponse
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-display text-base font-bold text-accent leading-relaxed">
                        {currentCard.answer}
                      </h4>
                      {currentCard.formula && (
                        <div className="mt-3 inline-block rounded-xl border border-line bg-panel px-4 py-2 font-mono text-xs text-ink">
                          {currentCard.formula}
                        </div>
                      )}
                      {currentCard.tip && (
                        <p className="mt-3 text-xs text-soft italic">
                          Astuce BAC : {currentCard.tip}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Indicator */}
                <div className="text-[11px] text-soft">
                  {isFlipped ? "Évaluez votre rappel ci-dessous" : "Mémorisation active"}
                </div>
              </div>
            </div>

            {/* Evaluation Buttons */}
            {isFlipped ? (
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleBoxReview(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/20"
                >
                  <XCircle className="h-4 w-4" />
                  <span>À revoir (Retour Boîte 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBoxReview(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Maîtrisé (Avancer)</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex((p) => p - 1);
                  }}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-soft hover:text-ink disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédente
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-ink shadow-md"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Révéler la réponse</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === cards.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex((p) => p + 1);
                  }}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-soft hover:text-ink disabled:opacity-40"
                >
                  Suivante
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
