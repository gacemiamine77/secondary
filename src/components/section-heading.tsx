"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";

export function SectionHeading({
  label,
  title,
  subtitle,
  action,
  dark = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  dark?: boolean;
}) {
  const { dir } = useI18n();
  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
              dark
                ? "border-white/15 text-white/70"
                : "border-line bg-panel text-soft"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {label}
          </span>
          <h2
            className={`font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-3 text-base leading-relaxed ${
                dark ? "text-white/60" : "text-soft"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
              dark
                ? "border-white/20 text-white hover:border-white/60"
                : "border-line bg-panel text-ink hover:border-accent hover:text-accent"
            }`}
          >
            {action.label}
            <ArrowUpRight
              className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                dir === "rtl" ? "-scale-x-100" : ""
              }`}
            />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
