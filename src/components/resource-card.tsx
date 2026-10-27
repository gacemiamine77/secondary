"use client";

import { Download, Eye, FileText, Play } from "lucide-react";
import { useState } from "react";
import { TYPE_META, type ResourceDTO, type ResourceType } from "@/lib/constants";
import { useI18n } from "@/components/providers";

export function resourceTitle(r: ResourceDTO, locale: string) {
  return locale === "ar" ? r.titleAr : locale === "en" ? r.titleEn : r.titleFr;
}

export function subjectName(r: ResourceDTO, locale: string) {
  return locale === "ar"
    ? r.subjectNameAr
    : locale === "en"
      ? r.subjectNameEn
      : r.subjectNameFr;
}

export function ResourceCard({
  resource,
  onWatch,
}: {
  resource: ResourceDTO;
  onWatch?: (r: ResourceDTO) => void;
}) {
  const { t, locale, fmt } = useI18n();
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState({
    views: resource.views,
    downloads: resource.downloads,
  });

  const type = (resource.type as ResourceType) ?? "course";
  const meta = TYPE_META[type] ?? TYPE_META.course;
  const TypeIcon = meta.icon;
  const isVideo = type === "video";
  const title = resourceTitle(resource, locale);

  const doView = async () => {
    if (busy) return;
    if (isVideo) {
      setCounts((c) => ({ ...c, views: c.views + 1 }));
      fetch(`/api/resources/${resource.id}/view`, { method: "POST" }).catch(() => {});
      onWatch?.(resource);
      return;
    }
    if (!resource.fileUrl) return;
    setBusy(true);
    try {
      setCounts((c) => ({ ...c, views: c.views + 1 }));
      fetch(`/api/resources/${resource.id}/view`, { method: "POST" }).catch(() => {});
      window.open(resource.fileUrl, "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  };

  const doDownload = async () => {
    if (busy || !resource.fileUrl) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/download`, {
        method: "POST",
      });
      const data = (await res.json()) as { fileUrl?: string | null; downloads?: number };
      if (typeof data.downloads === "number") {
        setCounts((c) => ({ ...c, downloads: data.downloads! }));
      }
      const url = data.fileUrl ?? resource.fileUrl;
      const a = document.createElement("a");
      a.href = url.includes("?") ? url : `${url}?dl=1`;
      a.download = url.split("/").pop() ?? "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(resource.fileUrl, "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel">
      {/* Visual header */}
      {isVideo ? (
        <button
          type="button"
          onClick={doView}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-black text-start"
          aria-label={t("common.watch")}
        >
          {resource.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resource.thumbnailUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="animate-pulse-ring absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="ms-0.5 h-5 w-5 fill-current" />
          </span>
          <span className="absolute end-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {resource.durationMin} {t("common.min")}
          </span>
        </button>
      ) : (
        <div
          className="relative flex h-32 items-center justify-center overflow-hidden"
          style={{ background: meta.gradient }}
        >
          <TypeIcon className="absolute -end-4 -top-6 h-32 w-32 rotate-12 text-white/15 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
          <FileText className="h-12 w-12 text-white/90 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105" strokeWidth={1.5} />
          <span className="absolute start-4 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {t(`type.${type}`)}
          </span>
          <span className="absolute end-4 bottom-3 text-[11px] font-semibold text-white/85">
            {resource.pages} {t("common.pages")} · {resource.sizeMb}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: resource.subjectColor,
              backgroundColor: `${resource.subjectColor}18`,
            }}
          >
            {subjectName(resource, locale)}
          </span>
          <span className="text-[11px] font-semibold text-soft">
            {resource.gradeCode || (resource.level ? t(`level.short.${resource.level}`) : "")} · {t(`trimester.short.${resource.trimester}`)} · {fmt(resource.year)}
          </span>
        </div>

        <h3 className="clamp-2 font-display mt-3 text-[15px] font-bold leading-snug text-ink">
          {title}
        </h3>
        {resource.teacherName && (
          <p className="mt-1.5 text-xs text-soft">{resource.teacherName}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-3 text-[11px] font-medium text-soft">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {fmt(counts.views)}
            </span>
            {!isVideo && (
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {fmt(counts.downloads)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isVideo ? (
              <button
                type="button"
                onClick={doView}
                className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-bold text-accent-ink transition-transform hover:scale-105"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {t("common.watch")}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={doView}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-accent hover:text-accent"
                  aria-label={t("common.view")}
                  title={t("common.view")}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={doDownload}
                  disabled={busy}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-bold text-accent-ink transition-transform hover:scale-105 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("common.download")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-3xl border border-line bg-panel">
      <div className="h-32 bg-panel-2" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-2/3 rounded-full bg-panel-2" />
        <div className="h-4 w-full rounded-full bg-panel-2" />
        <div className="h-4 w-1/2 rounded-full bg-panel-2" />
        <div className="mt-auto flex justify-between pt-4">
          <div className="h-6 w-20 rounded-full bg-panel-2" />
          <div className="h-9 w-24 rounded-full bg-panel-2" />
        </div>
      </div>
    </div>
  );
}
