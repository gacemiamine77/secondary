"use client";

import {
  Award,
  Check,
  CheckCircle2,
  HelpCircle,
  Lock,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/lib/constants";
import { useI18n } from "@/components/providers";

export function PricingClient() {
  const { dir } = useI18n();
  const [activePlanId, setActivePlanId] = useState<string>("free");
  const [activationModalPlan, setActivationModalPlan] = useState<SubscriptionPlan | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentCycle, setStudentCycle] = useState("lycee");
  const [studentGrade, setStudentGrade] = useState("3AS (BAC)");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("massar_active_plan");
    if (saved) setActivePlanId(saved);
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id === activePlanId) return;
    setActivationModalPlan(plan);
  };

  const handleConfirmActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationModalPlan) return;

    localStorage.setItem("massar_active_plan", activationModalPlan.id);
    localStorage.setItem("massar_student_name", studentName || "Élève Massar");
    setActivePlanId(activationModalPlan.id);
    setSuccessToast(`Félicitations ! Votre abonnement "${activationModalPlan.name}" est maintenant actif.`);
    setActivationModalPlan(null);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const FAQS = [
    {
      q: "Quels sont les modes de paiement acceptés pour les abonnements ?",
      a: "Nous acceptons les paiements via carte Edahabia, BaridiMob, virement postal (CCP) ou paiement direct auprès de nos centres partenaires agréés.",
    },
    {
      q: "Les cours en direct sont-ils enregistrés si je rate une session ?",
      a: "Oui ! Tous les cours en direct et les masterclass sont enregistrés en haute définition et restent disponibles en replay illimité dans votre espace abonné tout au long de l'année.",
    },
    {
      q: "Comment fonctionne la correction personnalisée de devoirs ?",
      a: "Avec le Pass Excellence VIP, vous pouvez photographier ou scanner vos devoirs, dissertations ou exercices. Un enseignant certifié vous renvoie une copie annotée avec conseils personnalisés sous 24h.",
    },
    {
      q: "L'abonnement est-il valable pour tous les cycles ?",
      a: "Oui, un seul abonnement vous donne accès aux ressources et aux sessions interactives correspondant au niveau de l'élève (Primaire, Moyen ou Lycée).",
    },
  ];

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
            <Sparkles className="h-4 w-4" />
            Accompagnement Pédagogique Sur-Mesure
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-ink">
            Des Formules d’Abonnement Adaptées à Chaque Élève
          </h1>
          <p className="text-base sm:text-lg text-soft">
            Du téléchargement gratuit de cours jusqu’au mentorat VIP en direct avec nos formateurs pour décrocher la mention au BAC, au BEM ou à l’examen de 5e.
          </p>
        </div>

        {/* Success alert */}
        {successToast && (
          <div className="mb-10 mx-auto max-w-2xl flex items-center gap-3 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal shadow-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = activePlanId === plan.id;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 shadow-sm transition-all duration-300 ${
                  isPopular
                    ? "border-accent ring-2 ring-accent/20 bg-gradient-to-b from-panel via-panel to-accent/5 shadow-xl shadow-accent/10 lg:-translate-y-2"
                    : "border-line bg-panel hover:border-accent/40"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-black text-accent-ink uppercase tracking-wider shadow-md">
                    Formule la plus choisie
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-ink">
                        {plan.name}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase"
                        style={{
                          backgroundColor: `${plan.color}15`,
                          color: plan.color,
                        }}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-black text-ink">
                        {plan.priceDzd === 0 ? "0 DZD" : `${plan.priceDzd.toLocaleString()} DZD`}
                      </span>
                      <span className="text-xs text-soft font-semibold">
                        / {plan.periodFr}
                      </span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="border-t border-line/60 pt-6 space-y-3.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-soft">
                      Ce qui est inclus :
                    </div>
                    <ul className="space-y-3 text-xs leading-relaxed text-ink/90">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          {feat.included ? (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-line text-soft/50">
                              <Lock className="h-3 w-3" />
                            </span>
                          )}
                          <span className={feat.included ? "font-medium" : "text-soft/60 line-through"}>
                            {feat.textFr}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 border-t border-line/60 pt-6">
                  {isCurrent ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal/15 py-3 text-xs font-bold text-teal">
                      <CheckCircle2 className="h-4 w-4" />
                      Votre formule active
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all shadow-md ${
                        isPopular
                          ? "bg-accent text-accent-ink hover:scale-[1.02] shadow-accent/25"
                          : "bg-ink text-paper hover:bg-accent hover:text-accent-ink"
                      }`}
                    >
                      {plan.priceDzd === 0 ? "Utiliser la version gratuite" : "Souscrire à cette formule"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto rounded-3xl border border-line bg-panel p-8 sm:p-12">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" />
              Foire Aux Questions
            </div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Questions fréquentes sur les abonnements
            </h2>
          </div>

          <div className="divide-y divide-line/60">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-5 space-y-2">
                <h3 className="font-display text-base font-bold text-ink">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-soft">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activation Modal */}
      {activationModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-panel p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Souscription Massar
                </span>
                <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl mt-1">
                  Activer le {activationModalPlan.name}
                </h3>
              </div>
              <button
                onClick={() => setActivationModalPlan(null)}
                className="rounded-full border border-line bg-panel-2 p-2 text-soft hover:text-ink"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmActivation} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Nom & Prénom de l’élève :
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Anis Benmoussa"
                  className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Cycle d’études :
                  </label>
                  <select
                    value={studentCycle}
                    onChange={(e) => setStudentCycle(e.target.value)}
                    className="w-full rounded-2xl border border-line bg-paper px-3 py-3 text-xs text-ink focus:border-accent focus:outline-none"
                  >
                    <option value="primaire">Primaire (1AP - 5AP)</option>
                    <option value="moyen">Moyen (1AM - 4AM)</option>
                    <option value="lycee">Lycée (1AS - 3AS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Classe actuelle :
                  </label>
                  <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    placeholder="Ex: 3AS Scientifique"
                    className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-4 text-xs space-y-2">
                <div className="flex justify-between font-bold text-ink">
                  <span>Montant de la formule :</span>
                  <span className="text-accent font-display text-sm">
                    {activationModalPlan.priceDzd === 0 ? "0 DZD (Gratuit)" : `${activationModalPlan.priceDzd} DZD`}
                  </span>
                </div>
                <p className="text-[11px] text-soft">
                  Accès instantané à la plateforme, aux cours en direct et aux corrigés interactifs.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-accent-ink shadow-lg shadow-accent/25 hover:scale-[1.01] transition-transform"
              >
                Confirmer & Activer mon pass
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
