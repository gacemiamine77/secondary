"use client";

import { ThemeProvider } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, DIRECTIONS, type Locale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  fmt: (n: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("massar-locale") as Locale | null;
    const initial: Locale =
      saved && ["fr", "ar", "en"].includes(saved) ? saved : "fr";
    // Sync the document (external system) immediately…
    document.documentElement.lang = initial;
    document.documentElement.dir = DIRECTIONS[initial];
    // …then schedule the state update for the next frame.
    const frame = requestAnimationFrame(() => setLocaleState(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("massar-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = DIRECTIONS[l];
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[locale][key] ?? dictionaries.fr[key] ?? key,
    [locale]
  );

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat(
        locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US"
      ).format(n),
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir: DIRECTIONS[locale], setLocale, t, fmt }),
    [locale, setLocale, t, fmt]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </ThemeProvider>
  );
}
