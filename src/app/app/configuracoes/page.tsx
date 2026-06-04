"use client";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
      <h2 className="text-xl font-light">Configurações</h2>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
        <h3 className="font-medium text-sm text-[var(--color-text-secondary)] uppercase tracking-wide">Conta</h3>
        <div className="space-y-2 text-sm">
          <p className="text-[var(--color-text-secondary)]">Sessões são salvas localmente e sincronizadas ao banco.</p>
        </div>
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
