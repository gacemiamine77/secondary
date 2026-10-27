"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = video
    ? locale === "ar"
      ? video.titleAr
      : locale === "en"
        ? video.titleEn
        : video.titleFr
    : "";

  return (
    <AnimatePresence>
      {video && video.videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#101018] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-white/50">
                  {t(`trimester.short.${video.trimester}`)} · {t(`level.short.${video.level}`)} · {video.year}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <video
              src={video.videoUrl}
              controls
              autoPlay
              playsInline
              poster={video.thumbnailUrl ?? undefined}
              className="aspect-video w-full bg-black object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
