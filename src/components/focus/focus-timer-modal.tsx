"use client";

import { useEffect, useState, useRef } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Coffee,
  CheckCircle,
  Flame,
} from "lucide-react";
import { useI18n } from "../providers";

interface FocusTimerModalProps {
  onSessionLogged?: (hours: number, points: number) => void;
  triggerButton?: {
    className?: string;
    label?: string;
  };
}

export function FocusTimerModal({ onSessionLogged, triggerButton }: FocusTimerModalProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [taskName, setTaskName] = useState("Révision BAC / Devoirs");
  const [ambientSound, setAmbientSound] = useState<string>("rain");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync timer when minutes preset changes while stopped
  const handleSelectPreset = (mins: number) => {
    setSelectedMinutes(mins);
    if (!isRunning) {
      setTimeLeftSeconds(mins * 60);
    }
  };

  // Sound generator (Web Audio API synthetic white/pink ambient noise, zero external audio dependency!)
  useEffect(() => {
    if (!soundEnabled || !isRunning) {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        // Pink-like soothing noise
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.12; // gentle soft volume
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = ambientSound === "waves" ? 450 : ambientSound === "alpha" ? 350 : 650;

      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
      noiseNodeRef.current = noise;
    } catch (e) {
      console.debug("Web audio not supported", e);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [soundEnabled, isRunning, ambientSound]);

  const handleFinishSession = async () => {
    const minsStudied = selectedMinutes;
    try {
      const res = await fetch("/api/focus-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minutes: minsStudied,
          taskLabel: taskName,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCompletedNotification(
          `Félicitations ! +${data.pointsEarned} pts gagnés et ${data.newTotalHours}h totalisées cette semaine !`
        );
        onSessionLogged?.(data.newTotalHours, data.pointsEarned);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Main countdown tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      // Completed session!
      setIsRunning(false);
      handleFinishSession();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeftSeconds]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedMinutes * 60);
    setCompletedNotification(null);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const progressPercent = ((selectedMinutes * 60 - timeLeftSeconds) / (selectedMinutes * 60)) * 100;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerButton?.className ??
          "inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-ink"
        }
      >
        <Timer className="h-4 w-4" />
        <span>{triggerButton?.label ?? (locale === "ar" ? "جلسة تركيز" : "Focus Timer")}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-ink shadow-md">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {locale === "ar"
                      ? "مؤقت التركيز والإنتاجية"
                      : "Chronomètre Focus & Pomodoro"}
                  </h3>
                  <p className="text-[11px] text-soft">
                    {locale === "ar"
                      ? "يكافئك بنقاط في تصنيف التلميذ الأكثر إنتاجية"
                      : "Enregistre vos heures pour le classement hebdomadaire"}
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

            {/* Notification on finish */}
            {completedNotification && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/15 p-3 text-xs font-medium text-emerald-400">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>{completedNotification}</span>
              </div>
            )}

            {/* Task input */}
            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-soft mb-1">
                {locale === "ar" ? "موضوع جلسة التركيز" : "Objectif de la session"}
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ex: Réviser les suites géométriques..."
                className="w-full rounded-2xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Presets */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleSelectPreset(mins)}
                  className={`rounded-xl px-3 py-1 text-xs font-semibold transition-colors ${
                    selectedMinutes === mins
                      ? "bg-accent text-accent-ink shadow-sm"
                      : "border border-line bg-paper text-soft hover:text-ink"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Circular Timer Display */}
            <div className="relative my-6 flex flex-col items-center justify-center">
              <svg className="h-52 w-52 -rotate-90 transform">
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  className="stroke-line"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  className="stroke-accent transition-all duration-500"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 92}
                  strokeDashoffset={2 * Math.PI * 92 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-extrabold tracking-tight text-ink">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xs font-medium text-soft flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {isBreak
                    ? locale === "ar"
                      ? "استراحة مستحقة"
                      : "Pause méritée"
                    : locale === "ar"
                    ? "تركيز كامل"
                    : "Pleine concentration"}
                </span>
              </div>
            </div>

            {/* Ambient sound toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-line bg-paper px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    soundEnabled ? "bg-accent text-accent-ink" : "bg-panel text-soft"
                  }`}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
                <span className="text-soft">
                  {soundEnabled
                    ? locale === "ar"
                      ? "أصوات مهدئة نشطة"
                      : "Ambiance apaisante active"
                    : locale === "ar"
                    ? "بدون صوت خلفية"
                    : "Sans bruit de fond"}
                </span>
              </div>

              {soundEnabled && (
                <select
                  value={ambientSound}
                  onChange={(e) => setAmbientSound(e.target.value)}
                  className="rounded-lg border border-line bg-panel px-2 py-1 text-[11px] text-ink outline-none"
                >
                  <option value="rain">Pluie douce</option>
                  <option value="waves">Vagues de concentration</option>
                  <option value="alpha">Ondes Alpha 432Hz</option>
                </select>
              )}
            </div>

            {/* Controls */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-soft hover:text-ink transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsRunning((prev) => !prev)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-105"
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimeLeftSeconds(5 * 60);
                  setSelectedMinutes(5);
                  setIsBreak(true);
                  setIsRunning(true);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-soft hover:text-ink transition-colors"
                title="Pause courte 5 min"
              >
                <Coffee className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
