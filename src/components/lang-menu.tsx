"use client";

import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/providers";

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Globe className="h-4 w-4" />
        {!compact && <span>{LOCALES.find((l) => l.id === locale)?.native}</span>}
      </button>

      {open && (
        <div className="absolute end-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-line bg-panel p-1.5 shadow-2xl">
          {LOCALES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => choose(l.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                locale === l.id
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-ink hover:bg-panel-2"
              }`}
            >
              <span>{t(`lang.${l.id}`)}</span>
              {locale === l.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
