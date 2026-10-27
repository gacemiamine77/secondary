"use client";

import { Download, MousePointerClick, SlidersHorizontal } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useI18n } from "@/components/providers";

const STEPS = [
  { icon: MousePointerClick, color: "#4f3ef0" },
  { icon: SlidersHorizontal, color: "#0d9488" },
  { icon: Download, color: "#e11d48" },
];

export function HowSection() {
  const { t } = useI18n();

  return (
    <section id="guide" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("section.how.label")}
          title={t("section.how.title")}
          subtitle={t("section.how.subtitle")}
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute start-[16%] end-[16%] top-10 hidden border-t-2 border-dashed border-line md:block" />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={i} delay={i * 0.12}>
                <div className="card-hover relative flex h-full flex-col items-center rounded-3xl border border-line bg-panel p-8 text-center">
                  <span
                    className="relative flex h-20 w-20 items-center justify-center rounded-[1.4rem] text-white shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
                    }}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="font-display absolute -end-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-paper">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="font-display mt-6 text-xl font-bold tracking-tight text-ink">
                    {t(`how.s${i + 1}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-soft">
                    {t(`how.s${i + 1}.desc`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
