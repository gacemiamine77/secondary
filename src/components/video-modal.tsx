"use client";

import { CheckCircle2, Clock, Download, ExternalLink, FastForward, Play, Volume2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ResourceDTO } from "@/lib/constants";
import { useI18n } from "@/components/providers";

export function VideoModal({
  video,
  onClose,
}: {
  video: ResourceDTO | null;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(true);
  }, [video]);

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const title = video
    ? locale === "ar"
      ? video.titleAr
      : locale === "en"
        ? video.titleEn
        : video.titleFr
    : "";

  const chapters = [
    { time: "00:00", title: "Introduction et rappel du programme officiel" },
    { time: "04:30", title: "Démonstration théorique pas-à-pas" },
    { time: "11:15", title: "Résolution d'un exercice d'application type" },
    { time: "16:40", title: "Astuces d'examen et erreurs fréquentes à éviter" },
  ];

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d16] shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 bg-black/40">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent tracking-wider">
                    {video.subjectNameFr}
                  </span>
                  <span className="text-[11px] text-white/50">
                    {t(`trimester.short.${video.trimester}`)} · {video.gradeCode || t(`level.short.${video.level}`)} · {video.year}
                  </span>
                </div>
                <h3 className="truncate font-display text-base font-bold text-white mt-0.5">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Stage & Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {!videoError ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl || "https://videos.pexels.com/video-files/6219854/6219854-uhd_4096_2160_30fps.mp4"}
                  controls
                  autoPlay
                  playsInline
                  poster={video.thumbnailUrl ?? undefined}
                  onError={() => setVideoError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-4">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <h4 className="font-bold text-lg">Lecture pédagogique optimisée</h4>
                  <p className="text-xs text-white/60 max-w-md mt-1">
                    Ce cours filmé est également disponible en direct haute résolution sur nos serveurs de visioconférence.
                  </p>
                  <button
                    type="button"
                    onClick={() => setVideoError(false)}
                    className="mt-4 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white hover:scale-105 transition-transform"
                  >
                    Réessayer la lecture
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls & Info Bar */}
            <div className="border-t border-white/10 bg-[#12121e] p-4 sm:p-5 flex-1 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-white/80">
                    <Clock className="h-4 w-4 text-accent" />
                    Durée totale : {video.durationMin || 18} min
                  </span>
                  {video.teacherName && (
                    <span className="text-xs text-white/50">
                      · Enseignant : <strong className="text-white/80">{video.teacherName}</strong>
                    </span>
                  )}
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 text-xs text-white">
                  <span className="text-[10px] text-white/50 px-2 font-bold uppercase">Vitesse :</span>
                  {[1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeRate(rate)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        playbackRate === rate ? "bg-accent text-white" : "hover:text-accent"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Chapters / Timeline */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5">
                  Chapitres & Découpage de la leçon :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {chapters.map((chap, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 text-xs text-white/80 border border-white/5 hover:border-accent/40 transition-colors"
                    >
                      <span className="font-mono text-[11px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-md shrink-0">
                        {chap.time}
                      </span>
                      <span className="truncate">{chap.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

