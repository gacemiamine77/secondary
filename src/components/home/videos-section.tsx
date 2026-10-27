"use client";

import { Eye, Play } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { VideoModal } from "@/components/video-modal";
import { resourceTitle } from "@/components/resource-card";
import { useI18n } from "@/components/providers";
import type { ResourceDTO } from "@/lib/constants";

export function VideosSection({ videos }: { videos: ResourceDTO[] }) {
  const { t, locale, fmt } = useI18n();
  const [current, setCurrent] = useState<ResourceDTO | null>(null);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="noise relative scroll-mt-24 overflow-hidden bg-[#0c0c14] py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-[15%] h-72 w-72 rounded-full bg-[#7c6cff]/15 blur-[110px]" />
        <div className="absolute bottom-0 end-[8%] h-72 w-72 rounded-full bg-teal/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          label={t("section.videos.label")}
          title={t("section.videos.title")}
          subtitle={t("section.videos.subtitle")}
          action={{ href: "/bibliotheque?type=video", label: t("section.videos.all") }}
        />

        <Reveal delay={0.15}>
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => {
                  setCurrent(video);
                  fetch(`/api/resources/${video.id}/view`, { method: "POST" }).catch(() => {});
                }}
                className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-start transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 sm:w-[330px]"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  {video.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnailUrl}
                      alt={resourceTitle(video, locale)}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="animate-pulse-ring absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">
                    <Play className="ms-0.5 h-4 w-4 fill-current" />
                  </span>
                  <span className="absolute end-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {video.durationMin} {t("common.min")}
                  </span>
                </div>
                <div className="p-4">
                  <p className="clamp-2 font-display text-sm font-bold leading-snug text-white">
                    {resourceTitle(video, locale)}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-white/50">
                    <span>
                      {t(`trimester.short.${video.trimester}`)} · {t(`level.short.${video.level}`)} · {video.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {fmt(video.views)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <VideoModal video={current} onClose={() => setCurrent(null)} />
    </section>
  );
}
