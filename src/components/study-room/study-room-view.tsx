"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Send,
  Share2,
  Copy,
  CheckCircle2,
  Download,
  Sparkles,
  Printer,
  ChevronRight,
  Clock,
  UserPlus,
} from "lucide-react";
import { useI18n } from "../providers";
import type {
  DigitalNotebook,
  PeerStudyEvent,
  StudyRoomMessage,
} from "@/lib/student-platform";
import { FocusTimerModal } from "../focus/focus-timer-modal";

interface StudyRoomViewProps {
  initialChannelId?: string;
}

const CHANNELS = [
  { id: "maths-bac-2026", name: "#maths-bac-2026", desc: "Suites, Continuité & Logarithmes", activeCount: 24 },
  { id: "physique-chimie", name: "#physique-chimie", desc: "RC, RL & Titrages acido-basiques", activeCount: 18 },
  { id: "prep-bem-4am", name: "#prep-bem-4am", desc: "Thalès, Pythagore & Révisions 4AM", activeCount: 15 },
  { id: "entraide-generale", name: "#entraide-generale", desc: "Conseils de révision & Motivation", activeCount: 32 },
];

export function StudyRoomView({ initialChannelId = "maths-bac-2026" }: StudyRoomViewProps) {
  const { locale } = useI18n();
  const [activeChannel, setActiveChannel] = useState(initialChannelId);
  const [activeTab, setActiveTab] = useState<"chat" | "notebook" | "calendar">("notebook");

  // Chat State
  const [messages, setMessages] = useState<StudyRoomMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  // Digital Notebook State
  const [notebook, setNotebook] = useState<DigitalNotebook | null>(null);
  const [notebookContent, setNotebookContent] = useState("");
  const [isSavingNotebook, setIsSavingNotebook] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Peer Events State
  const [peerEvents, setPeerEvents] = useState<PeerStudyEvent[]>([]);

  // Fetch channel data
  const loadChannelData = (chId: string) => {
    fetch(`/api/study-rooms?channelId=${chId}&topicId=${chId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
        if (data.notebook) {
          setNotebook(data.notebook);
          setNotebookContent(data.notebook.content);
        }
        if (data.peerEvents) setPeerEvents(data.peerEvents);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadChannelData(activeChannel);
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/study-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          channelId: activeChannel,
          text: inputText.trim(),
          sender: "Amina Benali",
        }),
      });
      const data = await res.json();
      if (data.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSaveNotebook = async () => {
    setIsSavingNotebook(true);
    try {
      const res = await fetch("/api/study-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_notebook",
          topicId: activeChannel,
          content: notebookContent,
          editorName: "Amina Benali",
        }),
      });
      const data = await res.json();
      if (data.ok && data.notebook) {
        setNotebook(data.notebook);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNotebook(false);
    }
  };

  const handleToggleRsvp = async (eventId: string) => {
    try {
      const res = await fetch("/api/study-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_rsvp",
          eventId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setPeerEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? { ...e, isRsvp: data.isRsvp, attendeesCount: data.attendeesCount }
              : e
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyInviteLink = () => {
    const link = `https://massar.dz/espace-etude?room=${activeChannel}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleDownloadNotebook = () => {
    const blob = new Blob([notebookContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `massar-notes-${activeChannel}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2 to-panel p-6 shadow-sm sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent mb-2">
                <Users className="h-3.5 w-3.5" />
                Espace d'Étude Virtuel & Entraide
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Cahier Numérique Partagé & Salons de Révision
              </h1>
              <p className="mt-1 text-xs text-soft max-w-xl">
                Rédigez ensemble des synthèses de cours, échangez en direct et planifiez des sessions d'étude en groupe.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FocusTimerModal />
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-ink shadow-md hover:scale-105 transition-transform"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Inviter au groupe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Channels Sidebar + Workspace Area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Channels Sidebar */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-soft mb-3">
                Salons Thématiques
              </h3>
              <div className="space-y-2">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannel(ch.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-start transition-all ${
                      activeChannel === ch.id
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-line bg-paper/60 hover:border-line hover:bg-panel-2"
                    }`}
                  >
                    <div>
                      <span className="font-display text-xs font-bold text-ink block">
                        {ch.name}
                      </span>
                      <span className="text-[11px] text-soft block mt-0.5">{ch.desc}</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {ch.activeCount} en ligne
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Peer Study Calendar Widget */}
            <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-soft">
                  Sessions Programmées
                </h3>
                <Calendar className="h-4 w-4 text-accent" />
              </div>

              <div className="space-y-3">
                {peerEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="rounded-2xl border border-line bg-paper/60 p-3 text-xs"
                  >
                    <span className="font-semibold text-ink block truncate">{evt.title}</span>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-soft">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-accent" />
                        {evt.date} · {evt.time}
                      </span>
                      <span>{evt.attendeesCount} inscrits</span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2">
                      <span className="text-[10px] text-soft">Hôte : {evt.host}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleRsvp(evt.id)}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                          evt.isRsvp
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-accent/10 text-accent hover:bg-accent hover:text-accent-ink"
                        }`}
                      >
                        {evt.isRsvp ? "Inscrit ✓" : "Je participe"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area: Digital Notebook & Chat */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-line bg-panel shadow-sm overflow-hidden flex flex-col h-[700px]">
              {/* Top Mode Bar */}
              <div className="flex items-center justify-between border-b border-line px-6 py-3.5 bg-panel-2/50">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("notebook")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      activeTab === "notebook"
                        ? "bg-accent text-accent-ink shadow-sm"
                        : "text-soft hover:text-ink"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Digital Notebook (Cahier Partagé)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      activeTab === "chat"
                        ? "bg-accent text-accent-ink shadow-sm"
                        : "text-soft hover:text-ink"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Discussion de Groupe ({messages.length})</span>
                  </button>
                </div>

                {/* Notebook actions */}
                {activeTab === "notebook" && (
                  <div className="flex items-center gap-2">
                    {saveSuccess && (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sauvegardé !
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleDownloadNotebook}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel text-soft hover:text-ink"
                      title="Télécharger les notes en Markdown"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={isSavingNotebook}
                      onClick={handleSaveNotebook}
                      className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-ink shadow-sm hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {isSavingNotebook ? "Sauvegarde..." : "Enregistrer les notes"}
                    </button>
                  </div>
                )}
              </div>

              {/* TAB: DIGITAL NOTEBOOK */}
              {activeTab === "notebook" && (
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                  <div className="flex items-center justify-between pb-3 text-xs text-soft border-b border-line/60">
                    <span className="font-bold text-ink">
                      {notebook?.topicTitle ?? "Notes collaboratives"}
                    </span>
                    <span>
                      Dernière modification : {notebook?.lastEditedBy} ({notebook?.lastUpdatedAt})
                    </span>
                  </div>

                  <div className="mt-4 flex-1 flex flex-col">
                    <textarea
                      value={notebookContent}
                      onChange={(e) => setNotebookContent(e.target.value)}
                      placeholder="Écrivez vos notes de révision partagées avec formules mathématiques..."
                      className="flex-1 w-full resize-none rounded-2xl border border-line bg-paper p-5 font-mono text-xs text-ink leading-relaxed outline-none focus:border-accent"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-soft">
                    <span>Format : Markdown standard & formules LaTeX</span>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-1 hover:text-ink"
                    >
                      <Printer className="h-3 w-3" />
                      Imprimer / Fiche de révision
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: CHAT ROOM */}
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3 text-xs">
                        <img
                          src={msg.avatar}
                          alt={msg.sender}
                          className="h-8 w-8 rounded-full border border-line object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{msg.sender}</span>
                            {msg.isTeacher && (
                              <span className="rounded-full bg-accent/15 px-2 py-0.2 text-[9px] font-bold text-accent">
                                Formateur certifié
                              </span>
                            )}
                            <span className="text-[10px] text-soft">{msg.timestamp}</span>
                          </div>
                          <div className="mt-1 rounded-2xl border border-line/60 bg-paper/60 p-3 text-ink leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="border-t border-line bg-panel p-4 flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Partagez une question ou une remarque avec le groupe..."
                      className="flex-1 rounded-2xl border border-line bg-paper px-4 py-2.5 text-xs text-ink outline-none focus:border-accent"
                    />
                    <button
                      type="submit"
                      disabled={sending || !inputText.trim()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-ink shadow-md hover:scale-105 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invite to Study Group Modal */}
        {showInviteModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel p-6 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-md">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                Inviter des Camarades au Salon
              </h3>
              <p className="mt-1 text-xs text-soft">
                Partagez ce lien direct pour collaborer sur le cahier numérique de {activeChannel}.
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-paper p-2 text-xs">
                <input
                  readOnly
                  value={`https://massar.dz/espace-etude?room=${activeChannel}`}
                  className="flex-1 bg-transparent px-2 font-mono text-[11px] text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink shadow-sm hover:scale-105"
                >
                  {copiedLink ? "Copié !" : "Copier"}
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-soft hover:bg-panel-2"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
