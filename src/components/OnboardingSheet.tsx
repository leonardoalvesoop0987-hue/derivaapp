"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, ShieldAlert, SkipForward } from "lucide-react";

interface OnboardingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function OnboardingSheet({ isOpen, onClose, onStart }: OnboardingSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-[var(--color-copper)]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Info className="w-8 h-8 text-[var(--color-copper)]" />
              </div>
              
              <h2 className="text-2xl font-serif text-white mb-6 text-center">Antes de começar</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <SkipForward className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Vocês podem pular qualquer carta que não fizer sentido no momento.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Use o farol: <span className="text-green-400 font-medium">Verde</span> continua, <span className="text-yellow-400 font-medium">amarelo</span> diminui o ritmo, <span className="text-[var(--color-red-deep)] font-medium">vermelho</span> para.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Nada precisa ser explicado. A experiência começa leve e esquenta aos poucos.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Algumas cartas podem usar vídeo adulto como estímulo visual. Se não fizer sentido no momento, vocês podem pular sem problema.
                  </p>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="w-full bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-red-deep)] hover:brightness-110 text-white font-medium py-4 rounded-xl transition-all shadow-lg"
              >
                Tudo pronto
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
