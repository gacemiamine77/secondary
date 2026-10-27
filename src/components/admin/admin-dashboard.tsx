"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FilePlus2,
  FileText,
  Film,
  GraduationCap,
  LogOut,
  Star,
  Table2,
  Trash2,
  UploadCloud,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useI18n } from "@/components/providers";
import { LangMenu } from "@/components/lang-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  RESOURCE_TYPES,
  TYPE_META,
  type MetaDTO,
  type ResourceType,
} from "@/lib/constants";

export type AdminSubject = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  color: string;
};

type AdminRow = {
  id: number;
  titleFr: string;
  type: string;
  subjectSlug: string;
  subjectNameFr: string;
  subjectColor: string;
  level: number;
  trimester: number;
  year: number;
  fileUrl: string | null;
  videoUrl: string | null;
  views: number;
  downloads: number;
  createdAt: string;
};

type Tab = "doc" | "video" | "manage";
type Banner = { kind: "success" | "error"; text: string } | null;

const DOC_TYPES = RESOURCE_TYPES.filter((t) => t !== "video");
const YEARS = Array.from({ length: 8 }, (_, i) => 2026 - i);

export function AdminDashboard({ subjects }: { subjects: AdminSubject[] }) {
  const { t, locale, fmt, dir } = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("doc");
  const [banner, setBanner] = useState<Banner>(null);
  const [meta, setMeta] = useState<MetaDTO | null>(null);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [sending, setSending] = useState(false);

  // ---------- shared form state ----------
  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState<ResourceType>("course");
  const [subjectId, setSubjectId] = useState<number>(subjects[0]?.id ?? 0);
  const [level, setLevel] = useState(3);
  const [trimester, setTrimester] = useState(1);
  const [year, setYear] = useState(2025);
  const [teacherName, setTeacherName] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // video-specific
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [durationMin, setDurationMin] = useState("");

  const subjectName = useCallback(
    (s: AdminSubject) =>
      locale === "ar" ? s.nameAr : locale === "en" ? s.nameEn : s.nameFr,
    [locale]
  );

  const flash = useCallback((b: Banner) => {
    setBanner(b);
    window.setTimeout(() => setBanner((cur) => (cur === b ? null : cur)), 4500);
  }, []);

  const refreshMeta = useCallback(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((d: MetaDTO) => setMeta(d))
      .catch(() => {});
  }, []);

  const refreshRows = useCallback(() => {
    setLoadingRows(true);
    fetch("/api/admin/resources")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items: AdminRow[] }) => setRows(d.items))
      .catch(() => setRows([]))
      .finally(() => setLoadingRows(false));
  }, []);

  useEffect(() => {
    refreshMeta();
    refreshRows();
  }, [refreshMeta, refreshRows]);

  const resetCommon = (keepTitle = false) => {
    if (!keepTitle) setTitleFr("");
    setTitleAr("");
    setTitleEn("");
    setTeacherName("");
    setFeatured(false);
    setFile(null);
    setVideoUrl("");
    setThumbnailUrl("");
    setDurationMin("");
    if (fileInput.current) fileInput.current.value = "";
  };

  // ---------- submit PDF document ----------
  const submitDoc = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.set("titleFr", titleFr);
      fd.set("titleAr", titleAr);
      fd.set("titleEn", titleEn);
      fd.set("type", type);
      fd.set("subjectId", String(subjectId));
      fd.set("level", String(level));
      fd.set("trimester", String(trimester));
      fd.set("year", String(year));
      fd.set("teacherName", teacherName);
      fd.set("featured", String(featured));
      if (file) fd.set("pdf", file);

      const res = await fetch("/api/admin/resources", { method: "POST", body: fd });
      if (!res.ok) throw new Error("failed");
      resetCommon();
      refreshRows();
      refreshMeta();
      flash({ kind: "success", text: t("admin.success.doc") });
    } catch {
      flash({ kind: "error", text: t("admin.error") });
    } finally {
      setSending(false);
    }
  };

  // ---------- submit video ----------
  const submitVideo = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleFr,
          titleAr,
          titleEn,
          subjectId,
          level,
          trimester,
          year,
          teacherName,
          featured,
          videoUrl,
          thumbnailUrl,
          durationMin: Number(durationMin),
        }),
      });
      if (!res.ok) throw new Error("failed");
      resetCommon();
      refreshRows();
      refreshMeta();
      flash({ kind: "success", text: t("admin.success.video") });
    } catch {
      flash({ kind: "error", text: t("admin.error") });
    } finally {
      setSending(false);
    }
  };

  const removeRow = async (row: AdminRow) => {
    if (!window.confirm(t("admin.manage.confirm"))) return;
    try {
      const res = await fetch(`/api/admin/resources/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      refreshMeta();
      flash({ kind: "success", text: t("admin.deleted") });
    } catch {
      flash({ kind: "error", text: t("admin.error") });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked && picked.type === "application/pdf" ? picked : null);
  };

  const stats = meta?.stats;

  const tabBtn = (id: Tab, icon: ReactNode, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold transition-all ${
        tab === id
          ? "bg-accent text-accent-ink shadow-lg shadow-accent/25"
          : "border border-line bg-panel text-soft hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const field = "ring-line h-12 w-full rounded-2xl bg-paper px-4 text-sm font-medium text-ink placeholder:text-soft/60";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-widest text-soft";

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-ink">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-extrabold leading-none text-ink">
                {t("admin.panel")}
              </p>
              <p className="mt-1 text-[11px] font-medium text-soft">
                {t("admin.panel.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangMenu compact />
            <ThemeToggle />
            <Link
              href="/"
              className="hidden h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-semibold text-soft transition-colors hover:text-ink sm:flex"
            >
              <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
              {t("admin.back")}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex h-10 items-center gap-2 rounded-full bg-rose/10 px-4 text-sm font-bold text-rose transition-colors hover:bg-rose hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {t("admin.logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: FileText, label: "admin.stats.pdfs", value: (stats?.resources ?? 0) - (stats?.videos ?? 0), color: "#4f3ef0" },
            { icon: Film, label: "stats.videos", value: stats?.videos ?? 0, color: "#0284c7" },
            { icon: Download, label: "stats.downloads", value: stats?.downloads ?? 0, color: "#0d9488" },
            { icon: Users, label: "stats.subjects", value: stats?.subjects ?? 0, color: "#b45309" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="flex items-center gap-4 rounded-3xl border border-line bg-panel p-5"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ background: s.color }}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-ink">{fmt(s.value)}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-soft">
                  {t(s.label)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`mt-6 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold ${
                banner.kind === "success"
                  ? "bg-teal/10 text-teal"
                  : "bg-rose/10 text-rose"
              }`}
            >
              {banner.kind === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              {banner.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {tabBtn("doc", <FilePlus2 className="h-4 w-4" />, t("admin.tab.addDoc"))}
          {tabBtn("video", <Film className="h-4 w-4" />, t("admin.tab.addVideo"))}
          {tabBtn("manage", <Table2 className="h-4 w-4" />, t("admin.tab.manage"))}
        </div>

        {/* ---------- TAB: add document ---------- */}
        {tab === "doc" && (
          <motion.form
            key="doc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={submitDoc}
            className="mt-6 rounded-3xl border border-line bg-panel p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.titleFr")}</label>
                <input required value={titleFr} onChange={(e) => setTitleFr(e.target.value)} className={field} placeholder="Cours : Les suites numériques" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.titleAr")}</label>
                <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={field} dir="auto" placeholder="درس: المتتاليات العددية" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.titleEn")}</label>
                <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={field} placeholder="Lesson: Numerical sequences" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.type")}</label>
                <select value={type} onChange={(e) => setType(e.target.value as ResourceType)} className={field}>
                  {DOC_TYPES.map((ty) => (
                    <option key={ty} value={ty}>{t(`type.${ty}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.subject")}</label>
                <select value={subjectId} onChange={(e) => setSubjectId(Number(e.target.value))} className={field}>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{subjectName(s)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:col-span-2 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>{t("admin.form.level")}</label>
                  <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className={field}>
                    {[1, 2, 3].map((l) => (
                      <option key={l} value={l}>{t(`level.short.${l}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("admin.form.trimester")}</label>
                  <select value={trimester} onChange={(e) => setTrimester(Number(e.target.value))} className={field}>
                    {[1, 2, 3].map((tr) => (
                      <option key={tr} value={tr}>{t(`trimester.${tr}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("admin.form.year")}</label>
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.teacher")}</label>
                <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className={field} placeholder="M. Benali" />
              </div>

              {/* File picker */}
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.pdf")}</label>
                <input ref={fileInput} type="file" accept="application/pdf" onChange={onPickFile} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-sm font-semibold transition-colors ${
                    file
                      ? "border-teal bg-teal/5 text-teal"
                      : "border-line bg-paper text-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  <UploadCloud className="h-6 w-6" />
                  {file
                    ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} Mo — ${t("admin.form.fileReady")}`
                    : t("admin.form.pdfHint")}
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#4f3ef0]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold text-soft">
                  <Star className="h-4 w-4 text-gold" />
                  {t("admin.form.featured")}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={sending || !titleFr.trim() || !file || subjects.length === 0}
              className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              <FilePlus2 className="h-4 w-4" />
              {sending ? t("admin.form.sending") : t("admin.form.submit.doc")}
            </button>
          </motion.form>
        )}

        {/* ---------- TAB: add video ---------- */}
        {tab === "video" && (
          <motion.form
            key="video"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={submitVideo}
            className="mt-6 rounded-3xl border border-line bg-panel p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.titleFr")}</label>
                <input required value={titleFr} onChange={(e) => setTitleFr(e.target.value)} className={field} placeholder="Vidéo explicative : La génétique" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.titleAr")}</label>
                <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={field} dir="auto" placeholder="فيديو تعليمي: علم الوراثة" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.titleEn")}</label>
                <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={field} placeholder="Explainer video: Genetics" />
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.subject")}</label>
                <select value={subjectId} onChange={(e) => setSubjectId(Number(e.target.value))} className={field}>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{subjectName(s)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("admin.form.duration")}</label>
                <input required type="number" min={1} max={600} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className={field} placeholder="15" />
              </div>
              <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                <div>
                  <label className={labelCls}>{t("admin.form.level")}</label>
                  <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className={field}>
                    {[1, 2, 3].map((l) => (
                      <option key={l} value={l}>{t(`level.short.${l}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("admin.form.trimester")}</label>
                  <select value={trimester} onChange={(e) => setTrimester(Number(e.target.value))} className={field}>
                    {[1, 2, 3].map((tr) => (
                      <option key={tr} value={tr}>{t(`trimester.${tr}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("admin.form.year")}</label>
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.videoUrl")}</label>
                <input required type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={field} placeholder="https://…/video.mp4" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.thumbUrl")}</label>
                <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={field} placeholder="https://…/thumbnail.jpg" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("admin.form.teacher")}</label>
                <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className={field} placeholder="Mme Khelifi" />
              </div>
              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#4f3ef0]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold text-soft">
                  <Star className="h-4 w-4 text-gold" />
                  {t("admin.form.featured")}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={sending || !titleFr.trim() || !videoUrl.trim() || !durationMin || subjects.length === 0}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              <Film className="h-4 w-4" />
              {sending ? t("admin.form.sending") : t("admin.form.submit.video")}
            </button>
          </motion.form>
        )}

        {/* ---------- TAB: manage ---------- */}
        {tab === "manage" && (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 overflow-hidden rounded-3xl border border-line bg-panel"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-ink">
                {t("admin.manage.recent")}
              </h2>
              <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-bold text-soft">
                {fmt(rows.length)}
              </span>
            </div>

            {loadingRows ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-2xl bg-panel-2" />
                ))}
              </div>
            ) : rows.length === 0 ? (
              <p className="px-6 py-14 text-center text-sm text-soft">{t("admin.manage.empty")}</p>
            ) : (
              <ul className="divide-y divide-line">
                {rows.map((row) => {
                  const typeMeta = TYPE_META[row.type as ResourceType] ?? TYPE_META.course;
                  const Icon = typeMeta.icon;
                  const openUrl = row.fileUrl ?? row.videoUrl;
                  return (
                    <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-panel-2/50 sm:gap-4 sm:px-6">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ background: typeMeta.gradient }}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{row.titleFr}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-medium text-soft">
                          <span style={{ color: row.subjectColor }}>{row.subjectNameFr}</span>
                          <span>·</span>
                          <span>{t(`level.short.${row.level}`)} / {t(`trimester.short.${row.trimester}`)} / {row.year}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{fmt(row.views)}</span>
                          <span className="flex items-center gap-1"><Download className="h-3 w-3" />{fmt(row.downloads)}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {openUrl && (
                          <a
                            href={openUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-accent hover:text-accent"
                            title={t("admin.manage.view")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => removeRow(row)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-rose hover:bg-rose/10 hover:text-rose"
                          title={t("admin.manage.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
