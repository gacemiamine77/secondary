"use client";

import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";

export function CtaSection() {
  const { t, dir } = useI18n();

  return (
    <section className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/6549913/pexels-photo-6549913.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#241a8f]/95 via-[#1e1467]/90 to-[#0b3d38]/92" />
          <div className="noise absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -end-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center px-6 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-teal" />
              {t("cta.label")}
            </span>
            <h2 className="font-display mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("cta.title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t("cta.subtitle")}
            </p>
            <Link
              href="/bibliotheque"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-bold text-[#241a8f] shadow-2xl transition-transform duration-300 hover:scale-[1.04]"
            >
              {t("cta.button")}
              <ArrowUpRight
                className={`h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                  dir === "rtl" ? "-scale-x-100" : ""
                }`}
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
