"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Flame,
  HelpCircle,
  Layers,
  MessageCircleQuestion,
  Printer,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useI18n } from "../providers";
import type { StudentProfile, TeacherQuestion } from "@/lib/student-platform";
import { StudyCompanionModal } from "./study-companion-modal";
import { FlashcardsModal } from "../flashcards/flashcards-modal";
import { FocusTimerModal } from "../focus/focus-timer-modal";
import { AskTeacherModal } from "../teacher/ask-teacher-modal";
import { DailyQuizModal } from "../quiz/daily-quiz-modal";

interface UserProfileProps {
  initialStudent: StudentProfile;
  initialTeacherQuestions: TeacherQuestion[];
}

export function UserProfile({
  initialStudent,
  initialTeacherQuestions,
}: UserProfileProps) {
  const { locale, dir } = useI18n();
  const [student, setStudent] = useState<StudentProfile>(initialStudent);
  const [teacherQuestions, setTeacherQuestions] = useState<TeacherQuestion[]>(initialTeacherQuestions);
  const [activeTab, setActiveTab] = useState<"overview" | "gaps" | "badges" | "inbox">("overview");
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Sync with profile API on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.student) setStudent(data.student);
        if (data.teacherQuestions) setTeacherQuestions(data.teacherQuestions);
      })
      .catch((err) => console.error("Profile load err", err));
  }, []);

  const handleSessionLogged = (newTotalHours: number, points: number) => {
    setStudent((prev) => ({
      ...prev,
      studyHoursThisWeek: newTotalHours,
    }));
  };

  // SVG Radar Chart Coordinates (6 axes)
  const numAxes = student.subjectProficiency.length;
  const radius = 100;
  const centerX = 140;
  const centerY = 140;

  const points = student.subjectProficiency.map((sp, idx) => {
    const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
    const r = (sp.scorePct / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  const axisLines = student.subjectProficiency.map((sp, idx) => {
    const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const labelX = centerX + (radius + 24) * Math.cos(angle);
    const labelY = centerY + (radius + 24) * Math.sin(angle);
    return { x, y, labelX, labelY, label: sp.subject, score: sp.scorePct };
  });

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Daily Quiz Banner Reminder */}
        <DailyQuizModal />

        {/* Hero Profile Card */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Student info */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 flex-shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-full w-full rounded-3xl border-2 border-accent object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-ink shadow-sm">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {student.name}
                  </h1>
                  <span className="rounded-full bg-accent/15 px-3 py-0.5 text-xs font-bold text-accent">
                    {student.gradeCode} · Lycée
                  </span>
                  <span className="font-mono text-xs text-soft">
                    ID : {student.studentIdCode}
                  </span>
                </div>
                <p className="mt-1 text-xs text-soft">
                  {student.email} · Actif : {student.lastActiveDate}
                </p>

                {/* Quick metrics pills */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                    <Flame className="h-3.5 w-3.5 fill-amber-500" />
                    Série de {student.streakDays} jours consécutifs
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-ink">
                    <Timer className="h-3.5 w-3.5 text-accent" />
                    {student.studyHoursThisWeek}h d'étude cette semaine
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-ink">
                    <Award className="h-3.5 w-3.5 text-emerald-400" />
                    Précision moyenne : {student.overallAccuracy}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Study Companion, Focus Timer, Export Report) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <FocusTimerModal onSessionLogged={handleSessionLogged} />
              <StudyCompanionModal currentStudent={student} />
              <button
                type="button"
                onClick={() => setShowPrintReport(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm"
              >
                <Printer className="h-4 w-4" />
                <span>Rapport PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Main KPI Cards including Learning Velocity Indicator */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Course Completion % */}
          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-soft">Complétion des Cours</span>
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink">
                {Math.round((student.coursesCompleted / student.coursesTotal) * 100)}%
              </span>
              <span className="text-xs text-soft">
                ({student.coursesCompleted}/{student.coursesTotal} leçons)
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${(student.coursesCompleted / student.coursesTotal) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 2: Exercise Completion & Accuracy */}
          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-soft">Exercices Corrigés</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink">
                {Math.round((student.exercisesCompleted / student.exercisesTotal) * 100)}%
              </span>
              <span className="text-xs text-soft">
                ({student.exercisesCompleted}/{student.exercisesTotal} réussis)
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(student.exercisesCompleted / student.exercisesTotal) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 3: Daily Streak */}
          <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-500">Série Quotidienne</span>
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink">
                {student.streakDays} Jours
              </span>
              <span className="text-xs font-semibold text-amber-500">Record actif</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              Objectif palier suivant : 20 jours (+100 XP bonus).
            </p>
          </div>

          {/* Card 4: LEARNING VELOCITY INDICATOR (Trend Arrow) */}
          <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-soft">Vélocité d'Apprentissage</span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                  student.velocityTrend.direction === "up"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {student.velocityTrend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-ink">
                +{student.velocityTrend.hoursDeltaPct}%
              </span>
              <span className="text-xs font-bold text-emerald-400">vs sem. précédente</span>
            </div>
            <p className="mt-2 text-[11px] text-soft">
              {student.studyHoursThisWeek}h cette semaine contre {student.studyHoursLastWeek}h la semaine passée (+{student.velocityTrend.completionDeltaPct}% complétion).
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mb-6 flex items-center gap-2 border-b border-line pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "overview"
                ? "bg-accent text-accent-ink shadow-sm"
                : "text-soft hover:text-ink"
            }`}
          >
            Vue d'ensemble & Radar des compétences
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gaps")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "gaps"
                ? "bg-accent text-accent-ink shadow-sm"
                : "text-soft hover:text-ink"
            }`}
          >
            Analyse des Lacunes ({student.knowledgeGaps.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "badges"
                ? "bg-accent text-accent-ink shadow-sm"
                : "text-soft hover:text-ink"
            }`}
          >
            Badges & Trophées ({student.badges.filter((b) => b.unlocked).length}/{student.badges.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "inbox"
                ? "bg-accent text-accent-ink shadow-sm"
                : "text-soft hover:text-ink"
            }`}
          >
            Questions aux Enseignants ({teacherQuestions.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & RADAR CHART */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: SVG Radar Chart */}
            <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    Radar de Maîtrise des Matières
                  </h3>
                  <p className="text-xs text-soft">
                    Évaluation continue basée sur vos exercices et quiz
                  </p>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  Moyenne : 83%
                </span>
              </div>

              {/* Responsive SVG Radar */}
              <div className="flex items-center justify-center py-4">
                <svg viewBox="0 0 280 280" className="h-72 w-72 max-w-full">
                  {/* Background concentric polygons */}
                  {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                    const poly = student.subjectProficiency
                      .map((_, idx) => {
                        const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                        const r = radius * scale;
                        return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                      })
                      .join(" ");
                    return (
                      <polygon
                        key={i}
                        points={poly}
                        fill="transparent"
                        className="stroke-line"
                        strokeWidth="1"
                        strokeDasharray={scale === 1 ? "none" : "3,3"}
                      />
                    );
                  })}

                  {/* Axes lines */}
                  {axisLines.map((ax, i) => (
                    <line
                      key={i}
                      x1={centerX}
                      y1={centerY}
                      x2={ax.x}
                      y2={ax.y}
                      className="stroke-line"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Filled Proficiency Polygon */}
                  <polygon
                    points={points}
                    className="fill-accent/25 stroke-accent"
                    strokeWidth="2.5"
                  />

                  {/* Vertex Points */}
                  {student.subjectProficiency.map((sp, idx) => {
                    const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                    const r = (sp.scorePct / 100) * radius;
                    const cx = centerX + r * Math.cos(angle);
                    const cy = centerY + r * Math.sin(angle);
                    return (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r="4"
                        className="fill-accent stroke-panel"
                        strokeWidth="2"
                      />
                    );
                  })}

                  {/* Axis Labels */}
                  {axisLines.map((ax, i) => (
                    <text
                      key={i}
                      x={ax.labelX}
                      y={ax.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-ink text-[8.5px] font-semibold"
                    >
                      {ax.label.split(" ")[0]} ({ax.score}%)
                    </text>
                  ))}
                </svg>
              </div>

              {/* Legend & Breakdown */}
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                {student.subjectProficiency.map((sp) => (
                  <div key={sp.subject} className="rounded-2xl border border-line/60 bg-paper/60 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-ink truncate">{sp.subject}</span>
                      <span className="font-bold text-accent">{sp.scorePct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${sp.scorePct}%`, backgroundColor: sp.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Weekly Study Planner & Goals */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <h3 className="font-display text-base font-bold text-ink">
                      Planning Hebdomadaire
                    </h3>
                  </div>
                  <span className="text-xs text-soft">Objectif : 15h / sem</span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-ink">14.5h effectuées</span>
                    <span className="text-accent">96.6% atteint</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-accent rounded-full" style={{ width: "96.6%" }} />
                  </div>
                </div>

                {/* Scheduled days */}
                <div className="space-y-2.5 text-xs">
                  {[
                    { day: "Lundi", task: "Suites numériques (Exercices 3AS)", done: true, time: "2h30" },
                    { day: "Mardi", task: "Circuits RC & Équation diff.", done: true, time: "2h00" },
                    { day: "Mercredi", task: "Dissertation Philosophie (Méthode)", done: true, time: "2h15" },
                    { day: "Jeudi", task: "Transcription ADN & Traduction", done: true, time: "2h30" },
                    { day: "Vendredi", task: "Devoir surveillé blanc (Maths)", done: true, time: "3h15" },
                    { day: "Samedi", task: "Session collaborative en Direct (18h)", done: true, time: "2h00" },
                    { day: "Dimanche", task: "Flashcards & Daily Quiz", done: false, time: "1h00 prévu" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl border border-line/60 bg-paper/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        {item.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-line" />
                        )}
                        <span className="font-semibold text-ink">{item.day}</span>
                        <span className="text-soft text-[11px] truncate max-w-[170px]">{item.task}</span>
                      </div>
                      <span className="font-mono text-[11px] text-soft">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6">
                <h4 className="font-display text-sm font-bold text-ink mb-2">
                  Besoin d'un coup de pouce ?
                </h4>
                <p className="text-xs text-soft mb-4">
                  Posez une question ciblée à nos professeurs partenaires ou révisez vos lacunes avec les flashcards.
                </p>
                <div className="flex flex-wrap gap-2">
                  <AskTeacherModal defaultSubject="Mathématiques" />
                  <FlashcardsModal defaultTopic="Suites numériques" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE GAPS ANALYSIS */}
        {activeTab === "gaps" && (
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Analyse des Points Faibles & Lacunes Détectées
                </h3>
                <p className="text-xs text-soft">
                  Identifiés automatiquement lors de vos erreurs sur les exercices d'annales
                </p>
              </div>
              <FlashcardsModal
                defaultTopic="Toutes les lacunes"
                triggerButton={{
                  className: "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-ink shadow-md hover:scale-105 transition-transform",
                  label: "Lancer les Flashcards de révision",
                }}
              />
            </div>

            <div className="space-y-4">
              {student.knowledgeGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="rounded-3xl border border-line bg-paper/60 p-5 transition-all hover:border-line"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-sm">
                        {gap.scorePct}%
                      </div>
                      <div>
                        <span className="rounded-full bg-panel px-2.5 py-0.5 text-[10px] font-bold text-accent">
                          {gap.subject}
                        </span>
                        <h4 className="font-display text-sm font-bold text-ink mt-1">
                          {gap.topic}
                        </h4>
                        <p className="text-xs text-soft mt-1">
                          <span className="font-semibold text-ink">Conseil du tuteur : </span>
                          {gap.recommendation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <FlashcardsModal
                        defaultTopic={gap.topic}
                        triggerButton={{
                          className: "rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent shadow-sm",
                          label: "Réviser (Flashcards)",
                        }}
                      />
                      <AskTeacherModal
                        defaultSubject={gap.subject}
                        contextReference={`Lacune : ${gap.topic}`}
                        triggerButton={{
                          className: "rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-ink transition-colors",
                          label: "Poser une question",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BADGES & ACHIEVEMENTS */}
        {activeTab === "badges" && (
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Trophées & Jalons de Progression
              </h3>
              <p className="text-xs text-soft">
                Débloquez des distinctions en maintenant votre assiduité et votre rigueur
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {student.badges.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-3xl border p-5 transition-all ${
                    b.unlocked
                      ? "border-accent/40 bg-accent/5 shadow-sm"
                      : "border-line/60 bg-paper/40 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        b.unlocked
                          ? "bg-accent text-accent-ink shadow-md"
                          : "bg-panel text-soft"
                      }`}
                    >
                      {b.icon === "flame" && <Flame className="h-6 w-6" />}
                      {b.icon === "timer" && <Timer className="h-6 w-6" />}
                      {b.icon === "trophy" && <Trophy className="h-6 w-6" />}
                      {b.icon === "award" && <Award className="h-6 w-6" />}
                      {b.icon === "notebook" && <BookOpen className="h-6 w-6" />}
                      {b.icon === "message-circle-question" && <MessageCircleQuestion className="h-6 w-6" />}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink">{b.name}</h4>
                      <span className="text-[11px] font-semibold text-accent">
                        {b.unlocked ? `Débloqué · ${b.unlockedAt}` : `${b.progressPct}% complété`}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-soft leading-relaxed">{b.description}</p>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${b.unlocked ? "bg-accent" : "bg-soft"}`}
                      style={{ width: `${b.progressPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER INBOX & QUESTIONS */}
        {activeTab === "inbox" && (
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Questions aux Enseignants & Réponses
                </h3>
                <p className="text-xs text-soft">
                  Échanges directs et personnalisés avec les formateurs certifiés
                </p>
              </div>
              <AskTeacherModal />
            </div>

            <div className="space-y-4">
              {teacherQuestions.map((tq) => (
                <div
                  key={tq.id}
                  className="rounded-3xl border border-line bg-paper/60 p-5"
                >
                  <div className="flex items-center justify-between border-b border-line/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-panel px-2.5 py-0.5 text-[11px] font-bold text-accent">
                        {tq.subject}
                      </span>
                      <span className="text-xs text-soft">{tq.contextReference}</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        tq.status === "answered"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {tq.status === "answered" ? "Répondu" : "En cours de revue"}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-ink">{tq.question}</p>
                    <span className="text-[10px] text-soft mt-1 block">Posté : {tq.createdAt}</span>
                  </div>

                  {/* Teacher Reply if any */}
                  {tq.teacherAnswer && (
                    <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-accent text-accent-ink flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-bold text-ink">
                            {tq.teacherAnswer.teacherName}
                          </span>
                          <span className="text-[11px] text-soft ml-1.5">
                            ({tq.teacherAnswer.teacherTitle})
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-ink/90 leading-relaxed font-sans">
                        {tq.teacherAnswer.answer}
                      </p>
                      <span className="text-[10px] text-soft mt-2 block">
                        Répondu : {tq.teacherAnswer.answeredAt}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINT / EXPORT PROGRESS REPORT MODAL */}
        {showPrintReport && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowPrintReport(false)}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-white text-slate-900 p-8 shadow-2xl print:p-0 print:border-none print:shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Report Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    BULLETIN DE SUIVI DES RÉVISIONS · MASSAR ÉDUCATION
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Rapport de Progression Officiel
                  </h3>
                  <p className="text-xs text-slate-600">
                    Année Scolaire 2025/2026 · Cycle Lycée (3AS BAC)
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white">
                    {student.studentIdCode}
                  </span>
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-100 p-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Nom & Prénom :</span>
                  <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Niveau & Filière :</span>
                  <span className="font-bold text-slate-900 text-sm">{student.gradeCode} Scientifique</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Série continue :</span>
                  <span className="font-bold text-slate-900">{student.streakDays} jours d'apprentissage</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Temps d'étude hebdo :</span>
                  <span className="font-bold text-slate-900">{student.studyHoursThisWeek} heures certifiées</span>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="mt-5">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-300 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2">Matière</th>
                      <th className="py-2">Taux de Maîtrise</th>
                      <th className="py-2">Exercices Réussis</th>
                      <th className="py-2 text-right">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {student.subjectProficiency.map((sp) => (
                      <tr key={sp.subject}>
                        <td className="py-2 font-semibold text-slate-900">{sp.subject}</td>
                        <td className="py-2 font-bold text-indigo-700">{sp.scorePct}%</td>
                        <td className="py-2 text-slate-600">
                          {Math.round(sp.scorePct * 0.8)} / 80
                        </td>
                        <td className="py-2 text-right font-medium text-emerald-700">
                          {sp.scorePct >= 85 ? "Très Bien" : sp.scorePct >= 75 ? "Bien" : "Satisfaisant"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature / Validation stamp */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                <div>
                  <span>Généré automatiquement par Massar Algérie</span>
                  <span className="block text-[10px]">Document vérifiable via code élève</span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic">Visa Pédagogique Massar</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex justify-end gap-2.5 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowPrintReport(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-black"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Imprimer / Télécharger PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
