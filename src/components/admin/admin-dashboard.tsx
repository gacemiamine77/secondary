"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FilePlus2,
  FileText,
  Film,
  GraduationCap,
  LogOut,
  Radio,
  Sparkles,
  Star,
  Table2,
  Trash2,
  UploadCloud,
  Users,
  Video,
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
  CYCLES,
  RESOURCE_TYPES,
  SUBSCRIPTION_PLANS,
  TYPE_META,
  type EducationalCycle,
  type LiveCourse,
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

type Tab = "doc" | "video" | "liveCourse" | "subscriptions" | "manage";
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

  // ---------- Shared document / video form state ----------
  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState<ResourceType>("course");
  const [cycle, setCycle] = useState<EducationalCycle>("lycee");
  const [gradeCode, setGradeCode] = useState("3AS");
  const [subjectId, setSubjectId] = useState<number>(subjects[0]?.id ?? 0);
  const [level, setLevel] = useState(3);
  const [trimester, setTrimester] = useState(1);
  const [year, setYear] = useState(2025);
  const [teacherName, setTeacherName] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Video-specific
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [durationMin, setDurationMin] = useState("");

  // ---------- Live Course form state ----------
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCycle, setCourseCycle] = useState<EducationalCycle>("lycee");
  const [courseGrade, setCourseGrade] = useState("3AS");
  const [courseSubject, setCourseSubject] = useState(subjects[0]?.slug ?? "mathematiques");
  const [trainerName, setTrainerName] = useState("M. Benali");
  const [trainerTitle, setTrainerTitle] = useState("Professeur agrégé");
  const [courseDate, setCourseDate] = useState("Samedi 15 Novembre 2026");
  const [courseTime, setCourseTime] = useState("18:00 - 19:30");
  const [courseSeats, setCourseSeats] = useState(30);
  const [courseRoomUrl, setCourseRoomUrl] = useState("https://meet.google.com/ais-massar-session");
  const [courseTier, setCourseTier] = useState<"free" | "revision" | "excellence">("revision");
  const [courseDesc, setCourseDesc] = useState("Séance interactive de révision et résolution de sujets types.");
  const [courseSyllabus, setCourseSyllabus] = useState("Méthodes fondamentales\nExercices types du BAC\nQuestions-réponses micro ouvert");

  // ---------- Subscriptions simulated data ----------
  const [subscribers] = useState([
    { id: 1, name: "Amine Gacemi", plan: "Pass Excellence VIP", cycle: "Lycée (3AS BAC)", date: "24/10/2026", status: "Actif" },
    { id: 2, name: "Yasmine Belkacem", plan: "Pass Révision", cycle: "Moyen (4AM BEM)", date: "22/10/2026", status: "Actif" },
    { id: 3, name: "Rayan Mansouri", plan: "Pass Excellence VIP", cycle: "Lycée (2AS)", date: "20/10/2026", status: "Actif" },
    { id: 4, name: "Meriem Hadj", plan: "Pass Révision", cycle: "Primaire (5AP)", date: "19/10/2026", status: "Actif" },
    { id: 5, name: "Karim Ziani", plan: "Formule Découverte", cycle: "Lycée (1AS)", date: "18/10/2026", status: "Gratuit" },
  ]);

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

  // Submit PDF document
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
      fd.set("cycle", cycle);
      fd.set("gradeCode", gradeCode);
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

  // Submit video
  const submitVideo = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const payload = {
        titleFr,
        titleAr,
        titleEn,
        type: "video",
        cycle,
        gradeCode,
        subjectId,
        level,
        trimester,
        year,
        teacherName,
        featured,
        videoUrl,
        thumbnailUrl,
        durationMin: Number(durationMin),
      };

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Submit Live Course
  const submitLiveCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const matchedSubject = subjects.find((s) => s.slug === courseSubject) ?? subjects[0];
      const syllabusArray = courseSyllabus
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: courseTitle,
        cycle: courseCycle,
        gradeCode: courseGrade,
        subjectSlug: courseSubject,
        subjectName: matchedSubject?.nameFr ?? "Mathématiques",
        subjectColor: matchedSubject?.color ?? "#4f3ef0",
        teacherName: trainerName,
        teacherTitle: trainerTitle,
        scheduledDate: courseDate,
        scheduledTime: courseTime,
        durationMin: 90,
        seatsTotal: Number(courseSeats),
        roomUrl: courseRoomUrl,
        description: courseDesc,
        syllabus: syllabusArray,
        tierRequired: courseTier,
        status: "upcoming",
        tags: ["Formation Direct", courseGrade],
      };

      const res = await fetch("/api/live-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("failed");
      setCourseTitle("");
      setCourseDesc("");
      flash({ kind: "success", text: "Cours en direct programmé avec succès !" });
    } catch {
      flash({ kind: "error", text: "Erreur lors de la programmation du cours." });
    } finally {
      setSending(false);
    }
  };

  const removeRow = async (id: number) => {
    if (!window.confirm(t("admin.manage.confirm"))) return;
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setRows((cur) => cur.filter((r) => r.id !== id));
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

  const field = "ring-line h-12 w-full rounded-2xl bg-paper px-4 text-sm font-medium text-ink placeholder:text-soft/60 focus:outline-none focus:ring-2 focus:ring-accent";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-widest text-soft";

  return (
    <main className="relative min-h-screen overflow-x-clip bg-paper pb-20">
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
                Gestion des documents, cours en direct, exercices et abonnements
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
            { icon: FileText, label: "Documents PDF", value: (stats?.resources ?? 0) - (stats?.videos ?? 0), color: "#4f3ef0" },
            { icon: Film, label: "Vidéos", value: stats?.videos ?? 0, color: "#0284c7" },
            { icon: Radio, label: "Cours en direct", value: "6 sessions", color: "#16a34a" },
            { icon: CreditCard, label: "Abonnés actifs", value: "482 élèves", color: "#b45309" },
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
                <p className="font-display text-xl font-extrabold text-ink">
                  {typeof s.value === "number" ? fmt(s.value) : s.value}
                </p>
                <p className="text-xs font-semibold text-soft">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flash Banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${
                banner.kind === "success"
                  ? "border border-teal/30 bg-teal/10 text-teal"
                  : "border border-rose/30 bg-rose/10 text-rose"
              }`}
            >
              {banner.kind === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{banner.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs Bar */}
        <div className="mt-8 flex flex-wrap gap-2">
          {tabBtn("doc", <FilePlus2 className="h-4 w-4" />, "Ajouter un document")}
          {tabBtn("video", <Film className="h-4 w-4" />, "Ajouter une vidéo")}
          {tabBtn("liveCourse", <Radio className="h-4 w-4" />, "Programmer un Cours en Direct")}
          {tabBtn("subscriptions", <CreditCard className="h-4 w-4" />, "Abonnements & Étudiants")}
          {tabBtn("manage", <Table2 className="h-4 w-4" />, `Gérer (${rows.length})`)}
        </div>

        {/* Tab 1: Add Document */}
        {tab === "doc" && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submitDoc}
            className="mt-6 rounded-3xl border border-line bg-panel p-6 sm:p-8 space-y-6"
          >
            <h3 className="font-display text-lg font-bold text-ink">
              Publier un cours, devoir ou sujet d’examen
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Cycle d’enseignement *</label>
                <select
                  value={cycle}
                  onChange={(e) => {
                    const c = e.target.value as EducationalCycle;
                    setCycle(c);
                    setGradeCode(c === "primaire" ? "5AP" : c === "moyen" ? "4AM" : "3AS");
                  }}
                  className={field}
                >
                  <option value="primaire">Primaire (1AP - 5AP)</option>
                  <option value="moyen">Moyen / CEM (1AM - 4AM)</option>
                  <option value="lycee">Lycée (1AS - 3AS BAC)</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Classe / Niveau spécifique *</label>
                <input
                  type="text"
                  required
                  value={gradeCode}
                  onChange={(e) => setGradeCode(e.target.value)}
                  placeholder="Ex: 5AP, 4AM, 3AS BAC, 1AS..."
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Matière *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(Number(e.target.value))}
                  className={field}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {subjectName(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Type de ressource *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                  className={field}
                >
                  {DOC_TYPES.map((dt) => (
                    <option key={dt} value={dt}>
                      {t(`type.${dt}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Trimestre *</label>
                <select
                  value={trimester}
                  onChange={(e) => setTrimester(Number(e.target.value))}
                  className={field}
                >
                  {[1, 2, 3].map((tr) => (
                    <option key={tr} value={tr}>
                      {t(`trimester.${tr}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Année scolaire *</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className={field}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y} - {y + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Titre du document (Français) *</label>
              <input
                type="text"
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Cours complet : Les nombres complexes et leurs applications"
                className={field}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Titre en Arabe (optionnel)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="درس الأعداد المركبة وتطبيقاتها"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Enseignant / Formateur</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Ex: M. Benali"
                  className={field}
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className={labelCls}>Fichier PDF *</label>
              <input
                type="file"
                ref={fileInput}
                accept=".pdf"
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFile(e.target.files?.[0] ?? null)
                }
                className="block w-full text-xs text-soft file:mr-4 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-accent-ink hover:file:scale-105 transition-transform"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {sending ? "Publication..." : "Publier le document"}
            </button>
          </motion.form>
        )}

        {/* Tab 2: Add Video */}
        {tab === "video" && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submitVideo}
            className="mt-6 rounded-3xl border border-line bg-panel p-6 sm:p-8 space-y-6"
          >
            <h3 className="font-display text-lg font-bold text-ink">
              Publier une vidéo explicative
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Cycle *</label>
                <select
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value as EducationalCycle)}
                  className={field}
                >
                  <option value="primaire">Primaire</option>
                  <option value="moyen">Moyen</option>
                  <option value="lycee">Lycée</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Classe / Niveau *</label>
                <input
                  type="text"
                  required
                  value={gradeCode}
                  onChange={(e) => setGradeCode(e.target.value)}
                  placeholder="Ex: 3AS BAC"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Matière *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(Number(e.target.value))}
                  className={field}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {subjectName(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Titre de la vidéo *</label>
              <input
                type="text"
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Explication vidéo : Le théorème de Pythagore"
                className={field}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>URL de la vidéo (mp4) *</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>URL de la miniature</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>Durée (minutes) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  placeholder="Ex: 24"
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {sending ? "Publication..." : "Publier la vidéo"}
            </button>
          </motion.form>
        )}

        {/* Tab 3: Program Live Course */}
        {tab === "liveCourse" && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submitLiveCourse}
            className="mt-6 rounded-3xl border border-line bg-panel p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-accent animate-pulse" />
              <h3 className="font-display text-lg font-bold text-ink">
                Programmer un cours en visioconférence & formation en direct
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Cycle d’enseignement *</label>
                <select
                  value={courseCycle}
                  onChange={(e) => {
                    const c = e.target.value as EducationalCycle;
                    setCourseCycle(c);
                    setCourseGrade(c === "primaire" ? "5AP" : c === "moyen" ? "4AM" : "3AS");
                  }}
                  className={field}
                >
                  <option value="primaire">Primaire (1AP - 5AP)</option>
                  <option value="moyen">Moyen (1AM - 4AM)</option>
                  <option value="lycee">Lycée (1AS - 3AS BAC)</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Classe cible *</label>
                <input
                  type="text"
                  required
                  value={courseGrade}
                  onChange={(e) => setCourseGrade(e.target.value)}
                  placeholder="Ex: 3AS BAC, 4AM BEM, 5AP"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Matière *</label>
                <select
                  value={courseSubject}
                  onChange={(e) => setCourseSubject(e.target.value)}
                  className={field}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {subjectName(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Titre de la formation en direct *</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Ex: Masterclass BAC : Rédaction de la dissertation et étude de texte"
                className={field}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Nom du Formateur / Enseignant *</label>
                <input
                  type="text"
                  required
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  placeholder="Ex: M. Benali"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Titre / Qualification *</label>
                <input
                  type="text"
                  required
                  value={trainerTitle}
                  onChange={(e) => setTrainerTitle(e.target.value)}
                  placeholder="Ex: Inspecteur & Enseignant agrégé"
                  className={field}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Date prévue *</label>
                <input
                  type="text"
                  required
                  value={courseDate}
                  onChange={(e) => setCourseDate(e.target.value)}
                  placeholder="Ex: Samedi 15 Novembre 2026"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Horaire *</label>
                <input
                  type="text"
                  required
                  value={courseTime}
                  onChange={(e) => setCourseTime(e.target.value)}
                  placeholder="Ex: 18:00 - 19:30"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Nombre de places max *</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={courseSeats}
                  onChange={(e) => setCourseSeats(Number(e.target.value))}
                  className={field}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Lien de la salle de visioconférence *</label>
                <input
                  type="url"
                  required
                  value={courseRoomUrl}
                  onChange={(e) => setCourseRoomUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls}>Formule d’abonnement requise *</label>
                <select
                  value={courseTier}
                  onChange={(e) => setCourseTier(e.target.value as any)}
                  className={field}
                >
                  <option value="free">Accès Gratuit (Tous les élèves)</option>
                  <option value="revision">Pass Révision Recommandé</option>
                  <option value="excellence">Pass Excellence VIP (Exclusif)</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Description du cours *</label>
              <textarea
                rows={2}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Détails sur les objectifs et points abordés..."
                className="ring-line w-full rounded-2xl bg-paper p-4 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className={labelCls}>Programme / Syllabus (1 point par ligne)</label>
              <textarea
                rows={3}
                value={courseSyllabus}
                onChange={(e) => setCourseSyllabus(e.target.value)}
                placeholder="Point 1&#10;Point 2&#10;Point 3"
                className="ring-line w-full rounded-2xl bg-paper p-4 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {sending ? "Enregistrement..." : "Créer et planifier la session"}
            </button>
          </motion.form>
        )}

        {/* Tab 4: Subscriptions & Students Overview */}
        {tab === "subscriptions" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            {/* Subscription plans metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-3xl border border-line bg-panel p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-ink">
                      {plan.name}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: `${plan.color}15`, color: plan.color }}
                    >
                      {plan.priceDzd === 0 ? "Gratuit" : `${plan.priceDzd} DZD`}
                    </span>
                  </div>
                  <div className="mt-4 font-display text-3xl font-extrabold text-ink">
                    {plan.id === "free" ? "3 450" : plan.id === "revision" ? "294" : "148"}
                  </div>
                  <div className="text-xs text-soft mt-1">élèves inscrits</div>
                </div>
              ))}
            </div>

            {/* Recent Subscribers List */}
            <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-sm">
              <div className="border-b border-line px-6 py-4">
                <h3 className="font-display text-base font-bold text-ink">
                  Dernières souscriptions & élèves abonnés
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-panel-2 font-bold uppercase tracking-wider text-soft">
                    <tr>
                      <th className="px-6 py-3">Élève</th>
                      <th className="px-6 py-3">Formule</th>
                      <th className="px-6 py-3">Cycle & Classe</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-panel-2/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-ink">{sub.name}</td>
                        <td className="px-6 py-4 font-semibold text-accent">{sub.plan}</td>
                        <td className="px-6 py-4 text-soft">{sub.cycle}</td>
                        <td className="px-6 py-4 text-soft">{sub.date}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-[11px] font-bold text-teal">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Manage Existing Documents */}
        {tab === "manage" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 overflow-hidden rounded-3xl border border-line bg-panel shadow-sm"
          >
            <div className="border-b border-line px-6 py-4">
              <h3 className="font-display text-base font-bold text-ink">
                Documents & Vidéos publiés ({rows.length})
              </h3>
            </div>

            {loadingRows ? (
              <div className="p-8 text-center text-xs text-soft">Chargement des documents...</div>
            ) : rows.length === 0 ? (
              <div className="p-8 text-center text-xs text-soft">Aucun document publié.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-panel-2 font-bold uppercase tracking-wider text-soft">
                    <tr>
                      <th className="px-6 py-3">Titre</th>
                      <th className="px-6 py-3">Matière</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Stats</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-panel-2/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-ink max-w-xs truncate">
                          {row.titleFr}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="rounded-full px-2.5 py-0.5 font-bold text-[10px]"
                            style={{
                              backgroundColor: `${row.subjectColor}15`,
                              color: row.subjectColor,
                            }}
                          >
                            {row.subjectNameFr}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold capitalize text-soft">
                          {row.type}
                        </td>
                        <td className="px-6 py-4 text-soft">
                          {row.views} vues · {row.downloads} dls
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="rounded-lg p-1.5 text-soft hover:bg-rose/10 hover:text-rose transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
