"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useI18n } from "@/components/providers";
import { SUBJECT_ICONS, type MetaDTO } from "@/lib/constants";

export function SubjectsSection({ meta }: { meta: MetaDTO }) {
  const { t, locale, fmt, dir } = useI18n();

  if (meta.subjects.length === 0) return null;

  return (
    <section id="matieres" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("section.subjects.label")}
          title={t("section.subjects.title")}
          subtitle={t("section.subjects.subtitle")}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {meta.subjects.map((subject, i) => {
            const Icon = SUBJECT_ICONS[subject.slug] ?? SUBJECT_ICONS.default;
            const name =
              locale === "ar"
                ? subject.nameAr
                : locale === "en"
                  ? subject.nameEn
                  : subject.nameFr;
            return (
              <Reveal key={subject.slug} delay={(i % 5) * 0.06} className="h-full">
                <Link
                  href={`/bibliotheque?subject=${subject.slug}`}
                  className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel p-5"
                >
                  <div
                    className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${subject.color}, ${subject.color}bb)`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight
                      className={`h-4 w-4 text-soft opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                        dir === "rtl" ? "-scale-x-100 -translate-x-1" : "translate-x-1"
                      }`}
                    />
                  </div>
                  <h3 className="font-display mt-5 text-[15px] font-bold leading-snug text-ink">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-soft">
                    {fmt(subject.count)} {t("section.subjects.docs")}
                  </p>
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-panel-2">
                    <div
                      className="h-full rounded-full transition-all duration-700 group-hover:w-full"
                      style={{ width: "24%", backgroundColor: subject.color }}
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
