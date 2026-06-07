"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const checkStandalone = () => {
      return window.matchMedia("(display-mode: standalone)").matches ||
             ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true);
    };
    
    const standalone = checkStandalone();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsStandalone(standalone);

    if (standalone) return;

    // Check if user previously dismissed
    const dismissed = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissed === "true") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-[88px] left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-80">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-2xl shadow-2xl flex items-start gap-4">
        <div className="bg-[var(--color-wine)] p-2 rounded-xl text-white">
          <Download className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1">Usar em tela cheia</h4>
          <p className="text-xs text-[var(--color-text-secondary)] mb-3">
            Instale o Deriva no Android para abrir sem a barra do navegador e usar melhor no celular, tablet ou projetor.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors text-white text-xs font-medium rounded-lg"
            >
              Instalar Deriva
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-transparent border border-[var(--color-border)] hover:bg-white/5 transition-colors text-[var(--color-text-secondary)] text-xs font-medium rounded-lg"
            >
              Agora não
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
