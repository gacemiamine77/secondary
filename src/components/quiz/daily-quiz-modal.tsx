"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  X,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "../providers";

interface QuizQuestion {
  id: number;
  cycle: string;
  gradeCode: string;
  subject: string;
  question: string;
  options: { id: string; text: string }[];
}

interface ReviewItem {
  id: number;
  correctOptionId: string;
  explanation: string;
}

export function DailyQuizModal() {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [scoreToday, setScoreToday] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    pointsEarned: number;
    review: ReviewItem[];
  } | null>(null);

  // Load quiz status
  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) setQuestions(data.questions);
        if (data.isCompletedToday) {
          setIsCompletedToday(true);
          setScoreToday(data.scoreToday);
        }
      })
      .catch((err) => console.error("Load quiz error", err));
  }, []);

  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data);
        setIsCompletedToday(true);
        setScoreToday(data.score);
      }
    } catch (err) {
      console.error("Submit quiz error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const allAnswered =
    questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <>
      {/* Toast Reminder Banner for Daily Quiz */}
      {!isCompletedToday && (
        <aside
          aria-label="Rappel du quiz du jour"
          className="relative mb-6 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/15 via-panel to-panel p-4 shadow-sm sm:flex sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-ink">
                {locale === "ar"
                  ? "مسابقة المعرفة اليومية جاهزة !"
                  : locale === "en"
                  ? "Daily Knowledge Quiz Ready!"
                  : "Quiz du Jour Prêt ! (5 questions)"}
              </h3>
              <p className="text-xs text-soft">
                {locale === "ar"
                  ? "5 أسئلة سريعة لتعزيز ترتيبك وتثبيت شعلة النشاط اليومي (+125 نقطة)."
                  : "Boostez votre classement et entretenez votre série quotidienne (+125 pts)."}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-ink shadow-md shadow-accent/25 transition-transform hover:scale-105"
            >
              <span>{locale === "ar" ? "ابدأ المسابقة" : "Commencer le quiz"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Quiz Modal */}
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
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-ink shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {locale === "ar"
                      ? "تحدي المعرفة اليومي"
                      : "Daily Knowledge Quiz"}
                  </h3>
                  <p className="text-[11px] text-soft">
                    {result
                      ? locale === "ar"
                        ? "نتيجة الاختبار والمراجعة"
                        : "Résultats & Corrections"
                      : `Question ${currentIndex + 1} sur ${questions.length}`}
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

            {/* Results Screen */}
            {result ? (
              <div className="py-4">
                <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/10 p-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-ink">
                    Score : {result.score} / {result.total}
                  </h4>
                  <p className="mt-1 text-xs text-soft">
                    Vous avez remporté{" "}
                    <span className="font-bold text-accent">+{result.pointsEarned} points</span>{" "}
                    pour votre classement et votre série a progressé !
                  </p>
                </div>

                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {questions.map((q) => {
                    const rev = result.review.find((r) => r.id === q.id);
                    const userSelectedId = answers[q.id];
                    const isUserCorrect = userSelectedId === rev?.correctOptionId;
                    const correctOption = q.options.find((o) => o.id === rev?.correctOptionId);

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-3.5 text-xs ${
                          isUserCorrect
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-rose-500/30 bg-rose-500/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-ink">{q.question}</p>
                          {isUserCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="mt-1.5 text-soft">
                          <span className="font-bold">Bonne réponse : </span>
                          {correctOption?.text}
                        </p>
                        {rev?.explanation && (
                          <p className="mt-1 italic text-soft">{rev.explanation}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-accent-ink shadow-md"
                  >
                    Fermer et continuer
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              /* Questions in progress */
              <div className="mt-5 space-y-5">
                {/* Progress bar */}
                <div className="flex items-center gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i === currentIndex
                          ? "bg-accent"
                          : answers[questions[i].id]
                          ? "bg-emerald-500"
                          : "bg-line"
                      }`}
                    />
                  ))}
                </div>

                {/* Badge Subject & Question */}
                <div>
                  <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    {currentQ.subject} · {currentQ.gradeCode}
                  </span>
                  <h4 className="mt-2.5 text-sm font-semibold text-ink leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-start text-xs font-medium transition-all ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent font-semibold shadow-sm"
                            : "border-line bg-paper text-ink hover:border-line hover:bg-panel-2"
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                            isSelected
                              ? "border-accent bg-accent text-accent-ink"
                              : "border-line text-soft"
                          }`}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={handlePrev}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-soft hover:text-ink disabled:opacity-40"
                  >
                    Précédent
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 rounded-full bg-panel-2 px-5 py-2 text-xs font-semibold text-ink hover:bg-accent hover:text-accent-ink transition-colors"
                    >
                      <span>Suivant</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!allAnswered || isSubmitting}
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-ink shadow-md shadow-accent/25 hover:scale-105 disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? "Validation..." : "Valider mes réponses"}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-soft">
                Chargement des questions du jour...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
