"use client";

import { motion } from "framer-motion";
import { Music, PlayCircle } from "lucide-react";

export function MediaAndMusicSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-primary)] px-6 border-y border-[var(--color-border)] overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[var(--color-wine)]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="flex justify-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-copper)] shadow-[0_0_30px_rgba(184,115,51,0.1)]">
              <Music size={24} strokeWidth={1.5} />
            </div>
            <div className="w-16 h-16 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-red-deep)] shadow-[0_0_30px_rgba(162,26,43,0.1)]">
              <PlayCircle size={24} strokeWidth={1.5} />
            </div>
          </div>
          
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">Imersão Sensorial</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">
            Música, clima e mídia
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            O ambiente dita o tom. O app sincroniza uma trilha sonora ambiente que evolui com o jogo. Algumas cartas especiais ativam curtos vídeos estéticos para instigar o imaginário visual.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-white/80 text-sm font-light border border-[var(--color-copper)]/20 bg-[var(--color-copper)]/5 py-3 px-6 rounded-full max-w-lg mx-auto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-copper)]"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
            Nada é obrigatório. Vocês habilitam o que preferirem.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
