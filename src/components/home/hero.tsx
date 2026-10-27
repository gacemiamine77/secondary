"use client";

import { ArrowRight, GraduationCap, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Counter, Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";
import { TYPE_META, RESOURCE_TYPES, type MetaDTO } from "@/lib/constants";

export function Hero({ meta }: { meta: MetaDTO }) {
  const { t, fmt, locale, dir } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/bibliotheque?q=${encodeURIComponent(q.trim())}` : "/bibliotheque");
  };

  const marqueeItems = [
    ...meta.subjects.map((s) =>
      locale === "ar" ? s.nameAr : locale === "en" ? s.nameEn : s.nameFr
    ),
    ...RESOURCE_TYPES.map((ty) => t(`type.${ty}`)),
  ];

  const stats = [
    { value: meta.stats.resources, label: "stats.resources" },
    { value: meta.stats.subjects, label: "stats.subjects" },
    { value: meta.stats.downloads, label: "stats.downloads" },
    { value: meta.stats.videos, label: "stats.videos" },
  ];

  const floatCards = [
    { type: "exam" as const, name: meta.subjects[0], delay: "0s", rotate: "-6deg", x: "0%", y: "8%" },
    { type: "course" as const, name: meta.subjects[1], delay: "1.4s", rotate: "4deg", x: "34%", y: "38%" },
    { type: "video" as const, name: meta.subjects[2], delay: "2.6s", rotate: "-3deg", x: "8%", y: "66%" },
  ];

  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pt-40">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0" />
        <div className="animate-blob absolute -top-32 start-[8%] h-[420px] w-[420px] rounded-full bg-accent/25 blur-[110px]" />
        <div
          className="animate-blob absolute top-24 end-[4%] h-[380px] w-[380px] rounded-full bg-teal/20 blur-[110px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute bottom-0 start-[35%] h-[300px] w-[300px] rounded-full bg-gold/15 blur-[100px]"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Text */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-semibold text-soft shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {t("hero.badge")}
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.4rem]">
                {t("hero.title1")}
                <br />
                <span className="text-gradient">{t("hero.title2")}</span>
                <br />
                {t("hero.title3")}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-soft sm:text-lg">
                {t("hero.subtitle")}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <form
                onSubmit={submit}
                className="ring-line mt-8 flex max-w-xl items-center gap-2 rounded-full bg-panel p-2 shadow-xl shadow-black/5"
              >
                <Search className="ms-3 h-5 w-5 shrink-0 text-soft" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")}
                  className="h-11 w-full bg-transparent text-sm font-medium text-ink placeholder:text-soft/70 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shine flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-accent-ink transition-transform hover:scale-[1.03]"
                >
                  {t("common.search")}
                  <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-soft mr-1">
                  Cycles :
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/bibliotheque?cycle=primaire")}
                  className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  Primaire (1AP-5AP)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/bibliotheque?cycle=moyen")}
                  className="rounded-full bg-sky-500/10 border border-sky-500/30 px-3.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-500 hover:text-white transition-colors"
                >
                  Moyen / CEM (1AM-4AM BEM)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/bibliotheque?cycle=lycee")}
                  className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  Lycée (1AS-3AS BAC)
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/exercices-en-ligne")}
                  className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent transition-all hover:bg-accent hover:text-accent-ink"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Exercices Corrigés en Ligne
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/cours-en-ligne")}
                  className="flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3.5 py-1.5 text-xs font-bold text-teal transition-all hover:bg-teal hover:text-white"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Cours en Direct & Formateurs
                </button>
              </div>
            </Reveal>
          </div>

          {/* Visual */}
          <div className="relative hidden h-[430px] lg:col-span-5 lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full"
            >
              {/* rotating badge */}
              <div className="animate-spin-slow absolute -top-6 end-4 z-20 h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-soft text-[9.5px] font-bold uppercase tracking-[3px]">
                    <textPath href="#circlePath">
                      Massar · Cours · Examens · Vidéos · Bac ·
                    </textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg">
                  <GraduationCap className="h-5 w-5" />
                </span>
              </div>

              {floatCards.map((card, i) => {
                const typeMeta = TYPE_META[card.type];
                const Icon = typeMeta.icon;
                const name = card.name
                  ? locale === "ar"
                    ? card.name.nameAr
                    : locale === "en"
                      ? card.name.nameEn
                      : card.name.nameFr
                  : t(`type.${card.type}`);
                return (
                  <motion.div
                    key={card.type}
                    initial={{ opacity: 0, y: 40, rotate: card.rotate }}
                    animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                    transition={{ delay: 0.45 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-64"
                    style={{ left: card.x, top: card.y }}
                  >
                    <div
                      className="animate-float rounded-3xl border border-line bg-panel p-5 shadow-2xl shadow-black/10"
                      style={{ animationDelay: card.delay }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                          style={{ background: typeMeta.gradient }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="rounded-full bg-panel-2 px-2.5 py-1 text-[10px] font-bold text-soft">
                          {t(`type.${card.type}`)}
                        </span>
                      </div>
                      <p className="font-display mt-4 text-sm font-bold text-ink">{name}</p>
                      <div className="mt-3 space-y-2">
                        <div className="h-2 w-full rounded-full bg-panel-2" />
                        <div className="h-2 w-4/5 rounded-full bg-panel-2" />
                        <div className="h-2 w-3/5 rounded-full bg-panel-2" />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div
                          className="h-2.5 w-16 rounded-full"
                          style={{ background: `${typeMeta.color}33` }}
                        />
                        <div className="h-7 w-7 rounded-full bg-panel-2" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <Reveal delay={0.15}>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-panel px-6 py-7 text-center sm:text-start">
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  <Counter value={s.value} format={fmt} />
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-soft">
                  {t(s.label)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Marquee */}
      <div dir="ltr" className="relative mt-14 overflow-hidden border-y border-line bg-panel py-3.5">
        <div className="animate-marquee flex w-max items-center gap-8 pr-8">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-soft">
                {item}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
