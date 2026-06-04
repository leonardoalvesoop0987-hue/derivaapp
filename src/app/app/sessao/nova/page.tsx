"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaSessaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [mode, setMode] = useState("PADRAO");
  const [length, setLength] = useState("MEDIA");
  const [maxIntensity, setMaxIntensity] = useState("PICO");
  const [videosEnabled, setVideosEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-light mb-2">Nova Sessão</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">Configure a jornada antes de começar.</p>
      </div>

      <div className="space-y-6">
        {/* Modo */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-secondary)]">Modo</label>
          <div className="flex gap-2 bg-[var(--color-background-primary)] p-1 rounded-xl">
            {["PADRAO", "ESTREIA", "PERSONALIZADO"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${mode === m ? 'bg-[var(--color-wine)] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-secondary)]">Duração</label>
          <div className="flex gap-2 bg-[var(--color-background-primary)] p-1 rounded-xl">
            {["CURTA", "MEDIA", "COMPLETA"].map(l => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${length === l ? 'bg-[var(--color-wine)] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Intensidade */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
          <label className="block text-sm font-medium mb-3 text-[var(--color-text-secondary)]">Intensidade Máxima</label>
          <div className="flex gap-2 bg-[var(--color-background-primary)] p-1 rounded-xl">
            {["LEVE", "QUENTE", "INTENSO", "PICO"].map(i => (
              <button
                key={i}
                onClick={() => setMaxIntensity(i)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${maxIntensity === i ? 'bg-[var(--color-wine)] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Vídeos</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Exibir vídeos em cartas Roxas</div>
            </div>
            <button 
              onClick={() => setVideosEnabled(!videosEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${videosEnabled ? 'bg-[var(--color-copper)]' : 'bg-[var(--color-background-primary)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${videosEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Música</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Trilha sonora automática</div>
            </div>
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${musicEnabled ? 'bg-[var(--color-copper)]' : 'bg-[var(--color-background-primary)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-4 mt-4 bg-white text-black hover:bg-gray-100 transition-colors rounded-xl font-medium tracking-wide shadow-lg"
        >
          {loading ? "Criando..." : "Começar Agora"}
        </button>
      </div>
    </div>
  );
}
