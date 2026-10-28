"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Highlighter,
  PenTool,
  Type,
  Eraser,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useI18n } from "../providers";

interface PdfAnnotatorModalProps {
  documentId: number;
  documentTitle: string;
  documentSubject: string;
  pdfUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type ToolType = "navigate" | "highlighter" | "pen" | "note" | "eraser";

interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
}

export function PdfAnnotatorModal({
  documentId,
  documentTitle,
  documentSubject,
  pdfUrl,
  isOpen,
  onClose,
}: PdfAnnotatorModalProps) {
  const { locale } = useI18n();
  const [activeTool, setActiveTool] = useState<ToolType>("highlighter");
  const [toolColor, setToolColor] = useState<string>("#facc15"); // yellow highlighter
  const [penSize, setPenSize] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Restore saved annotations for this document
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(`massar-annotations-${documentId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.canvasData && canvasRef.current) {
          const img = new Image();
          img.src = parsed.canvasData;
          img.onload = () => {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx && canvasRef.current) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.drawImage(img, 0, 0);
            }
          };
        }
      }
    } catch (e) {
      console.debug("Failed to load annotations", e);
    }
  }, [isOpen, documentId]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "navigate") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "note") {
      const defaultNotes = [
        "Point clé à retenir pour l'examen",
        "Formule essentielle",
        "Attention au piège classique",
        "Question fréquente au BAC/BEM",
      ];
      const randomNote = defaultNotes[Math.floor(Math.random() * defaultNotes.length)];
      setNotes((prev) => [
        ...prev,
        { id: `note-${Date.now()}`, x, y, text: randomNote },
      ]);
      return;
    }

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else if (activeTool === "highlighter") {
      ctx.globalCompositeOperation = "multiply";
      ctx.strokeStyle = toolColor;
      ctx.fillStyle = toolColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 18;
      ctx.lineCap = "square";
    } else {
      // Pen
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = toolColor;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = penSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setNotes([]);
  };

  const saveAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasData = canvas.toDataURL();
    localStorage.setItem(
      `massar-annotations-${documentId}`,
      JSON.stringify({ canvasData, notes, updatedAt: new Date().toISOString() })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md"
    >
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-panel px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink truncate max-w-sm sm:max-w-md">
              {documentTitle}
            </h3>
            <p className="text-[11px] text-soft">
              {documentSubject} · Visionneuse & Outils d'annotation en direct
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Annotations sauvegardées !
            </span>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl.includes("?") ? pdfUrl : `${pdfUrl}?dl=1`}
              download
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3.5 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Télécharger PDF</span>
            </a>
          )}

          <button
            type="button"
            onClick={saveAnnotations}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-ink shadow-md hover:scale-105 transition-transform"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Sauvegarder</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-soft hover:bg-panel-2 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Floating Annotation Toolbar */}
      <div className="mx-auto my-3 flex flex-wrap items-center justify-center gap-2 rounded-full border border-line bg-panel/90 px-4 py-2 shadow-xl backdrop-blur-md z-10">
        <button
          type="button"
          onClick={() => {
            setActiveTool("highlighter");
            setToolColor("#facc15");
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            activeTool === "highlighter"
              ? "bg-amber-400 text-black shadow-md"
              : "text-soft hover:text-ink"
          }`}
        >
          <Highlighter className="h-3.5 w-3.5" />
          <span>Surligneur</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTool("pen");
            setToolColor("#3b82f6");
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            activeTool === "pen"
              ? "bg-blue-500 text-white shadow-md"
              : "text-soft hover:text-ink"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Stylo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("note")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            activeTool === "note"
              ? "bg-accent text-accent-ink shadow-md"
              : "text-soft hover:text-ink"
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          <span>Note mémo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("eraser")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            activeTool === "eraser"
              ? "bg-rose-500 text-white shadow-md"
              : "text-soft hover:text-ink"
          }`}
        >
          <Eraser className="h-3.5 w-3.5" />
          <span>Gomme</span>
        </button>

        {/* Color Palette */}
        <div className="h-4 w-px bg-line mx-1" />
        <div className="flex items-center gap-1.5">
          {["#facc15", "#4ade80", "#f43f5e", "#3b82f6", "#a855f7"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setToolColor(c)}
              className={`h-5 w-5 rounded-full transition-transform ${
                toolColor === c ? "scale-125 ring-2 ring-white ring-offset-1" : "hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Clear & Zoom */}
        <div className="h-4 w-px bg-line mx-1" />
        <button
          type="button"
          onClick={clearCanvas}
          className="flex h-7 w-7 items-center justify-center rounded-full text-soft hover:bg-panel-2 hover:text-rose-400"
          title="Effacer tout"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-1 text-xs text-soft">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-panel-2 text-soft"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] min-w-[3ch] text-center">{zoomLevel}%</span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-panel-2 text-soft"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document View Canvas */}
      <div className="relative flex-1 overflow-auto p-4 sm:p-8 flex justify-center">
        <div
          className="relative bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 transition-transform duration-200 select-none"
          style={{
            width: "820px",
            minHeight: "1050px",
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Mock Document Render */}
          <div className="pointer-events-none">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                  {documentTitle}
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Matière : {documentSubject} · Page {currentPage} / {totalPages}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">
                  MASSAR OFFICIEL
                </span>
              </div>
            </div>

            {/* Document Content Sections (Page-specific) */}
            <div className="mt-8 space-y-6 text-sm text-slate-800 leading-relaxed font-serif">
              {currentPage === 1 && (
                <>
                  <section>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-indigo-600 pl-3">
                        Section I : Rappels de Cours & Définitions Clés
                      </h2>
                      <span className="text-[11px] font-sans font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Programme Officiel
                      </span>
                    </div>
                    <p>
                      Dans cette unité, nous étudions les fondements méthodologiques indispensables pour la résolution des épreuves officielles. Veillez à bien maîtriser chaque énoncé théorique avant d'aborder les cas pratiques.
                    </p>
                    <div className="my-3 p-3 bg-slate-50 border-l-2 border-slate-400 font-mono text-xs text-slate-700 rounded-r">
                      Théorème fondamental : Tout raisonnement par récurrence requiert impérativement deux étapes distinctes : l'initialisation (rang n=n₀) et l'hérédité (supposer P(k) vraie pour démontrer P(k+1)).
                    </div>
                  </section>

                  <section className="pt-4 border-t border-slate-200">
                    <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-teal-600 pl-3">
                      Exercice 1 : Raisonnement et convergence
                    </h2>
                    <p>
                      Soit (u_n) la suite numérique définie par : u_0 = 4 et u_&#123;n+1&#125; = 0.5 × u_n + 3.
                    </p>
                    <p className="mt-2">
                      1. Démontrer par récurrence que pour tout entier naturel n, u_n &lt; 6.
                    </p>
                    <p className="mt-2">
                      2. Étudier le sens de variation de la suite (u_n) et en déduire qu'elle est convergente.
                    </p>
                    <p className="mt-2">
                      3. On pose v_n = u_n - 6. Montrer que (v_n) est une suite géométrique dont on précisera le premier terme et la raison.
                    </p>
                  </section>
                </>
              )}

              {currentPage === 2 && (
                <>
                  <section>
                    <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-sky-600 pl-3">
                      Section II : Exercices d'Application Approfondis
                    </h2>
                    <p className="font-sans font-semibold text-xs text-slate-600 mb-2">
                      Application directe des critères de convergence et calcul de limites :
                    </p>
                    <p>
                      1. Exprimer v_n puis u_n explicitement en fonction de n pour tout n ∈ ℕ.
                    </p>
                    <p className="mt-2">
                      2. Calculer la limite de (u_n) quand n tend vers +∞. Interpréter graphiquement la valeur limite obtenue.
                    </p>
                    <p className="mt-2">
                      3. Déterminer la somme S_n = v_0 + v_1 + ... + v_n, puis en déduire la somme T_n = u_0 + u_1 + ... + u_n.
                    </p>
                  </section>

                  <section className="pt-4 border-t border-slate-200">
                    <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-amber-600 pl-3">
                      Exercice 2 : Problème de synthèse type BAC
                    </h2>
                    <p>
                      Une colonie bactérienne compte initialement 4 000 individus. Chaque heure, la population perd la moitié de ses effectifs mais absorbe 3 000 nouvelles bactéries issues du milieu nutritif.
                    </p>
                    <p className="mt-2">
                      Montrer que cette situation est modélisée par la suite (u_n). Vers quel effectif stationnaire la population se stabilise-t-elle à long terme ?
                    </p>
                  </section>
                </>
              )}

              {currentPage === 3 && (
                <>
                  <section>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-emerald-600 pl-3">
                        Section III : Corrigé Type Officiel & Barème
                      </h2>
                      <span className="text-[11px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Corrigé Détaillé
                      </span>
                    </div>
                    <div className="space-y-3 font-sans text-xs">
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <span className="font-bold text-emerald-900 block mb-1">Question 1 (Initialisation & Hérédité) - 2 points :</span>
                        <p className="text-emerald-800">
                          Pour n=0, u_0 = 4 &lt; 6 : la propriété est vérifiée au rang initial. Supposons u_k &lt; 6. Alors 0.5 u_k &lt; 3, donc 0.5 u_k + 3 &lt; 6, soit u_&#123;k+1&#125; &lt; 6. La propriété est héréditaire, donc pour tout n ∈ ℕ, u_n &lt; 6.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Question 2 (Monotonie) - 1.5 points :</span>
                        <p className="text-slate-700">
                          u_&#123;n+1&#125; - u_n = 0.5 u_n + 3 - u_n = -0.5 u_n + 3 = -0.5 (u_n - 6). Puisque u_n &lt; 6, u_n - 6 &lt; 0, d'où u_&#123;n+1&#125; - u_n &gt; 0. La suite est strictement croissante. Étant majorée par 6, elle converge.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Question 3 (Suite auxiliaire) - 2 points :</span>
                        <p className="text-slate-700">
                          v_&#123;n+1&#125; = u_&#123;n+1&#125; - 6 = 0.5 u_n - 3 = 0.5 (u_n - 6) = 0.5 v_n. (v_n) est géométrique de raison q = 0.5 et de premier terme v_0 = 4 - 6 = -2.
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {currentPage === 4 && (
                <>
                  <section>
                    <h2 className="text-base font-bold font-sans text-slate-900 mb-2 border-l-4 border-rose-600 pl-3">
                      Section IV : Conseils de l'Enseignant & Pièges à Éviter
                    </h2>
                    <div className="space-y-3 font-sans text-xs">
                      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-900">
                        <span className="font-bold block mb-1">⚠️ Erreur fréquente des candidats :</span>
                        Ne pas confondre la convergence de la suite et la convergence de la série. De plus, ne jamais affirmer qu'une suite converge sans vérifier qu'elle est à la fois monotone et bornée !
                      </div>
                      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900">
                        <span className="font-bold block mb-1">💡 Astuce de rédaction au BAC :</span>
                        Toujours écrire la phrase bilan : « La suite (u_n) est croissante et majorée par 6, donc d'après le théorème de convergence monotone, elle converge vers une limite réelle l ≤ 6. »
                      </div>
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-indigo-900">
                        <span className="font-bold block mb-1">📌 Formulaire mémo :</span>
                        Pour toute suite géométrique de premier terme v_0 et de raison q ≠ 1 : S_n = v_0 × (1 - q^&#123;n+1&#125;) / (1 - q).
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>

          {/* Sticky Notes on the Page */}
          {notes.map((n) => (
            <div
              key={n.id}
              style={{ left: `${n.x}px`, top: `${n.y}px` }}
              className="absolute z-20 max-w-[200px] rounded-xl bg-amber-200 p-2 text-xs font-sans text-amber-950 shadow-md border border-amber-300"
            >
              <div className="flex items-center justify-between border-b border-amber-300/60 pb-1 mb-1">
                <span className="text-[10px] font-bold">Mémo</span>
                <button
                  type="button"
                  onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                  className="text-amber-800 hover:text-black"
                >
                  ×
                </button>
              </div>
              <p>{n.text}</p>
            </div>
          ))}

          {/* Canvas Overlay for Freehand Drawing & Highlighting */}
          <canvas
            ref={canvasRef}
            width={740}
            height={980}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute inset-0 z-10 cursor-crosshair rounded-2xl"
          />
        </div>
      </div>

      {/* Bottom Page Navigation */}
      <div className="flex h-12 items-center justify-center gap-4 border-t border-white/10 bg-panel px-4 text-xs">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-soft hover:text-ink disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Page précédente
        </button>

        <span className="font-semibold text-ink">
          Page {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-soft hover:text-ink disabled:opacity-40"
        >
          Page suivante
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
