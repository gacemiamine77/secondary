"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Sparkles,
  Award,
  CheckCircle2,
  Share2,
  Copy,
  X,
  Flame,
} from "lucide-react";
import { useI18n } from "./providers";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  pointsEarned?: number;
  streakCount?: number;
  itemTitle?: string;
}

export function CelebrationModal({
  isOpen,
  onClose,
  title = "Félicitations pour votre réussite !",
  pointsEarned = 50,
  streakCount = 14,
  itemTitle = "Série d'exercices d'annales BAC",
}: CelebrationModalProps) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  // Confetti particles generator
  const confettiPieces = Array.from({ length: 30 });

  const handleCopyShare = () => {
    const text = `🎉 Je viens de terminer « ${itemTitle} » sur Massar et j'ai une série active de ${streakCount} jours ! Rejoins-moi sur https://massar.dz`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-accent/40 bg-panel p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Confetti Particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiPieces.map((_, i) => {
            const left = (i * 3.3) % 100;
            const delay = (i * 0.15) % 2;
            const color = [
              "#4f3ef0",
              "#f59e0b",
              "#10b981",
              "#ec4899",
              "#06b6d4",
            ][i % 5];
            return (
              <span
                key={i}
                className="absolute -top-3 h-2 w-2 rounded-sm animate-bounce"
                style={{
                  left: `${left}%`,
                  animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                  animationDelay: `${delay}s`,
                  backgroundColor: color,
                  transform: `rotate(${i * 24}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-soft hover:bg-panel-2 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Trophy Hero Icon */}
        <div className="mx-auto mt-2 mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 shadow-xl shadow-amber-500/20">
          <Trophy className="h-10 w-10 animate-pulse" />
        </div>

        <h3 className="font-display text-xl font-extrabold text-ink">{title}</h3>
        <p className="mt-1 text-xs text-soft">{itemTitle}</p>

        {/* Stats Highlights */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3">
            <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Points gagnés
            </span>
            <span className="mt-1 block font-display text-lg font-bold text-ink">
              +{pointsEarned} XP
            </span>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
            <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-500">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              Série active
            </span>
            <span className="mt-1 block font-display text-lg font-bold text-ink">
              {streakCount} jours
            </span>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleCopyShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Lien copié !" : "Partager ma réussite"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-ink shadow-md shadow-accent/25 hover:scale-105 transition-transform"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
