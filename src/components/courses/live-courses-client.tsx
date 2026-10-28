"use client";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Lock,
  MessageCircle,
  Mic,
  Play,
  Radio,
  Send,
  Sparkles,
  Star,
  Users,
  Video,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CYCLES, type EducationalCycle, type LiveCourse } from "@/lib/constants";
import { useI18n } from "@/components/providers";
import { PdfAnnotatorModal } from "@/components/pdf/pdf-annotator-modal";

interface Props {
  initialCourses: LiveCourse[];
}

export function LiveCoursesClient({ initialCourses }: Props) {
  const { dir } = useI18n();
  const [courses, setCourses] = useState<LiveCourse[]>(initialCourses);
  const [selectedCycle, setSelectedCycle] = useState<EducationalCycle | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCourseDoc, setViewCourseDoc] = useState<LiveCourse | null>(null);

  // Virtual room interactive modal
  const [activeRoomCourse, setActiveRoomCourse] = useState<LiveCourse | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isTeacher?: boolean }[]
  >([
    { sender: "M. Benali (Formateur)", text: "Bienvenue à tous ! Prenez de quoi noter pour la démonstration de la récurrence.", time: "18:02", isTeacher: true },
    { sender: "Amine (Lycéen 3AS)", text: "Bonjour monsieur, est-ce qu'on aura la fiche d'exercices à la fin ?", time: "18:03" },
    { sender: "Sarah (3AS Math)", text: "Présente ! La question 2 du BAC 2024 m'a posé problème.", time: "18:04" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [handRaised, setHandRaised] = useState(false);

  // Booking state
  const [bookedIds, setBookedIds] = useState<number[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isBooking, startBooking] = useTransition();

  const filtered = courses.filter((c) => {
    if (selectedCycle !== "all" && c.cycle !== selectedCycle) return false;
    if (selectedStatus !== "all" && c.status !== selectedStatus) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.teacher.name.toLowerCase().includes(q) ||
        c.subjectName.toLowerCase().includes(q) ||
        c.gradeCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBook = (courseId: number) => {
    startBooking(async () => {
      try {
        const res = await fetch("/api/live-courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "book_seat", courseId, studentName: "Élève Massar" }),
        });
        const data = await res.json();
        if (data.ok) {
          setBookedIds((prev) => [...prev, courseId]);
          setCourses((prev) =>
            prev.map((c) => (c.id === courseId ? { ...c, seatsBooked: c.seatsBooked + 1 } : c))
          );
          setBookingSuccess(data.message);
          setTimeout(() => setBookingSuccess(null), 5000);
        }
      } catch (err) {
        console.error("booking error", err);
      }
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: "Vous (Élève)", text: newMessage.trim(), time: "Maintenant" },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-paper pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-8 shadow-sm lg:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3.5 py-1 text-xs font-semibold text-teal">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                Mise en Relation Enseignants & Étudiants
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Formations & Cours en Direct
              </h1>
              <p className="text-base text-soft sm:text-lg">
                Participez à des visioconférences interactives, posez vos questions en direct aux formateurs certifiés et bénéficiez d’un accompagnement sur-mesure pour réussir vos examens (5e, BEM, BAC).
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/tarifs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Découvrir les Abonnements
              </Link>
              <div className="text-center text-xs text-soft">
                Sessions en direct accessibles selon votre formule
              </div>
            </div>
          </div>
        </div>

        {/* Booking success toast */}
        {bookingSuccess && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
            <button
              onClick={() => setSelectedCycle("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                selectedCycle === "all"
                  ? "bg-ink text-paper shadow-sm"
                  : "bg-panel border border-line text-soft hover:text-ink"
              }`}
            >
              Tous les cycles ({courses.length})
            </button>
            {(["primaire", "moyen", "lycee"] as EducationalCycle[]).map((cKey) => {
              const meta = CYCLES[cKey];
              const count = courses.filter((c) => c.cycle === cKey).length;
              const isSelected = selectedCycle === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => setSelectedCycle(cKey)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-accent text-accent-ink shadow-md shadow-accent/20"
                      : "bg-panel border border-line text-soft hover:text-ink"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.nameFr}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {["all", "live", "upcoming", "replay"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                    selectedStatus === st
                      ? "bg-accent/15 text-accent font-bold"
                      : "bg-panel border border-line text-soft hover:text-ink"
                  }`}
                >
                  {st === "all" ? "Toutes les sessions" : st === "live" ? "🔴 En direct" : st === "upcoming" ? "📅 À venir" : "📼 Replays"}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par formateur, matière, notion..."
              className="w-full sm:w-72 rounded-full border border-line bg-panel px-4 py-2 text-xs text-ink placeholder:text-soft focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Live Courses Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filtered.map((course) => {
            const isBooked = bookedIds.includes(course.id);
            const cycleMeta = CYCLES[course.cycle];
            const isFull = course.seatsBooked >= course.seatsTotal;

            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 sm:p-8"
              >
                <div className="space-y-5">
                  {/* Status & Plan required */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {course.status === "live" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose/15 px-3 py-1 text-xs font-black text-rose animate-pulse">
                          <Radio className="h-3.5 w-3.5" />
                          EN DIRECT
                        </span>
                      ) : course.status === "replay" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal">
                          <Play className="h-3 w-3" />
                          Replay HD disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                          <Calendar className="h-3.5 w-3.5" />
                          {course.scheduledDate}
                        </span>
                      )}
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${cycleMeta.color}15`,
                          color: cycleMeta.color,
                        }}
                      >
                        {cycleMeta.nameFr} · {course.gradeCode}
                      </span>
                    </div>

                    <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-soft">
                      {course.tierRequired === "free"
                        ? "Gratuit"
                        : course.tierRequired === "revision"
                          ? "Pass Révision"
                          : "Pass VIP"}
                    </span>
                  </div>

                  {/* Course Title & Description */}
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-ink group-hover:text-accent">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-soft">
                      {course.description}
                    </p>
                  </div>

                  {/* Teacher Spotlight */}
                  <div className="flex items-center gap-3 rounded-2xl bg-paper p-3.5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line">
                      <Image
                        src={course.teacher.avatar}
                        alt={course.teacher.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-ink truncate">
                          {course.teacher.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {course.teacher.rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-soft truncate">
                        {course.teacher.title}
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Points */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-soft">
                      Au programme de cette session :
                    </div>
                    <ul className="space-y-1 text-xs text-ink/90">
                      {course.syllabus.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Schedule & Seats bar */}
                  <div className="flex items-center justify-between text-xs text-soft">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      <span>{course.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {course.seatsBooked} / {course.seatsTotal} inscrits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2.5 border-t border-line/60 pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveRoomCourse(course)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-ink shadow-md shadow-accent/25 transition-transform hover:scale-[1.03]"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Salle virtuelle
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewCourseDoc(course)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                      title="Consulter le support de cours officiel"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-accent" />
                      <span>Support de cours</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isBooked || isFull || isBooking}
                    onClick={() => handleBook(course.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                      isBooked
                        ? "border-teal/30 bg-teal/10 text-teal"
                        : isFull
                          ? "border-line bg-panel-2 text-soft cursor-not-allowed"
                          : "border-line bg-panel hover:bg-panel-2 text-ink"
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Place confirmée
                      </>
                    ) : isFull ? (
                      "Complet"
                    ) : (
                      "Réserver"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-line bg-panel p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-soft" />
            <h3 className="mt-4 text-lg font-bold text-ink">Aucun cours trouvé</h3>
            <p className="mt-1 text-sm text-soft">
              Modifiez votre recherche ou contactez nos formateurs pour programmer une session personnalisée.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Virtual Classroom Modal */}
      {activeRoomCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-md">
          <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl">
            {/* Top header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-rose animate-ping" />
                <div>
                  <h3 className="font-display text-sm font-bold text-ink sm:text-base">
                    Salle Virtuelle HD · {activeRoomCourse.title}
                  </h3>
                  <div className="text-xs text-soft">
                    Formateur référent : {activeRoomCourse.teacher.name} ({activeRoomCourse.subjectName})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHandRaised((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    handRaised
                      ? "bg-amber-500 text-white font-bold"
                      : "border border-line bg-panel-2 text-soft hover:text-ink"
                  }`}
                >
                  ✋ {handRaised ? "Main levée" : "Lever la main"}
                </button>

                <button
                  onClick={() => setActiveRoomCourse(null)}
                  className="rounded-full border border-line bg-panel-2 p-2 text-soft transition-colors hover:text-ink"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Stage: Video stream + Interactive Chat Sidebar */}
            <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
              {/* Left Screen: Video stream + Whiteboard */}
              <div className="relative flex flex-col justify-between bg-black lg:col-span-8">
                {/* Simulated video stage */}
                <div className="relative flex-1">
                  <video
                    src="https://videos.pexels.com/video-files/6219854/6219854-uhd_4096_2160_30fps.mp4"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-90"
                  />
                  {/* Overlay teacher webcam thumbnail */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-black/60 p-2.5 backdrop-blur-md">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/20">
                      <Image
                        src={activeRoomCourse.teacher.avatar}
                        alt={activeRoomCourse.teacher.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="pr-2 text-white">
                      <div className="text-xs font-bold">{activeRoomCourse.teacher.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-teal">
                        <Mic className="h-3 w-3" /> Micro actif
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between border-t border-white/10 bg-zinc-900 px-6 py-3 text-white">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-teal">
                      <Volume2 className="h-4 w-4" /> Audio HD
                    </span>
                    <span className="text-zinc-400">· 28 participants connectés</span>
                  </div>

                  <a
                    href={activeRoomCourse.roomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white hover:scale-105"
                  >
                    Ouvrir dans Google Meet
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Right Sidebar: Live Q&A Chat */}
              <div className="flex flex-col border-t border-line bg-panel lg:col-span-4 lg:border-t-0 lg:border-l">
                <div className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-wider text-soft">
                  Discussion & Questions en direct
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-3 text-xs ${
                        msg.isTeacher
                          ? "border border-accent/20 bg-accent/10 text-ink"
                          : "bg-paper text-ink"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-accent">
                        <span>{msg.sender}</span>
                        <span className="text-[10px] font-normal text-soft">{msg.time}</span>
                      </div>
                      <p className="mt-1 leading-relaxed text-ink/90">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-line p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Poser une question au formateur..."
                      className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-xs text-ink placeholder:text-soft focus:border-accent focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-ink hover:scale-105"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewCourseDoc && (
        <PdfAnnotatorModal
          isOpen={true}
          documentId={viewCourseDoc.id}
          documentTitle={viewCourseDoc.title}
          documentSubject={`${viewCourseDoc.subjectName} · ${viewCourseDoc.gradeCode}`}
          pdfUrl={`/api/files/${viewCourseDoc.subjectSlug}-lycee-${viewCourseDoc.gradeCode.toLowerCase()}-t1-course-001.pdf`}
          onClose={() => setViewCourseDoc(null)}
        />
      )}
    </div>
  );
}
