"use client";

import { ArrowLeft, GraduationCap, LockKeyhole, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/components/providers";
import { LangMenu } from "@/components/lang-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminLogin() {
  const { t, dir } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0" />
        <div className="animate-blob absolute -top-20 start-[15%] h-80 w-80 rounded-full bg-accent/20 blur-[110px]" />
        <div className="animate-blob absolute bottom-0 end-[10%] h-72 w-72 rounded-full bg-teal/15 blur-[100px]" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="absolute end-4 top-4 flex items-center gap-2">
        <LangMenu compact />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-line bg-panel p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </span>
            <h1 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-ink">
              {t("admin.login.title")}
            </h1>
            <p className="mt-2 text-sm text-soft">{t("admin.login.subtitle")}</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-soft">
                {t("admin.login.password")}
              </label>
              <div className="ring-line flex items-center gap-2 rounded-2xl bg-paper px-3.5">
                <LockKeyhole className="h-4 w-4 shrink-0 text-soft" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="h-12 w-full bg-transparent text-sm font-medium text-ink focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose/10 px-4 py-2.5 text-sm font-semibold text-rose"
              >
                {t("admin.login.error")}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || password.length === 0}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <LogIn className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
              {loading ? t("admin.login.sending") : t("admin.login.submit")}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-soft transition-colors hover:text-accent"
        >
          <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
          {t("admin.back")}
        </Link>
      </motion.div>
    </main>
  );
}
