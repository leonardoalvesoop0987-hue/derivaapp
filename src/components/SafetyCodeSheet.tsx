"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onAbort: () => void;
}

export default function SafetyCodeSheet({ onClose, onAbort }: Props) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="text-[var(--color-text-secondary)] hover:text-white text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] transition-colors"
        aria-label="Códigos de segurança"
      >
        Códigos
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShow(false)}>
          <div
            className="w-full max-w-md bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] rounded-t-3xl p-6 pb-10 space-y-4 animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-center mb-6">Códigos de Segurança</h3>

            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6 px-4">
              O combinado existe pra proteger o clima de vocês. Não precisa explicar na hora, só usar as cores.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-green-900/20 border border-green-700/30">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <div>
                  <div className="font-medium text-green-400 mb-1">Verde — Quero mais</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Tá gostoso, pode continuar.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-700/30">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                <div>
                  <div className="font-medium text-yellow-400 mb-1">Amarelo — Com calma</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Diminui o ritmo, vamos mudar de foco.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <div>
                  <div className="font-medium text-red-400 mb-1">Vermelho — Para agora</div>
                  <div className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Para tudo imediatamente. Sem questionar.
                  </div>
                  <button
                    onClick={() => { setShow(false); onAbort(); }}
                    className="w-full py-3 bg-red-700/80 hover:bg-red-600 rounded-xl text-sm font-medium transition-colors text-white"
                  >
                    Encerrar a sessão
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setShow(false); onClose(); }}
              className="w-full py-3 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
