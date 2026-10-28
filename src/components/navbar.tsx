"use client";

import { GraduationCap, Menu, X, ArrowUpRight, Flame, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers";
import { LangMenu } from "@/components/lang-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/bibliotheque", key: "nav.library" },
  { href: "/exercices-en-ligne", key: "nav.exercises", badge: "Corrigés" },
  { href: "/cours-en-ligne", key: "nav.courses", badge: "Direct" },
  { href: "/espace-etude", key: "nav.studyRoom", badge: "Collab" },
  { href: "/classement", key: "nav.leaderboard" },
  { href: "/parent", key: "nav.parents" },
  { href: "/tarifs", key: "nav.pricing" },
];

export function Navbar() {
  const { t, dir } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-line py-2.5"
            : "border-b border-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-ink shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-lg font-bold tracking-tight">
                {t("brand.name")}
              </span>
              <span className="hidden text-[11px] font-medium text-soft sm:block">
                {t("brand.tagline")}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent font-bold"
                      : "text-soft hover:bg-panel-2 hover:text-ink"
                  }`}
                >
                  {t(link.key)}
                  {link.badge && (
                    <span className="rounded-full bg-accent/15 px-1.5 py-0.2 text-[9px] font-bold text-accent">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LangMenu />
            <ThemeToggle />

            {/* Student Profile & Streak Chip */}
            <Link
              href="/profil"
              className="group flex items-center gap-1.5 rounded-full border border-line bg-panel p-1 pr-2.5 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent shadow-sm"
              title="Accéder à mon tableau de bord élève"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Amina"
                className="h-7 w-7 rounded-full border border-accent object-cover"
              />
              <span className="hidden sm:inline font-display text-xs font-bold">Amina</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                <Flame className="h-3 w-3 fill-amber-500" />
                14j
              </span>
            </Link>

            <button
              type="button"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink xl:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-paper/95 px-8 backdrop-blur-xl xl:hidden overflow-y-auto pt-20 pb-10"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: dir === "rtl" ? 32 : -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display block py-2 text-2xl font-bold tracking-tight text-ink transition-colors hover:text-accent"
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: dir === "rtl" ? 32 : -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="font-display flex items-center gap-2 py-2 text-2xl font-bold tracking-tight text-accent transition-colors"
                >
                  <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
                  <span>{t("nav.profile")} (14j flamme)</span>
                </Link>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-3 border-t border-line pt-6"
            >
              <LangMenu />
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
