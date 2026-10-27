"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useI18n } from "@/components/providers";

const TERMS = [1, 2, 3] as const;
const TERM_COLORS = ["#4f3ef0", "#0d9488", "#e11d48"];

export function TrimestersSection() {
  const { t, dir } = useI18n();

  return (
    <section className="relative overflow-hidden bg-panel-2/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("section.trimesters.label")}
          title={t("section.trimesters.title")}
          subtitle={t("section.trimesters.subtitle")}
        />

        <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
          {/* timeline */}
          <div className="pointer-events-none absolute -top-7 hidden h-px w-full bg-line lg:block" />
          {TERMS.map((term, i) => (
            <Reveal key={term} delay={i * 0.12} className="relative">
              <span
                className="absolute -top-[34px] start-1/2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-paper lg:block rtl:translate-x-1/2"
                style={{ backgroundColor: TERM_COLORS[i] }}
              />
              <Link
                href={`/bibliotheque?trimester=${term}`}
                className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel p-7"
              >
                <span
                  className="font-display pointer-events-none absolute -end-4 -top-7 select-none text-[7rem] font-extrabold leading-none opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.14]"
                  style={{ color: TERM_COLORS[i] }}
                >
                  0{term}
                </span>
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: TERM_COLORS[i] }}
                >
                  {t(`trimester.short.${term}`)}
                </span>
                <h3 className="font-display mt-5 text-2xl font-bold tracking-tight text-ink">
                  {t(`trimester.${term}`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-soft">
                  {t(`trimesterCard.${term}`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors group-hover:text-accent">
                  {t("common.explore")}
                  <ArrowRight
                    className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                      dir === "rtl" ? "-scale-x-100 group-hover:-translate-x-1" : ""
                    }`}
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
