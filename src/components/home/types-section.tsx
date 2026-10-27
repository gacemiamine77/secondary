"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useI18n } from "@/components/providers";
import { RESOURCE_TYPES, TYPE_META, type MetaDTO } from "@/lib/constants";

export function TypesSection({ meta }: { meta: MetaDTO }) {
  const { t, fmt, dir } = useI18n();

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("section.types.label")}
          title={t("section.types.title")}
          subtitle={t("section.types.subtitle")}
        />

        <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-panel">
          {RESOURCE_TYPES.map((type, i) => {
            const meta2 = TYPE_META[type];
            const Icon = meta2.icon;
            const count = meta.typeCounts[type] ?? 0;
            return (
              <Reveal key={type} delay={i * 0.05}>
                <Link
                  href={`/bibliotheque?type=${type}`}
                  className="group relative flex items-center gap-4 border-b border-line px-5 py-6 transition-colors last:border-b-0 sm:gap-8 sm:px-8"
                >
                  <span
                    className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
                    style={{ background: meta2.gradient }}
                  />
                  <span className="font-display relative text-2xl font-extrabold text-line transition-colors duration-300 group-hover:text-white/40 sm:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/15"
                    style={{ background: meta2.gradient }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="font-display block truncate text-lg font-bold text-ink transition-colors duration-300 group-hover:text-white sm:text-2xl">
                      {t(`type.${type}`)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-soft transition-colors duration-300 group-hover:text-white/75 sm:text-sm">
                      {t(`typeDesc.${type}`)}
                    </span>
                  </span>
                  <span className="relative hidden rounded-full border border-line px-3 py-1 text-xs font-bold text-soft transition-colors duration-300 group-hover:border-white/30 group-hover:text-white sm:block">
                    {fmt(count)}
                  </span>
                  <ArrowUpRight
                    className={`relative h-5 w-5 shrink-0 text-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white ${
                      dir === "rtl" ? "-scale-x-100 group-hover:translate-x-1" : "group-hover:translate-x-1"
                    }`}
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
