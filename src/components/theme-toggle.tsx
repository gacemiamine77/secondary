"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Thème"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink transition-colors ${className}`}
      >
        <Sun className="h-4 w-4 opacity-70" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
      title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink transition-all hover:border-accent hover:text-accent hover:scale-105 active:scale-95 shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500 transition-transform" />
      )}
    </button>
  );
}

