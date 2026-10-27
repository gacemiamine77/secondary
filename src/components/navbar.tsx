"use client";

import { GraduationCap, Menu, X, ArrowUpRight } from "lucide-react";
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
  { href: "/exercices-en-ligne", key: "nav.exercises", badge: "En ligne" },
  { href: "/cours-en-ligne", key: "nav.courses", badge: "Direct" },
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

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent font-semibold"
                        : "text-soft hover:bg-panel-2 hover:text-ink"
                    }`}
                  >
                    {t(link.key)}
                    {link.badge && (
                      <span className="rounded-full bg-accent/15 px-1.5 py-0.2 text-[10px] font-bold text-accent">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          <div className="flex items-center gap-2">
            <LangMenu compact />
            <ThemeToggle />
            <Link
              href="/bibliotheque"
              className="shine hidden h-10 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.03] md:flex"
            >
              {t("common.explore")}
              <ArrowUpRight className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
            </Link>
            <button
              type="button"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink lg:hidden"
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
            className="fixed inset-0 z-40 flex flex-col justify-center bg-paper/95 px-8 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: dir === "rtl" ? 32 : -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display block py-3 text-4xl font-bold tracking-tight text-ink transition-colors hover:text-accent"
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex items-center gap-3"
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
