"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function RelationshipSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-24 lg:py-32 px-6 relative bg-[var(--color-background-primary)]">
      <div className="max-w-4xl mx-auto bg-[var(--color-background-secondary)] border border-[var(--color-copper)]/20 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl group transition-colors hover:border-[var(--color-copper)]/40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-copper)]/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[var(--color-copper)]/10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--color-wine)]/5 blur-[80px] rounded-full pointer-events-none" />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-background-primary)] border border-[var(--color-border)] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(184,115,51,0.1)]">
            <ShieldCheck className="text-[var(--color-copper)]" size={32} strokeWidth={1.5} />
          </div>
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-6 block">Para vocês dois</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white leading-tight">
            Para transformar <span className="italic text-[var(--color-copper)]">clima em jogo.</span>
          </h2>
          <div className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl mx-auto font-light space-y-3">
            <p className="flex items-center justify-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] opacity-70"></span> Começar devagar e deixar a tensão subir.</p>
            <p className="flex items-center justify-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] opacity-70"></span> Provocar sem precisar explicar tudo.</p>
            <p className="flex items-center justify-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] opacity-70"></span> Fazer o toque parecer mais esperado.</p>
            <p className="flex items-center justify-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] opacity-70"></span> Terminar a noite com gosto de &quot;quero mais&quot;.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
