"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings2, Sparkles, Flame, Zap } from "lucide-react";
import OnboardingSheet from "@/components/OnboardingSheet";

export default function NovaSessaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [voiceSettings, setVoiceSettings] = useState<{enabled: boolean, playbackMode: string} | null>(null);
  const [sessionFocus, setSessionFocus] = useState("FOR_HER");
  const [queryMode, setQueryMode] = useState<string | null>(null);
  const [categoryBias, setCategoryBias] = useState("ROSA");

  // New presets logic
  const [selectedPreset, setSelectedPreset] = useState("LEVE");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced settings
  const [mode, setMode] = useState("PADRAO");
  const [length, setLength] = useState("MEDIA");
  const [maxIntensity, setMaxIntensity] = useState("PICO");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const experienceType = "COMPLETA";
  const kinkLevel = "NORMAL";

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    fetch("/api/session/active")
      .then(res => res.json())
      .then(data => {
        if (data.hasActiveSession) setActiveSessionId(data.sessionId);
      })
      .finally(() => setCheckingSession(false));
      
    fetch("/api/session/voice-settings")
      .then(res => res.json())
      .then(data => setVoiceSettings(data))
      .catch(console.error);

    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueryMode(params.get("mode"));
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
      } else if (selectedPreset === "NOITE_ESPECIAL") {
        finalMode = "NOITE_ESPECIAL";
        finalLength = "CURTA";
        finalMaxIntensity = "PICO";
      } else if (selectedPreset === "CUSTOM") {
        // Use the advanced states as-is
      }

      if (queryMode) {
        finalMode = queryMode;
      }

      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: finalMode,
          length: finalLength,
          maxIntensity: finalMaxIntensity,
          musicEnabled,
          sessionFocus,
          categoryBias: finalMode === "FOCO_CATEGORIA" ? categoryBias : undefined,
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
    return <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">Entrando no clima...</div>;
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
      desc: "Uma provocação suave para começar o jogo e subir a tensão aos poucos.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: "QUENTE",
      title: "Quente e Progressivo",
      desc: "A jornada clássica. O clima esquenta a cada carta revelada.",
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: "INTENSO",
      title: "Mais Intenso",
      desc: "Direto ao ponto. Uma exploração mais ousada e provocante.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "NOITE_ESPECIAL",
      title: "Noite Mais que Especial",
      desc: "Uma sequência especial focada nela, com 12 cartas selecionadas.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: "CUSTOM",
      title: "Personalizar",
      desc: "Vocês definem as regras e a estrutura da noite.",
      icon: <Settings2 className="w-5 h-5" />
    }
  ];

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto px-4 pb-10">
        <div className="mt-6 mb-8 text-center">
          <h2 className="text-3xl font-light text-white mb-3 tracking-wide">
            {queryMode === "FAISCA" ? "Faísca" :
             queryMode === "MERGULHO" ? "Mergulho" :
             queryMode === "NOITE_DELA" ? "Noite Dela" :
             queryMode === "FOCO_CATEGORIA" ? "Foco em Categoria" :
             queryMode === "TONS_ESCUROS" ? "Tons mais escuros" :
             <><span className="font-serif text-[#d4a373] italic">Noite</span> Guiada</>}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm font-light">
            {queryMode === "FAISCA" ? "Uma carta surpresa para subir a temperatura agora." :
             queryMode === "MERGULHO" ? "Esta sessão já começa quente e sem rodeios." :
             queryMode === "NOITE_DELA" ? "O Deriva puxa o clima para ela desde o início." :
             queryMode === "FOCO_CATEGORIA" ? "Escolham o tipo de clima da noite." :
             queryMode === "TONS_ESCUROS" ? "Um território mais provocante, com escolha e saída fácil." :
             "Vocês escolhem o ritmo. O Deriva conduz o jogo."}
          </p>
        </div>

        {queryMode === "FOCO_CATEGORIA" && (
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm mb-6">
            <div className="font-medium text-sm text-white mb-3">Qual o clima desejado?</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "ROSA", label: "Rosa", desc: "Romântico e tátil" },
                { id: "ROXO", label: "Roxa", desc: "Roleplays e jogos" },
                { id: "VERMELHO", label: "Vermelha", desc: "Quente e direto" },
                { id: "PRETO", label: "Preta", desc: "Intenso e selvagem" },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategoryBias(c.id)}
                  className={`flex flex-col p-3 rounded-xl transition-colors border text-left ${categoryBias === c.id ? 'bg-[#2a0a0f] border-[#d4a373]/50' : 'bg-[#130c0a] border-white/5 hover:border-white/10'}`}
                >
                  <span className={`text-sm font-medium ${categoryBias === c.id ? 'text-[#d4a373]' : 'text-white/80'}`}>{c.label}</span>
                  <span className="text-xs text-white/40 mt-1">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!queryMode && (
          <>
            <div className="space-y-4">
            {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPreset(p.id);
                if (p.id === "CUSTOM") setShowAdvanced(true);
                else setShowAdvanced(false);
              }}
              className={`w-full flex items-start p-5 rounded-2xl transition-all text-left border ${
                selectedPreset === p.id 
                  ? 'bg-gradient-to-r from-[#2a0a0f] to-transparent border-[#d4a373]/30 shadow-lg shadow-[#2a0a0f]/50' 
                  : 'bg-[#130c0a] border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`mt-1 mr-4 transition-colors ${selectedPreset === p.id ? 'text-[#d4a373]' : 'text-white/20'}`}>
                {p.icon}
              </div>
              <div className="flex-1">
                <span className={`block text-lg font-medium mb-1 tracking-wide transition-colors ${selectedPreset === p.id ? 'text-white' : 'text-zinc-400'}`}>
                  {p.title}
                </span>
                <span className="block text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
                  {p.desc}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm mt-6 mb-2">
          <div className="font-medium text-sm text-white mb-1">Foco da noite</div>
          <div className="text-xs text-[var(--color-text-secondary)] font-light mb-4">Escolham para onde o Deriva deve puxar mais o clima desta sessão.</div>
          <div className="flex gap-2">
            {[
              { id: "FOR_HER", label: "Ela no centro" },
              { id: "BALANCED", label: "Equilibrado" },
              { id: "FOR_HIM", label: "Ele no centro" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSessionFocus(f.id)}
                className={`flex-1 py-2 px-1 text-xs rounded-lg transition-colors border ${sessionFocus === f.id ? 'bg-[#2a0a0f] border-[#d4a373]/50 text-[#d4a373]' : 'bg-[#130c0a] border-white/5 text-white/50 hover:border-white/10'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Settings Drawer/Section */}
        {showAdvanced && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6 pt-4 border-t border-white/5 mt-4">
            <h3 className="text-xs font-medium text-[#d4a373] uppercase tracking-widest text-center mb-6">Ajustes Finos</h3>
            
            {/* Modo */}
            <div className="bg-[#130c0a] p-4 rounded-2xl border border-white/5 shadow-sm">
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Estrutura do jogo</label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full bg-[#0d0806] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 outline-none focus:border-[#d4a373]/50 appearance-none transition-colors"
              >
                <option value="PADRAO">Jornada Padrão</option>
                <option value="COM_PREFERENCIAS">Com Preferências Focadas</option>
                <option value="NOITE_ESPECIAL">Noite Mais que Especial</option>
                <option value="PERSONALIZADO">Meu Deck Exclusivo (Requer setup)</option>
              </select>
            </div>

            {/* Duração e Intensidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#130c0a] p-4 rounded-2xl border border-white/5 shadow-sm">
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Ritmo</label>
                <select 
                  value={length} 
                  onChange={e => setLength(e.target.value)}
                  className="w-full bg-[#0d0806] border border-white/10 rounded-xl px-3 py-3 text-sm text-white/90 outline-none focus:border-[#d4a373]/50 appearance-none transition-colors"
                >
                  <option value="CURTA">Curta</option>
                  <option value="MEDIA">Média</option>
                  <option value="COMPLETA">Longa</option>
                </select>
              </div>

              <div className="bg-[#130c0a] p-4 rounded-2xl border border-white/5 shadow-sm">
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Até onde ir hoje</label>
                <select 
                  value={maxIntensity} 
                  onChange={e => setMaxIntensity(e.target.value)}
                  className="w-full bg-[#0d0806] border border-white/10 rounded-xl px-3 py-3 text-sm text-white/90 outline-none focus:border-[#d4a373]/50 appearance-none transition-colors"
                >
                  <option value="LEVE">Leve</option>
                  <option value="QUENTE">Quente</option>
                  <option value="INTENSO">Intenso</option>
                  <option value="PICO">Pico</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
          </>
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

        {voiceSettings?.enabled ? (
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[#d4a373]/30 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-[#d4a373]">Narração da carta</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1 font-light">
                {voiceSettings.playbackMode === 'automatic' ? 'Ativada (Automático)' : 'Ativada (Manual)'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center justify-between opacity-50 cursor-not-allowed">
            <div>
              <div className="font-medium text-sm text-white">Narração da carta</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1 font-light">Desligada</div>
            </div>
          </div>
        )}

        <div className="bg-[#1a1410]/50 p-5 rounded-2xl border border-[#d4a373]/20 space-y-4">
          <div>
            <div className="font-[var(--font-cormorant)] italic text-[#d4a373] text-lg mb-1">Como jogar:</div>
            <div className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
              A cada rodada, um de vocês revela a carta. Leia a headline provocante para entrar no clima, e siga os detalhes apenas se quiserem ir mais fundo.
            </div>
          </div>
          <div>
            <div className="font-[var(--font-cormorant)] italic text-[#d4a373] text-lg mb-1">A regra de segurança:</div>
            <div className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
              Verde continua. Amarelo diminui o ritmo. Vermelho encerra ou pula a carta.<br/>
              A regra garante que a tensão cresça com absoluta confiança.
            </div>
          </div>
        </div>

        <button
          onClick={handleStartRequest}
          disabled={loading}
          className="w-full py-5 bg-[var(--color-wine)] text-white hover:bg-[var(--color-red-deep)] transition-colors rounded-2xl font-medium tracking-wide shadow-lg shadow-[var(--color-wine)]/30 mt-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">{loading ? "Entrando no clima..." : "Começar a noite"}</span>
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
