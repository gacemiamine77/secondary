"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  X,
  Search,
  LayoutDashboard,
  Timer,
  BookOpen,
  Trophy,
  Users,
  Compass,
} from "lucide-react";
import { useI18n } from "./providers";

interface ShortcutDef {
  keyCombo: string[];
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  action?: () => void;
  icon: typeof Search;
}

export function KeyboardShortcutsModal() {
  const { locale } = useI18n();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const shortcuts: ShortcutDef[] = [
    {
      keyCombo: ["⌘", "K"],
      descriptionFr: "Recherche globale & Commandes rapides",
      descriptionAr: "البحث الشامل والأوامر السريعة",
      descriptionEn: "Global search & quick commands",
      icon: Search,
      action: () => setSearchPaletteOpen(true),
    },
    {
      keyCombo: ["⌘", "D"],
      descriptionFr: "Accéder au Tableau de bord & Profil élève",
      descriptionAr: "الذهاب إلى لوحة المتابعة والملف الشخصي",
      descriptionEn: "Open Student Dashboard & Profile",
      icon: LayoutDashboard,
      action: () => router.push("/profil"),
    },
    {
      keyCombo: ["⌘", "B"],
      descriptionFr: "Explorer la Bibliothèque de documents",
      descriptionAr: "استكشاف مكتبة الوثائق",
      descriptionEn: "Browse document library",
      icon: BookOpen,
      action: () => router.push("/bibliotheque"),
    },
    {
      keyCombo: ["⌘", "E"],
      descriptionFr: "Exercices interactifs corrigés",
      descriptionAr: "التمارين التفاعلية المصححة",
      descriptionEn: "Interactive online exercises",
      icon: Compass,
      action: () => router.push("/exercices-en-ligne"),
    },
    {
      keyCombo: ["⌘", "L"],
      descriptionFr: "Classement & Élève le plus productif",
      descriptionAr: "قائمة الترتيب والتلميذ الأكثر إنتاجية",
      descriptionEn: "Leaderboard & Most Productive Student",
      icon: Trophy,
      action: () => router.push("/classement"),
    },
    {
      keyCombo: ["⌘", "R"],
      descriptionFr: "Espace d'étude virtuel & Notebook",
      descriptionAr: "قاعة الدراسة الافتراضية والدفتر المشترك",
      descriptionEn: "Virtual Study Room & Digital Notebook",
      icon: Users,
      action: () => router.push("/espace-etude"),
    },
    {
      keyCombo: ["?"],
      descriptionFr: "Afficher cette aide des raccourcis clavier",
      descriptionAr: "عرض نافذة المساعدة للاختصارات",
      descriptionEn: "Show keyboard shortcuts helper",
      icon: HelpCircle,
      action: () => setIsOpen(true),
    },
    {
      keyCombo: ["Esc"],
      descriptionFr: "Fermer les fenêtres modales et menus",
      descriptionAr: "إغلاق النوافذ المنبثقة والقوائم",
      descriptionEn: "Close active modal or menu",
      icon: X,
    },
  ];

  // Listen for global key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchPaletteOpen(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchPaletteOpen((prev) => !prev);
        setIsOpen(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        router.push("/profil");
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        router.push("/bibliotheque");
        return;
      }

      if (e.key === "?" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const quickLinks = [
    { title: "Bibliothèque générale", href: "/bibliotheque", icon: BookOpen },
    { title: "Exercices corrigés en ligne", href: "/exercices-en-ligne", icon: Compass },
    { title: "Cours en visioconférence directe", href: "/cours-en-ligne", icon: Timer },
    { title: "Tableau de bord & Profil élève", href: "/profil", icon: LayoutDashboard },
    { title: "Classement & Top Productivité", href: "/classement", icon: Trophy },
    { title: "Espace d'étude virtuel & Notebook", href: "/espace-etude", icon: Users },
    { title: "Portail Parents & Suivi", href: "/parent", icon: HelpCircle },
  ];

  const filteredLinks = quickLinks.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating '?' button in the bottom right corner */}
      <button
        type="button"
        aria-label="Aide raccourcis clavier"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink shadow-lg shadow-black/5 transition-transform hover:scale-110 hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
        title="Raccourcis clavier (Appuyez sur ?)"
      >
        <span className="font-mono text-sm font-bold">?</span>
      </button>

      {/* Helper Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="shortcuts-title" className="font-display text-lg font-bold text-ink">
                    {locale === "ar"
                      ? "اختصارات لوحة المفاتيح"
                      : locale === "en"
                      ? "Keyboard Shortcuts"
                      : "Raccourcis Clavier Globaux"}
                  </h3>
                  <p className="text-xs text-soft">
                    {locale === "ar"
                      ? "تنقل بمرونة وسرعة داخل منصة مسار"
                      : locale === "en"
                      ? "Navigate Massar with lightning speed"
                      : "Naviguez à la vitesse de l'éclair dans Massar"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-soft hover:bg-panel-2 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {shortcuts.map((sc, i) => {
                const desc =
                  locale === "ar"
                    ? sc.descriptionAr
                    : locale === "en"
                    ? sc.descriptionEn
                    : sc.descriptionFr;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (sc.action) {
                        setIsOpen(false);
                        sc.action();
                      }
                    }}
                    className={`flex items-center justify-between rounded-2xl border border-line/60 bg-paper/60 px-4 py-3 transition-colors ${
                      sc.action ? "cursor-pointer hover:border-accent hover:bg-panel-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <sc.icon className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-ink">{desc}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {sc.keyCombo.map((k, idx) => (
                        <kbd
                          key={idx}
                          className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border border-line bg-panel px-2 font-mono text-xs font-bold text-ink shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-line pt-4 text-center text-xs text-soft">
              {locale === "ar"
                ? "اضغط Esc في أي وقت للإغلاق"
                : locale === "en"
                ? "Press Esc anytime to close dialogs"
                : "Appuyez sur Échap à tout moment pour fermer"}
            </div>
          </div>
        </div>
      )}

      {/* Cmd+K Search Command Palette */}
      {searchPaletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm"
          onClick={() => setSearchPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="h-5 w-5 text-accent" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "ابحث عن صفحة، درس، موضوع، أو اضغط للتنقل السريع…"
                    : locale === "en"
                    ? "Search for a page, lesson, exam, or navigate quickly…"
                    : "Rechercher une page, un cours, un sujet…"
                }
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-soft"
              />
              <kbd className="rounded-lg border border-line bg-paper px-2 py-0.5 font-mono text-xs text-soft">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-soft">
                {locale === "ar" ? "الصفحات السريعة" : locale === "en" ? "Quick Navigation" : "Accès Rapide"}
              </div>
              {filteredLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    setSearchPaletteOpen(false);
                    router.push(link.href);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  <link.icon className="h-4 w-4 text-soft" />
                  <span className="font-medium">{link.title}</span>
                </button>
              ))}

              {filteredLinks.length === 0 && (
                <div className="p-6 text-center text-sm text-soft">
                  {locale === "ar" ? "لا توجد نتائج مطابقة" : "Aucun résultat trouvé"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
