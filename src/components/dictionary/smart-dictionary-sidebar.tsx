"use client";

import { useEffect, useState } from "react";
import {
  BookMarked,
  Search,
  X,
  Languages,
  Sparkles,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { useI18n } from "../providers";
import type { DictionaryEntry } from "@/lib/student-platform";

export function SmartDictionarySidebar({
  triggerButton,
}: {
  triggerButton?: {
    className?: string;
    label?: string;
  };
}) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    fetch(`/api/dictionary?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.entries) {
          setEntries(data.entries);
          if (data.entries.length > 0) {
            setSelectedEntry((prev) => prev ?? data.entries[0]);
          }
        }
      })
      .catch((err) => console.error("Dictionary load error", err));
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerButton?.className ??
          "inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm"
        }
      >
        <BookMarked className="h-4 w-4 text-accent" />
        <span>{triggerButton?.label ?? (locale === "ar" ? "المعجم الذكي" : "Dictionnaire")}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col border-s border-line bg-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-ink shadow-md">
                  <BookMarked className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {locale === "ar" ? "المعجم الأكاديمي الذكي" : "Dictionnaire & Notions Clés"}
                  </h3>
                  <p className="text-[11px] text-soft">
                    {locale === "ar" ? "ترجمة وشرح المفاهيم بالفرنسية، العربية والإنجليزية" : "Définitions trilingues FR / AR / EN"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-soft hover:bg-panel-2 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un terme, un théorème..."
                className="w-full rounded-2xl border border-line bg-paper py-2 pl-9 pr-4 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Quick Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Suite géométrique", "Titrage", "Thalès", "Dialectique"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-line/70 bg-paper/60 px-2.5 py-0.5 text-[10px] font-medium text-soft hover:border-accent hover:text-accent"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Entries List */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                    selectedEntry?.id === entry.id
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-line bg-paper hover:border-line"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">{entry.term}</span>
                    <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] font-semibold text-accent">
                      {entry.category}
                    </span>
                  </div>

                  {/* Multilingual tabs or quick summary */}
                  <div className="mt-2.5 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-accent">FR : </span>
                      <span className="text-ink">{entry.defFr}</span>
                    </div>

                    <div dir="rtl" className="text-right">
                      <span className="text-[10px] font-bold text-accent">AR : </span>
                      <span className="text-ink font-arabic">{entry.defAr}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-accent">EN : </span>
                      <span className="text-soft">{entry.defEn}</span>
                    </div>

                    {entry.example && (
                      <div className="mt-1 rounded-xl bg-panel p-2 font-mono text-[11px] text-ink">
                        {entry.example}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {entries.length === 0 && (
                <div className="py-12 text-center text-xs text-soft">
                  Aucun terme trouvé pour « {query} ».
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
