"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageCircleQuestion,
  Send,
  X,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useI18n } from "../providers";

interface AskTeacherModalProps {
  contextReference?: string;
  defaultSubject?: string;
  triggerButton?: {
    className?: string;
    label?: string;
    variant?: "primary" | "secondary" | "subtle";
  };
}

export function AskTeacherModal({
  contextReference = "Ressource Massar",
  defaultSubject = "Mathématiques",
  triggerButton,
}: AskTeacherModalProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjectsList = [
    "Mathématiques",
    "Physique & Chimie",
    "Sciences Naturelles",
    "Langue Arabe",
    "Langue Française",
    "Langue Anglaise",
    "Philosophie",
    "Histoire-Géographie",
    "Éducation Islamique",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/teacher-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: "Amina Benali",
          subject,
          question: questionText.trim(),
          contextReference,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
          setQuestionText("");
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerButton?.className ??
          "inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-all hover:bg-accent hover:text-accent-ink shadow-sm"
        }
      >
        <MessageCircleQuestion className="h-4 w-4" />
        <span>
          {triggerButton?.label ??
            (locale === "ar"
              ? "اسأل أستاذاً"
              : locale === "en"
              ? "Ask a Teacher"
              : "Poser une question à un enseignant")}
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
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-md">
                  <MessageCircleQuestion className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {locale === "ar"
                      ? "اطرح سؤالك على أساتذة مسار"
                      : locale === "en"
                      ? "Ask a Teacher & Tutor"
                      : "Poser une question à un Enseignant"}
                  </h3>
                  <p className="text-xs text-soft">
                    {locale === "ar"
                      ? "توجيه السؤال مباشرة إلى فريق الأساتذة المعتمدين"
                      : locale === "en"
                      ? "Direct routing to our certified subject matter tutors"
                      : "Réponse détaillée de nos formateurs sous 24h"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-soft hover:bg-panel-2 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-base font-bold text-ink">
                  {locale === "ar" ? "تم إرسال سؤالك بنجاح !" : "Question transmise avec succès !"}
                </h4>
                <p className="mt-1.5 text-xs text-soft">
                  {locale === "ar"
                    ? "تم إشعار الأستاذ المشرف، ستصلك الإجابة في صندوق الرسائل."
                    : "L'enseignant a été notifié. La réponse apparaîtra dans votre profil."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="rounded-2xl border border-line/60 bg-paper/50 p-3 text-xs text-soft">
                  <span className="font-semibold text-ink">
                    {locale === "ar" ? "مرجع الدرس / التمرين : " : "Contexte : "}
                  </span>
                  {contextReference}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-soft mb-1.5">
                    {locale === "ar" ? "المادة" : "Matière concernée"}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-2xl border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-soft mb-1.5">
                    {locale === "ar"
                      ? "صياغة السؤال بدقة"
                      : "Votre question (soyez le plus précis possible)"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder={
                      locale === "ar"
                        ? "مثال: لم أفهم كيف تم الانتقال من الخطوة 2 إلى 3 في حساب النهاية..."
                        : "Ex: Je n'ai pas compris comment factoriser par le terme de plus haut degré à l'étape 2..."
                    }
                    className="w-full rounded-2xl border border-line bg-panel p-3.5 text-sm text-ink outline-none placeholder:text-soft focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-soft hover:bg-panel-2"
                  >
                    {locale === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !questionText.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-ink shadow-md shadow-accent/25 transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>
                      {submitting
                        ? locale === "ar"
                          ? "جارٍ الإرسال..."
                          : "Envoi..."
                        : locale === "ar"
                        ? "إرسال إلى الأستاذ"
                        : "Envoyer ma question"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
