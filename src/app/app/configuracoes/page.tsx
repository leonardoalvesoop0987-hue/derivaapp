"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

type UnlockGroup = {
  key: string;
  title: string;
  description: string;
  is_enabled: boolean;
};

interface ParticipantStatus {
  has_responded: boolean;
  last_version: number;
}

interface Participant {
  id: string;
  name: string;
  role: "WOMAN" | "MAN";
  standard: ParticipantStatus;
  dark: ParticipantStatus;
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [unlocks, setUnlocks] = useState<UnlockGroup[]>([]);
  const [loadingUnlocks, setLoadingUnlocks] = useState(true);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDarkUnlocked, setIsDarkUnlocked] = useState(false);
  const [loadingAlignment, setLoadingAlignment] = useState(true);

  useEffect(() => {
    fetch("/api/couple/unlocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocks) setUnlocks(data.unlocks);
      })
      .finally(() => setLoadingUnlocks(false));

    fetch("/api/alignment/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.participants) setParticipants(data.participants);
        setIsDarkUnlocked(!!data.is_dark_unlocked);
      })
      .finally(() => setLoadingAlignment(false));
  }, []);

  const toggleUnlock = async (groupKey: string, currentEnabled: boolean) => {
    if (!currentEnabled) {
      const confirm = window.confirm(
        "Atenção: O grupo Tons Mais Escuros contém conteúdos intensos como ciúme consentido e fantasias com terceiros invisíveis.\n\nAmbos do casal concordam em desbloquear esse conteúdo para o sorteio das cartas?\n\nIsso permite que cartas desse grupo apareçam na sessão."
      );
      if (!confirm) return;
    }

    const action = currentEnabled ? "disable" : "enable";
    const res = await fetch(`/api/couple/unlocks/${groupKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      setUnlocks((prev) =>
        prev.map((u) => (u.key === groupKey ? { ...u, is_enabled: !currentEnabled } : u))
      );
      // If toggling DARK_THIRD_IMAGINATION, update the alignment state as well
      if (groupKey === "DARK_THIRD_IMAGINATION") {
        setIsDarkUnlocked(!currentEnabled);
      }
    } else {
      alert("Erro ao atualizar a configuração.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto pb-12 pt-6 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-[#d4a373] italic mb-2">Configurações</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-light">Ajustes e limites da experiência.</p>
      </div>

      {/* Alinhamento Privado */}
      <div className="bg-[#130c0a] p-6 rounded-2xl border border-white/5 space-y-6">
        <div>
          <h3 className="font-medium text-xs text-[#d4a373] uppercase tracking-widest mb-2">Alinhamento privado</h3>
          <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed mb-4">
            Respondam quando quiserem ajustar melhor limites, preferências e interesses. As respostas são individuais e não ficam visíveis para o parceiro ou parceira.
          </p>
        </div>

        {loadingAlignment ? (
          <div className="text-sm text-[var(--color-text-secondary)] animate-pulse">Carregando formulários...</div>
        ) : (
          <div className="space-y-4">
            {participants.map(p => {
              const label = p.role === "WOMAN" ? "Responder alinhamento dela" : "Responder alinhamento dele";
              return (
                <button
                  key={p.id + '-std'}
                  onClick={() => router.push(`/app/alinhamento/${p.id}?type=standard`)}
                  className="w-full flex items-center justify-between p-4 bg-[#0d0806] border border-white/10 hover:border-[#d4a373]/50 transition-colors rounded-xl text-left"
                >
                  <div>
                    <div className="font-medium text-white text-sm tracking-wide">{p.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {p.standard?.has_responded ? "Respondido" : label}
                    </div>
                  </div>
                  <div>
                    {p.standard?.has_responded ? (
                      <span className="text-xs bg-[#B9825A]/20 text-[#d4a373] px-3 py-1.5 rounded-full border border-[#B9825A]/30">
                        Responder novamente
                      </span>
                    ) : (
                      <span className="text-xs border border-white/20 text-white/50 px-3 py-1.5 rounded-full">
                        Pendente
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Conteúdos Avançados */}
      <div className="bg-gradient-to-br from-[#2a0a0f]/30 to-transparent p-6 rounded-2xl border border-[#d4a373]/20 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A21A2B]/10 blur-[40px] mix-blend-screen pointer-events-none" />
        
        <h3 className="font-medium text-xs text-[#d4a373] uppercase tracking-widest flex items-center gap-2 relative z-10">
          <AlertTriangle size={14} className="text-[#d4a373]" />
          Conteúdos Avançados
        </h3>
        <p className="text-sm text-white/70 font-light leading-relaxed relative z-10">
          Acessem fantasias mais intensas. O desbloqueio deve ser um acordo mútuo antes da sessão começar.
        </p>

        {loadingUnlocks ? (
          <div className="text-sm text-[var(--color-text-secondary)] animate-pulse relative z-10">Carregando permissões...</div>
        ) : (
          <div className="space-y-4 pt-2 relative z-10">
            {unlocks.map((u) => (
              <div key={u.key} className="flex flex-col p-5 bg-[#0d0806]/80 backdrop-blur-sm rounded-xl border border-white/10 transition-colors hover:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <div className="font-medium text-white flex items-center gap-2 mb-1 tracking-wide">
                      {u.is_enabled ? <Unlock size={14} className="text-[#d4a373]" /> : <Lock size={14} className="text-white/40" />}
                      {u.title}
                    </div>
                    <div className="text-xs text-white/60 font-light leading-relaxed">
                      {u.description}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleUnlock(u.key, u.is_enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 border ${
                      u.is_enabled ? "bg-[#B9825A] border-transparent" : "bg-[#0d0806] border-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        u.is_enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alinhamento Avançado (Dark Deck) */}
      <div className="bg-[#130c0a] p-6 rounded-2xl border border-white/5 space-y-4">
        <div>
          <h3 className="font-medium text-xs text-[#d4a373] uppercase tracking-widest mb-1">
            Alinhamento avançado — Tons mais escuros
          </h3>
          {!isDarkUnlocked ? (
            <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
              Disponível após liberar esse conteúdo nas configurações.
            </p>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
              Esse alinhamento trata apenas de fantasia, imaginação e limites mais avançados. Responder é opcional.
            </p>
          )}
        </div>

        {isDarkUnlocked && !loadingAlignment && (
          <div className="space-y-4 mt-4">
            {participants.map(p => {
              const label = p.role === "WOMAN" ? "Responder alinhamento dela" : "Responder alinhamento dele";
              return (
                <button
                  key={p.id + '-dark'}
                  onClick={() => router.push(`/app/alinhamento/${p.id}?type=dark`)}
                  className="w-full flex items-center justify-between p-4 bg-[#0d0806] border border-white/10 hover:border-[#d4a373]/50 transition-colors rounded-xl text-left"
                >
                  <div>
                    <div className="font-medium text-white text-sm tracking-wide">{p.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {p.dark?.has_responded ? "Respondido" : label}
                    </div>
                  </div>
                  <div>
                    {p.dark?.has_responded ? (
                      <span className="text-xs bg-[#B9825A]/20 text-[#d4a373] px-3 py-1.5 rounded-full border border-[#B9825A]/30">
                        Responder novamente
                      </span>
                    ) : (
                      <span className="text-xs border border-white/20 text-white/50 px-3 py-1.5 rounded-full">
                        Pendente
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Consentimento */}
      <div className="bg-[#130c0a] p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="font-medium text-xs text-white/50 uppercase tracking-widest">O Acordo</h3>
        <div className="space-y-4 text-sm text-[var(--color-text-secondary)] font-light">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span><strong className="text-white font-medium">Verde</strong> — continuem no fluxo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <span><strong className="text-white font-medium">Amarelo</strong> — reduzam o ritmo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span><strong className="text-white font-medium">Vermelho</strong> — parem imediatamente</span>
          </div>
        </div>
      </div>

      {/* Sobre */}
      <div className="px-4 text-center space-y-1 pt-4 pb-8">
        <div className="text-xs text-white/30 tracking-widest uppercase font-medium">Deriva</div>
        <div className="text-[10px] text-white/20 font-light">Para casais adultos. Versão 1.0</div>
      </div>
    </div>
  );
}
