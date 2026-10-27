"use client";

import {
  ChevronDown,
  Download,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource-card";
import { VideoModal } from "@/components/video-modal";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/providers";
import {
  RESOURCE_TYPES,
  TYPE_META,
  SUBJECT_ICONS,
  type MetaDTO,
  type ResourceDTO,
} from "@/lib/constants";

export type InitialFilters = {
  q: string;
  type: string;
  subject: string;
  cycle?: string;
  gradeCode?: string;
  level: number;
  trimester: number;
  year: number;
  sort: "new" | "downloads" | "views";
};

const PAGE_SIZE = 12;

export function LibraryClient({ initial }: { initial: InitialFilters }) {
  const { t, locale, fmt, dir } = useI18n();

  const [filters, setFilters] = useState<InitialFilters>(initial);
  const [qInput, setQInput] = useState(initial.q);
  const [meta, setMeta] = useState<MetaDTO | null>(null);
  const [items, setItems] = useState<ResourceDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<ResourceDTO | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const firstRender = useRef(true);

  const buildQuery = useCallback(
    (f: InitialFilters, p: number) => {
      const params = new URLSearchParams();
      if (f.q.trim()) params.set("q", f.q.trim());
      if (f.type) params.set("type", f.type);
      if (f.subject) params.set("subject", f.subject);
      if (f.cycle) params.set("cycle", f.cycle);
      if (f.gradeCode) params.set("gradeCode", f.gradeCode);
      if (f.level) params.set("level", String(f.level));
      if (f.trimester) params.set("trimester", String(f.trimester));
      if (f.year) params.set("year", String(f.year));
      params.set("sort", f.sort);
      params.set("page", String(p));
      params.set("pageSize", String(PAGE_SIZE));
      return params.toString();
    },
    []
  );

  const fetchResources = useCallback(
    async (f: InitialFilters, p: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await fetch(`/api/resources?${buildQuery(f, p)}`);
        const data = (await res.json()) as {
          items: ResourceDTO[];
          total: number;
          hasMore: boolean;
        };
        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(p);
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      } catch {
        if (!append) {
          setItems([]);
          setTotal(0);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQuery]
  );

  // Sync URL shareable
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const qs = buildQuery(filters, 1);
    window.history.replaceState(null, "", `/bibliotheque?${qs}`);
  }, [filters, buildQuery]);

  // Debounced search input
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters((f) => (f.q === qInput ? f : { ...f, q: qInput }));
    }, 380);
    return () => clearTimeout(id);
  }, [qInput]);

  // Refetch on filters change
  useEffect(() => {
    fetchResources(filters, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Meta
  useEffect(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((d: MetaDTO) => setMeta(d))
      .catch(() => setMeta(null));
  }, []);

  const update = <K extends keyof InitialFilters>(key: K, value: InitialFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setQInput("");
    setFilters({ q: "", type: "", subject: "", cycle: "", gradeCode: "", level: 0, trimester: 0, year: 0, sort: "new" });
  };

  const subjectLabel = useCallback(
    (slug: string) => {
      const s = meta?.subjects.find((x) => x.slug === slug);
      if (!s) return slug;
      return locale === "ar" ? s.nameAr : locale === "en" ? s.nameEn : s.nameFr;
    },
    [meta, locale]
  );

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.q.trim())
      chips.push({ key: "q", label: `"${filters.q.trim()}"`, clear: () => { setQInput(""); update("q", ""); } });
    if (filters.cycle)
      chips.push({
        key: "cycle",
        label: filters.cycle === "primaire" ? "Primaire" : filters.cycle === "moyen" ? "Moyen (CEM)" : "Lycée",
        clear: () => { update("cycle", ""); update("gradeCode", ""); },
      });
    if (filters.gradeCode)
      chips.push({ key: "gradeCode", label: filters.gradeCode, clear: () => update("gradeCode", "") });
    if (filters.type)
      chips.push({ key: "type", label: t(`type.${filters.type}`), clear: () => update("type", "") });
    if (filters.subject)
      chips.push({ key: "subject", label: subjectLabel(filters.subject), clear: () => update("subject", "") });
    if (filters.level && !filters.cycle)
      chips.push({ key: "level", label: t(`level.${filters.level}`), clear: () => update("level", 0) });
    if (filters.trimester)
      chips.push({ key: "trimester", label: t(`trimester.${filters.trimester}`), clear: () => update("trimester", 0) });
    if (filters.year)
      chips.push({ key: "year", label: fmt(filters.year), clear: () => update("year", 0) });
    return chips;
  }, [filters, t, subjectLabel, fmt]);

  const filtersBody = (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          {t("common.search")}
        </p>
        <div className="ring-line flex items-center gap-2 rounded-2xl bg-panel px-3.5">
          <Search className="h-4 w-4 shrink-0 text-soft" />
          <input
            type="text"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder={t("library.searchPlaceholder")}
            className="h-11 w-full bg-transparent text-sm font-medium text-ink placeholder:text-soft/70 focus:outline-none"
          />
          {qInput && (
            <button type="button" onClick={() => setQInput("")} aria-label="Clear">
              <X className="h-4 w-4 text-soft hover:text-ink" />
            </button>
          )}
        </div>
      </div>

      {/* Type */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          {t("filters.type")}
        </p>
        <div className="space-y-1">
          <FilterRadio
            active={filters.type === ""}
            onClick={() => update("type", "")}
            label={t("filters.typeAll")}
          />
          {RESOURCE_TYPES.map((type) => {
            const Icon = TYPE_META[type].icon;
            return (
              <FilterRadio
                key={type}
                active={filters.type === type}
                onClick={() => update("type", filters.type === type ? "" : type)}
                label={t(`type.${type}`)}
                icon={<Icon className="h-4 w-4" style={{ color: TYPE_META[type].color }} />}
                count={meta?.typeCounts[type]}
                fmt={fmt}
              />
            );
          })}
        </div>
      </div>

      {/* Subject */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          {t("filters.subject")}
        </p>
        <div className="max-h-64 space-y-1 overflow-y-auto pe-1">
          <FilterRadio
            active={filters.subject === ""}
            onClick={() => update("subject", "")}
            label={t("filters.subjectAll")}
          />
          {(meta?.subjects ?? []).map((s) => {
            const Icon = SUBJECT_ICONS[s.slug] ?? SUBJECT_ICONS.default;
            return (
              <FilterRadio
                key={s.slug}
                active={filters.subject === s.slug}
                onClick={() => update("subject", filters.subject === s.slug ? "" : s.slug)}
                label={locale === "ar" ? s.nameAr : locale === "en" ? s.nameEn : s.nameFr}
                icon={<Icon className="h-4 w-4" style={{ color: s.color }} />}
                count={s.count}
                fmt={fmt}
              />
            );
          })}
        </div>
      </div>

      {/* Cycle */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          {t("cycle.label") || "Cycle d'études"}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <SegmentButton
            active={!filters.cycle}
            onClick={() => { update("cycle", ""); update("gradeCode", ""); }}
            label="Tous"
          />
          <SegmentButton
            active={filters.cycle === "primaire"}
            onClick={() => { update("cycle", filters.cycle === "primaire" ? "" : "primaire"); update("gradeCode", ""); }}
            label="Primaire"
          />
          <SegmentButton
            active={filters.cycle === "moyen"}
            onClick={() => { update("cycle", filters.cycle === "moyen" ? "" : "moyen"); update("gradeCode", ""); }}
            label="Moyen"
          />
        </div>
        <div className="mt-1.5">
          <SegmentButton
            active={filters.cycle === "lycee"}
            onClick={() => { update("cycle", filters.cycle === "lycee" ? "" : "lycee"); update("gradeCode", ""); }}
            label="Lycée (Secondaire)"
          />
        </div>
      </div>

      {/* Grade / Classe */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          Classe / Niveau
        </p>
        {filters.cycle === "primaire" ? (
          <div className="grid grid-cols-3 gap-1.5">
            {["1AP", "2AP", "3AP", "4AP", "5AP"].map((code) => (
              <SegmentButton
                key={code}
                active={filters.gradeCode === code}
                onClick={() => update("gradeCode", filters.gradeCode === code ? "" : code)}
                label={code}
              />
            ))}
          </div>
        ) : filters.cycle === "moyen" ? (
          <div className="grid grid-cols-2 gap-1.5">
            {["1AM", "2AM", "3AM", "4AM (BEM)"].map((code) => {
              const cleanCode = code.startsWith("4AM") ? "4AM" : code;
              return (
                <SegmentButton
                  key={code}
                  active={filters.gradeCode === cleanCode}
                  onClick={() => update("gradeCode", filters.gradeCode === cleanCode ? "" : cleanCode)}
                  label={code}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {["1AS", "2AS", "3AS"].map((code, idx) => (
              <SegmentButton
                key={code}
                active={filters.gradeCode === code || (!filters.gradeCode && filters.level === idx + 1)}
                onClick={() => {
                  const isActive = filters.gradeCode === code;
                  update("gradeCode", isActive ? "" : code);
                  update("level", isActive ? 0 : idx + 1);
                }}
                label={code === "3AS" ? "3AS · BAC" : code}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trimester */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
          {t("filters.trimester")}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((term) => (
            <SegmentButton
              key={term}
              active={filters.trimester === term}
              onClick={() => update("trimester", filters.trimester === term ? 0 : term)}
              label={t(`trimester.short.${term}`)}
            />
          ))}
        </div>
      </div>

      {/* Year + Sort */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
            {t("filters.year")}
          </p>
          <div className="relative">
            <select
              value={filters.year}
              onChange={(e) => update("year", Number(e.target.value))}
              className="ring-line h-11 w-full appearance-none rounded-2xl bg-panel px-3.5 pe-8 text-sm font-semibold text-ink"
            >
              <option value={0}>{t("filters.yearAll")}</option>
              {(meta?.years ?? []).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-soft">
            {t("filters.sort")}
          </p>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value as InitialFilters["sort"])}
              className="ring-line h-11 w-full appearance-none rounded-2xl bg-panel px-3.5 pe-8 text-sm font-semibold text-ink"
            >
              <option value="new">{t("filters.sortNew")}</option>
              <option value="downloads">{t("filters.sortDownloads")}</option>
              <option value="views">{t("filters.sortViews")}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-line text-sm font-semibold text-soft transition-colors hover:border-rose hover:text-rose"
      >
        <RotateCcw className="h-4 w-4" />
        {t("common.reset")}
      </button>
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />

      {/* Header band */}
      <section className="relative overflow-hidden pb-10 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="grid-lines absolute inset-0" />
          <div className="animate-blob absolute -top-24 start-[20%] h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
          <div className="animate-blob absolute top-10 end-[10%] h-56 w-56 rounded-full bg-teal/15 blur-[90px]" style={{ animationDelay: "-5s" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-gradient">{t("library.title")}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-soft">{t("library.subtitle")}</p>

            {/* Quick Cycle Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => { update("cycle", ""); update("gradeCode", ""); }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  !filters.cycle
                    ? "bg-ink text-paper shadow-md"
                    : "bg-panel/80 border border-line text-soft hover:text-ink backdrop-blur"
                }`}
              >
                Tous les cycles
              </button>
              <button
                type="button"
                onClick={() => { update("cycle", "primaire"); update("gradeCode", ""); }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  filters.cycle === "primaire"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "bg-panel/80 border border-line text-soft hover:text-ink backdrop-blur"
                }`}
              >
                Primaire (1AP - 5AP)
              </button>
              <button
                type="button"
                onClick={() => { update("cycle", "moyen"); update("gradeCode", ""); }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  filters.cycle === "moyen"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                    : "bg-panel/80 border border-line text-soft hover:text-ink backdrop-blur"
                }`}
              >
                Moyen / CEM (1AM - 4AM BEM)
              </button>
              <button
                type="button"
                onClick={() => { update("cycle", "lycee"); update("gradeCode", ""); }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  filters.cycle === "lycee"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "bg-panel/80 border border-line text-soft hover:text-ink backdrop-blur"
                }`}
              >
                Lycée (1AS - 3AS BAC)
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-line bg-panel/60 p-6 backdrop-blur">
              <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                <h2 className="font-display text-sm font-bold uppercase tracking-widest text-ink">
                  {t("filters.title")}
                </h2>
              </div>
              {filtersBody}
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-soft">
                <span className="font-display text-2xl font-extrabold text-ink">{fmt(total)}</span>{" "}
                {t(total <= 1 ? "filters.result" : "filters.results")}
              </p>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-semibold text-ink lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t("filters.title")}
                {activeChips.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-ink">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="group flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-rose/10 hover:text-rose"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <ResourceCardSkeleton key={i} />)
                : items.map((resource, i) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: (i % PAGE_SIZE) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ResourceCard resource={resource} onWatch={setCurrentVideo} />
                    </motion.div>
                  ))}
            </div>

            {/* Empty state */}
            {!loading && items.length === 0 && (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-panel/50 px-8 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel-2 text-soft">
                  <SearchX className="h-8 w-8" />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-ink">
                  {t("filters.noResults")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-soft">{t("filters.noResultsHint")}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-ink transition-transform hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("common.reset")}
                </button>
              </div>
            )}

            {/* Load more */}
            {!loading && hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => fetchResources(filters, page + 1, true)}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-panel px-8 text-sm font-bold text-ink transition-all hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  {loadingMore ? t("common.loading") : t("common.loadMore")}
                  <Download className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: dir === "rtl" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: dir === "rtl" ? "-100%" : "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 end-0 top-0 w-[86%] max-w-sm overflow-y-auto bg-paper p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold uppercase tracking-widest text-ink">
                  {t("filters.title")}
                </h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {filtersBody}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 h-12 w-full rounded-2xl bg-accent text-sm font-bold text-accent-ink"
              >
                {fmt(total)} {t(total <= 1 ? "filters.result" : "filters.results")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal video={currentVideo} onClose={() => setCurrentVideo(null)} />
      <Footer />
    </main>
  );
}

function FilterRadio({
  active,
  onClick,
  label,
  icon,
  count,
  fmt,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: ReactNode;
  count?: number;
  fmt?: (n: number) => string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-accent/10 font-semibold text-accent"
          : "text-soft hover:bg-panel hover:text-ink"
      }`}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
      {typeof count === "number" && fmt && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? "bg-accent/15 text-accent" : "bg-panel text-soft"
          }`}
        >
          {fmt(count)}
        </span>
      )}
      {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
    </button>
  );
}

function SegmentButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl text-xs font-bold transition-all ${
        active ? "bg-accent text-accent-ink shadow-md" : "bg-panel text-soft hover:text-ink"
      }`}
      style={active ? {} : { boxShadow: "inset 0 0 0 1px var(--line)" }}
    >
      {label}
    </button>
  );
}
