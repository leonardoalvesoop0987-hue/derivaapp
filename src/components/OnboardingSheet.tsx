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
            <div className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-[#0d0a08] opacity-80 pointer-events-none" />
              <div className="w-16 h-16 bg-[#B9825A]/10 rounded-full flex items-center justify-center mb-6 mx-auto relative z-10">
                <Info className="w-8 h-8 text-[#B9825A]" />
              </div>
              
              <h2 className="text-2xl font-serif text-[#d4a373] italic mb-6 text-center relative z-10">Regras do jogo</h2>
              
              <div className="space-y-5 mb-8 relative z-10">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <SkipForward className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    A noite é de vocês. Pulem o que não fizer sentido e sigam o ritmo que der vontade.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-[#d4a373]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    O farol protege a tensão: <span className="text-green-400 font-medium">Verde</span> continua, <span className="text-yellow-400 font-medium">amarelo</span> diminui, <span className="text-[var(--color-red-deep)] font-medium">vermelho</span> corta a carta.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Aproveitem. A primeira carta já começa a mudar o clima.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    Ocasionalmente, o app usa curtos vídeos sensuais como estímulo visual. Usem como inspiração ou pulem.
                  </p>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="w-full bg-gradient-to-r from-[#B9825A] to-[#8C5D3D] hover:brightness-110 text-white font-medium py-4 rounded-xl transition-all shadow-xl shadow-[#B9825A]/20 relative z-10"
              >
                Entrar no clima
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
