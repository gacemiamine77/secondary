"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useI18n } from "./providers";

export function OfflineIndicator() {
  const { locale } = useI18n();
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    // Register service worker if available
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.debug("SW registration ignored:", err));
    }

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-300 ${
        isOffline
          ? "border border-amber-500/30 bg-amber-500/20 text-amber-300"
          : "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
      }`}
    >
      {isOffline ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <WifiOff className="h-3.5 w-3.5" />
          <span>
            {locale === "ar"
              ? "وضع عدم الاتصال · التصفح من الذاكرة المؤقتة"
              : locale === "en"
              ? "Offline Mode · Browsing cached resources"
              : "Mode Hors-Ligne · Consultation hors connexion active"}
          </span>
        </>
      ) : (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>
            {locale === "ar"
              ? "تمت استعادة الاتصال"
              : locale === "en"
              ? "Connection restored"
              : "Connexion rétablie"}
          </span>
        </>
      )}
    </div>
  );
}
