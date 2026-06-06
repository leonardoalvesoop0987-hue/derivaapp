"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Settings2, Sparkles, Flame, Zap } from "lucide-react";
import OnboardingSheet from "@/components/OnboardingSheet";

export default function NovaSessaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // New presets logic
  const [selectedPreset, setSelectedPreset] = useState("LEVE");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced settings
  const [mode, setMode] = useState("PADRAO");
  const [length, setLength] = useState("MEDIA");
  const [maxIntensity, setMaxIntensity] = useState("PICO");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [experienceType, setExperienceType] = useState("COMPLETA");
  const [kinkLevel, setKinkLevel] = useState("NORMAL");

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    fetch("/api/session/active")
      .then(res => res.json())
      .then(data => {
        if (data.hasActiveSession) setActiveSessionId(data.sessionId);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleAbortAndStart() {
    if (activeSessionId) {
      setLoading(true);
      await fetch("/api/session/abort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId })
      });
      setActiveSessionId(null);
      setLoading(false);
    }
  }

  function handleStartRequest() {
    // If user has not seen onboarding, show it
    const hasSeen = localStorage.getItem("deriva_onboarding_seen");
    if (!hasSeen) {
      setShowOnboarding(true);
    } else {
      executeStart();
    }
  }

  async function executeStart() {
    setLoading(true);
    try {
      let finalMode = mode;
      let finalLength = length;
      let finalMaxIntensity = maxIntensity;

      // Apply presets if not in custom mode
      if (selectedPreset === "LEVE") {
        finalMode = "ESTREIA";
        finalLength = "CURTA";
        finalMaxIntensity = "QUENTE";
      } else if (selectedPreset === "QUENTE") {
        finalMode = "PADRAO";
        finalLength = "MEDIA";
        finalMaxIntensity = "INTENSO";
      } else if (selectedPreset === "INTENSO") {
        finalMode = "PADRAO";
        finalLength = "COMPLETA";
        finalMaxIntensity = "PICO";
      } else if (selectedPreset === "CUSTOM") {
        // Use the advanced states as-is
      }

      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: finalMode,
          length: finalLength,
          maxIntensity: finalMaxIntensity,
          musicEnabled,
          preferencesJson: finalMode === "COM_PREFERENCIAS" ? JSON.stringify({ experienceType, kinkLevel }) : null
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar sessão");
      
      const { sessionId } = await res.json();
      router.push(`/app/sessao/${sessionId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (checkingSession) {
    return <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">Preparando o clima...</div>;
  }

  if (activeSessionId) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto mt-8 px-4">
        <div className="bg-[var(--color-card)] p-8 rounded-[2rem] border border-[var(--color-border)] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-wine)]/5 to-transparent pointer-events-none" />
          
          <div className="w-20 h-20 bg-[var(--color-wine)]/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border border-[var(--color-wine)]/20 shadow-inner">
            <Flame className="w-10 h-10 text-[var(--color-copper)] animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-serif text-white mb-3 relative z-10">O clima ainda está no ar</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-10 leading-relaxed font-light max-w-[280px] mx-auto relative z-10">
            Vocês deixaram uma noite pendente. Querem voltar de onde pararam ou recomeçar?
          </p>
          
          <div className="space-y-4 relative z-10">
            <button
              onClick={() => router.push(`/app/sessao/${activeSessionId}`)}
              className="w-full bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-red-deep)] text-white py-4 rounded-xl font-medium hover:brightness-110 transition-all shadow-lg"
            >
              Continuar
            </button>
            <button
              onClick={handleAbortAndStart}
              className="w-full bg-white/5 border border-white/10 text-[var(--color-text-secondary)] py-4 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-colors"
            >
              Encerrar e recomeçar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const PRESETS = [
    { 
      id: "LEVE", 
      title: "Leve e Íntimo", 
      desc: "Uma sequência carinhosa e provocante para começar sem pressa.",
      icon: <Sparkles className="w-5 h-5" />
    },
    { 
      id: "QUENTE", 
      title: "Quente e Progressivo", 
      desc: "A jornada clássica do Deriva. Começa no toque e esquenta com o tempo.",
      icon: <Flame className="w-5 h-5" />
    },
    { 
      id: "INTENSO", 
      title: "Mais Intenso", 
      desc: "Vai direto ao ponto. Exploração mais ousada sem enrolação.",
      icon: <Zap className="w-5 h-5" />
    },
    { 
      id: "CUSTOM", 
      title: "Personalizar", 
      desc: "Vocês escolhem os detalhes técnicos.",
      icon: <Settings2 className="w-5 h-5" />
    }
  ];

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto px-4 pb-10">
        <div className="mt-6 mb-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-3">Como vocês querem hoje?</h2>
          <p className="text-[var(--color-text-secondary)] text-base font-light">O Deriva organiza a noite. Escolham o ritmo.</p>
        </div>

        <div className="space-y-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPreset(p.id);
                if (p.id === "CUSTOM") setShowAdvanced(true);
                else setShowAdvanced(false);
              }}
              className={`w-full flex items-start p-5 rounded-2xl transition-all border text-left ${
                selectedPreset === p.id 
                  ? 'bg-gradient-to-r from-[var(--color-wine)]/20 to-[var(--color-wine)]/5 border-[var(--color-copper)] shadow-[0_0_20px_rgba(153,27,27,0.15)]' 
                  : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-white/20'
              }`}
            >
              <div className={`mt-1 mr-4 ${selectedPreset === p.id ? 'text-[var(--color-copper)]' : 'text-[var(--color-text-secondary)]'}`}>
                {p.icon}
              </div>
              <div className="flex-1">
                <span className={`block text-lg font-medium mb-1 ${selectedPreset === p.id ? 'text-white' : 'text-zinc-300'}`}>
                  {p.title}
                </span>
                <span className="block text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
                  {p.desc}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Settings Drawer/Section */}
        {showAdvanced && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6 pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-copper)] uppercase tracking-widest text-center mb-6">Ajustes Finos</h3>
            
            {/* Modo */}
            <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
              <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Base da Sessão</label>
              <select 
                value={mode} 
                onChange={e => setMode(e.target.value)}
                className="w-full bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-copper)] appearance-none"
              >
                <option value="PADRAO">Jornada Padrão</option>
                <option value="COM_PREFERENCIAS">Com Preferências Focadas</option>
                <option value="PERSONALIZADO">Meu Deck Exclusivo (Requer setup)</option>
              </select>
            </div>

            {/* Duração e Intensidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
                <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Duração</label>
                <select 
                  value={length} 
                  onChange={e => setLength(e.target.value)}
                  className="w-full bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[var(--color-copper)] appearance-none"
                >
                  <option value="CURTA">Curta</option>
                  <option value="MEDIA">Média</option>
                  <option value="COMPLETA">Longa</option>
                </select>
              </div>

              <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
                <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Teto Máximo</label>
                <select 
                  value={maxIntensity} 
                  onChange={e => setMaxIntensity(e.target.value)}
                  className="w-full bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[var(--color-copper)] appearance-none"
                >
                  <option value="LEVE">Leve 🔥</option>
                  <option value="QUENTE">Quente 🔥🔥</option>
                  <option value="INTENSO">Intenso 🔥🔥🔥</option>
                  <option value="PICO">Pico 🔥🔥🔥🔥</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-sm text-white">Música ambiente</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1 font-light">Trilha sutil para ajudar no clima</div>
          </div>
          <button 
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ml-4 ${musicEnabled ? 'bg-[var(--color-copper)]' : 'bg-[var(--color-background-primary)]'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${musicEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <button
          onClick={handleStartRequest}
          disabled={loading}
          className="w-full py-5 bg-[var(--color-wine)] text-white hover:bg-[var(--color-red-deep)] transition-colors rounded-2xl font-medium tracking-wide shadow-lg shadow-[var(--color-wine)]/30 mt-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">{loading ? "Preparando o clima..." : "Começar a noite"}</span>
        </button>
      </div>

      <OnboardingSheet 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        onStart={() => {
          setShowOnboarding(false);
          localStorage.setItem("deriva_onboarding_seen", "true");
          executeStart();
        }} 
      />
    </>
  );
}
