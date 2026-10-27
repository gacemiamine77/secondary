"use client";

import {
  ArrowRight,
  Award,
  BookOpenText,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { CYCLES, type EducationalCycle } from "@/lib/constants";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";

export function CyclesSection() {
  const { dir } = useI18n();

  const cycleList: EducationalCycle[] = ["primaire", "moyen", "lycee"];

  return (
    <section className="relative border-t border-line/60 bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
              <GraduationCap className="h-3.5 w-3.5" />
              Programme Scolaire National
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
              Du Primaire au Lycée : Tous les Cycles Couverts
            </h2>
            <p className="text-base text-soft">
              Que votre enfant entre en 1ère année primaire ou prépare les épreuves du BEM et du Baccalauréat, Massar l’accompagne avec des ressources conformes au programme officiel.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {cycleList.map((cKey, idx) => {
            const cycle = CYCLES[cKey];
            const Icon = cycle.icon;

            return (
              <Reveal key={cKey} delay={idx * 0.1}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                  <div className="space-y-6">
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${cycle.color}15`,
                          color: cycle.color,
                        }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: `${cycle.color}15`,
                          color: cycle.color,
                        }}
                      >
                        {cycle.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="font-display text-2xl font-bold text-ink">
                        {cycle.nameFr}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-soft">
                        {cycle.descFr}
                      </p>
                    </div>

                    {/* Grades Pills */}
                    <div className="space-y-2 border-t border-line/60 pt-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-soft">
                        Classes & Épreuves officielles :
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cycle.grades.map((grade) => (
                          <Link
                            key={grade.code}
                            href={`/bibliotheque?cycle=${cycle.id}&gradeCode=${grade.code}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            <span>{grade.code}</span>
                            {grade.examBadge && (
                              <span className="rounded-full bg-accent/15 px-1.5 py-0.2 text-[9px] font-black text-accent">
                                {grade.examBadge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA link */}
                  <div className="mt-8 border-t border-line/60 pt-6">
                    <Link
                      href={`/bibliotheque?cycle=${cycle.id}`}
                      className="inline-flex w-full items-center justify-between rounded-2xl bg-paper px-4 py-3 text-xs font-bold text-ink transition-all hover:bg-accent hover:text-accent-ink"
                    >
                      <span>Explorer les cours {cycle.nameFr}</span>
                      <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
