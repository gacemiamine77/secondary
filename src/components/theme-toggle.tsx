"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun className="absolute inset-0 h-[18px] w-[18px] rotate-0 scale-100 opacity-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
        <Moon className="absolute inset-0 h-[18px] w-[18px] rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" />
      </span>
    </button>
  );
}
