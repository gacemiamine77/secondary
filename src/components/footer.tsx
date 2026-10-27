"use client";

import { GraduationCap, Heart } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/providers";
import { LangMenu } from "@/components/lang-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: "/", label: "Accueil" },
    { href: "/bibliotheque", label: "Bibliothèque complète" },
    { href: "/exercices-en-ligne", label: "Exercices Corrigés en Ligne" },
    { href: "/cours-en-ligne", label: "Cours en Direct & Formateurs" },
    { href: "/tarifs", label: "Formules d'Abonnement" },
    { href: "/admin", label: "Administration" },
  ];

  const cycleLinks = [
    { href: "/bibliotheque?cycle=primaire", label: "Cycle Primaire (1AP - 5AP)" },
    { href: "/bibliotheque?cycle=moyen", label: "Cycle Moyen / CEM (1AM - 4AM BEM)" },
    { href: "/bibliotheque?cycle=lycee", label: "Cycle Secondaire / Lycée (BAC)" },
    { href: "/bibliotheque?type=course", label: "Tous les Cours PDF" },
    { href: "/bibliotheque?type=exam", label: "Sujets d'Examens Officiels" },
  ];

  return (
    <footer className="relative border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-ink">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold">{t("brand.name")}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-soft">
              {t("footer.about")}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <LangMenu compact />
              <ThemeToggle />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft">
              {t("footer.explore")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-ink/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft">
              Cycles & Ressources
            </h4>
            <ul className="mt-4 space-y-2.5">
              {cycleLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-ink/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft">
              {t("footer.languages")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink/80">
              <li>{t("lang.fr")}</li>
              <li>{t("lang.ar")}</li>
              <li>{t("lang.en")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-soft">
            © {year} {t("brand.name")} · {t("footer.rights")}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-soft">
            {t("footer.madeFor")}
            <Heart className="h-3.5 w-3.5 fill-rose text-rose" />
          </p>
        </div>
      </div>
    </footer>
  );
}
