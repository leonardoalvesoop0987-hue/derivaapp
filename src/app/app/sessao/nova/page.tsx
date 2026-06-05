"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, XCircle } from "lucide-react";

export default function NovaSessaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [mode, setMode] = useState("PADRAO");
  const [length, setLength] = useState("MEDIA");
  const [maxIntensity, setMaxIntensity] = useState("PICO");
  const [videosEnabled, setVideosEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

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

  async function handleStart() {
    setLoading(true);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          length,
          maxIntensity,
          videosEnabled,
          musicEnabled
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
    return <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">Carregando...</div>;
  }

  if (activeSessionId) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto mt-8">
        <div className="bg-[var(--color-card)] p-6 rounded-3xl border border-[var(--color-border)] text-center shadow-lg">
          <div className="w-16 h-16 bg-[var(--color-wine)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-8 h-8 text-[var(--color-wine)]" />
          </div>
          <h2 className="text-2xl font-light mb-2">Você já tem uma sessão rolando</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
            Não perca o clima. Quer continuar de onde parou ou começar do zero?
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/app/sessao/${activeSessionId}`)}
              className="w-full bg-[var(--color-wine)] text-white py-4 rounded-xl font-medium hover:bg-[var(--color-red-deep)] transition-colors"
            >
              Continuar sessão
            </button>
            <button
              onClick={handleAbortAndStart}
              className="w-full bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] py-4 rounded-xl font-medium hover:bg-white/5 transition-colors"
            >
              Encerrar e começar outra
            </button>
          </div>
        </div>
      </div>
    );
  }

  const modes = [
    { id: "PADRAO", label: "Padrão", desc: "A jornada completa, de leve ao intenso." },
    { id: "ESTREIA", label: "Estreia", desc: "Mais leve e focado em conexão e carícias." },
    { id: "PERSONALIZADO", label: "Personalizado", desc: "Seu próprio deck escolhido a dedo." }
  ];

  const lengths = [
    { id: "CURTA", label: "Curta", desc: "Aproximadamente 15 cartas" },
    { id: "MEDIA", label: "Média", desc: "Aproximadamente 30 cartas" },
    { id: "COMPLETA", label: "Completa", desc: "Até vocês cansarem" }
  ];

  const intensities = [
    { id: "LEVE", label: "Leve 🔥" },
    { id: "QUENTE", label: "Quente 🔥🔥" },
    { id: "INTENSO", label: "Intenso 🔥🔥🔥" },
    { id: "PICO", label: "Pico 🔥🔥🔥🔥" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-light mb-2">Nova Sessão</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">Configure a jornada para hoje.</p>
      </div>

      <div className="space-y-6">
        {/* Modo */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Ritmo</label>
          <div className="flex flex-col gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-start p-3 rounded-xl transition-colors border ${mode === m.id ? 'bg-[var(--color-wine)]/10 border-[var(--color-wine)]' : 'border-transparent bg-[var(--color-background-primary)] hover:bg-white/5'}`}
              >
                <span className={`text-sm font-medium ${mode === m.id ? 'text-[var(--color-copper)]' : 'text-white'}`}>{m.label}</span>
                <span className="text-xs text-[var(--color-text-secondary)] mt-1 text-left">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Duração</label>
          <div className="flex gap-2 bg-[var(--color-background-primary)] p-1 rounded-xl">
            {lengths.map(l => (
              <button
                key={l.id}
                onClick={() => setLength(l.id)}
                className={`flex-1 py-2 px-1 text-xs font-medium rounded-lg transition-colors ${length === l.id ? 'bg-[var(--color-wine)] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            {lengths.find(l => l.id === length)?.desc}
          </p>
        </div>

        {/* Intensidade */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-primary)]">Intensidade Máxima</label>
          <div className="grid grid-cols-2 gap-2">
            {intensities.map(i => (
              <button
                key={i.id}
                onClick={() => setMaxIntensity(i.id)}
                className={`py-3 text-sm font-medium rounded-xl transition-colors border ${maxIntensity === i.id ? 'bg-[var(--color-wine)]/10 border-[var(--color-wine)] text-[var(--color-copper)]' : 'bg-[var(--color-background-primary)] border-transparent text-[var(--color-text-secondary)] hover:text-white'}`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-white">Adicionar vídeos (Cartas Roxas)</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Exibe trechos de vídeo adulto caso sorteie uma carta roxa</div>
            </div>
            <button 
              onClick={() => setVideosEnabled(!videosEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${videosEnabled ? 'bg-[var(--color-copper)]' : 'bg-[var(--color-background-primary)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${videosEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-white">Música ambiente</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Trilha sonora escolhida de acordo com a carta</div>
            </div>
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${musicEnabled ? 'bg-[var(--color-copper)]' : 'bg-[var(--color-background-primary)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-4 mt-4 bg-[var(--color-wine)] text-white hover:bg-[var(--color-red-deep)] transition-colors rounded-xl font-medium tracking-wide shadow-lg"
        >
          {loading ? "Preparando o clima..." : "Começar Agora"}
        </button>
      </div>
    </div>
  );
}
