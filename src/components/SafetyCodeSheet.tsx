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

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-green-900/20 border border-green-700/30">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-400 mb-1">Verde — Continua</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Tudo bem, pode prosseguir.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-700/30">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-yellow-400 mb-1">Amarelo — Diminui</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Reduzir a intensidade. Ir com mais calma.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-400 mb-1">Vermelho — Para imediatamente</div>
                  <div className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Parar tudo. Sem questionamentos.
                  </div>
                  <button
                    onClick={() => { setShow(false); onAbort(); }}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-xl text-sm transition-colors"
                  >
                    Encerrar sessão agora
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
