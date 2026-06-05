"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

type UnlockGroup = {
  key: string;
  title: string;
  description: string;
  is_enabled: boolean;
};

export default function ConfiguracoesPage() {
  const [unlocks, setUnlocks] = useState<UnlockGroup[]>([]);
  const [loadingUnlocks, setLoadingUnlocks] = useState(true);

  useEffect(() => {
    fetch("/api/couple/unlocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocks) setUnlocks(data.unlocks);
      })
      .finally(() => setLoadingUnlocks(false));
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
    } else {
      alert("Erro ao atualizar a configuração.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
      <h2 className="text-xl font-light">Configurações</h2>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
        <h3 className="font-medium text-sm text-[var(--color-text-secondary)] uppercase tracking-wide">Conta</h3>
        <div className="space-y-4 text-sm">
          <p className="text-[var(--color-text-secondary)]">Sessões são salvas localmente e sincronizadas ao banco.</p>
          <div className="pt-2 border-t border-[var(--color-border)]">
            <Link 
              href="/app/alinhamento" 
              className="text-[var(--color-copper)] hover:text-white transition-colors block"
            >
              Responder formulário privado novamente
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
              Você pode responder novamente a qualquer momento. A nova resposta não apaga as anteriores; ela cria uma nova versão para acompanhamento administrativo.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
        <h3 className="font-medium text-sm text-[var(--color-text-secondary)] uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-500" />
          Conteúdos Avançados
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Decida se desejam incluir fantasias mais intensas na sessão de vocês. O desbloqueio deve ser um acordo mútuo do casal.
        </p>

        {loadingUnlocks ? (
          <div className="text-sm text-[var(--color-text-secondary)]">Carregando permissões...</div>
        ) : (
          <div className="space-y-4 pt-2">
            {unlocks.map((u) => (
              <div key={u.key} className="flex flex-col p-4 bg-[var(--color-background-secondary)] rounded-xl border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <div className="font-medium flex items-center gap-2">
                      {u.is_enabled ? <Unlock size={16} className="text-[var(--color-copper)]" /> : <Lock size={16} className="text-[var(--color-text-secondary)]" />}
                      {u.title}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {u.description}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleUnlock(u.key, u.is_enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      u.is_enabled ? "bg-[var(--color-copper)]" : "bg-[var(--color-background-secondary)] border border-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        u.is_enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {u.is_enabled && u.key === "DARK_THIRD_IMAGINATION" && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-sm space-y-3">
                    <p className="text-[var(--color-text-secondary)]">
                      Antes de usar esse conteúdo, recomendamos que os dois respondam o Alinhamento avançado.
                    </p>
                    <Link
                      href="/app/alinhamento"
                      className="inline-block text-[var(--color-copper)] hover:text-white transition-colors"
                    >
                      Responder alinhamento avançado →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
        <h3 className="font-medium text-sm text-[var(--color-text-secondary)] uppercase tracking-wide">Sobre</h3>
        <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          <p>Deriva é um guia de sessão para casais adultos.</p>
          <p>Versão 1.0 — MVP</p>
        </div>
      </div>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
        <h3 className="font-medium text-sm text-[var(--color-text-secondary)] uppercase tracking-wide">Consentimento</h3>
        <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Verde</strong> — continua</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Amarelo</strong> — diminui a intensidade</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Vermelho</strong> — para imediatamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
