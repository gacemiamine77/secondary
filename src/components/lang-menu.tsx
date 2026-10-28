"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/providers";

const FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  ar: "🇩🇿",
  en: "🇬🇧",
};

export function LangMenu({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  const current = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Changer de langue"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-panel px-3 text-xs font-bold text-ink transition-all hover:border-accent hover:text-accent shadow-sm active:scale-95"
      >
        <Globe className="h-4 w-4 text-accent" />
        <span className="font-extrabold">{current.native}</span>
        <ChevronDown className={`h-3 w-3 text-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-line bg-panel p-1.5 shadow-2xl backdrop-blur-md">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-soft border-b border-line/60 mb-1">
            Langue de l'interface
          </div>
          {LOCALES.map((l) => {
            const isSelected = locale === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => choose(l.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  isSelected
                    ? "bg-accent/15 font-bold text-accent"
                    : "text-ink hover:bg-panel-2 font-medium"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{FLAGS[l.id]}</span>
                  <span>{t(`lang.${l.id}`)}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

