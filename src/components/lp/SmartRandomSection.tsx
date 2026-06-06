"use client";

import { motion } from "framer-motion";
import { Shuffle, ArrowRight } from "lucide-react";

export function SmartRandomSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-32 bg-[var(--color-background-primary)] px-6 border-y border-[var(--color-border)] relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--color-copper)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }} 
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="shrink-0 relative"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 bg-[var(--color-card)] rounded-full border border-[var(--color-copper)]/30 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(184,115,51,0.15)]">
            <Shuffle size={56} className="text-[var(--color-copper)]" strokeWidth={1.2} />
          </div>
          <div className="absolute inset-0 bg-[var(--color-copper)]/20 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center md:text-left flex-1">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 text-white leading-tight">
            Tudo é sorteado, mas não de <span className="italic text-[var(--color-copper)]">qualquer jeito</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-10 font-light max-w-2xl">
            O Deriva usa algoritmos de progressão para manter a surpresa sem perder a condução lógica. A experiência muda a cada sessão, mas nunca fica desconfortável ou fora de ritmo.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4">
            {[
              "Sequência guiada para aquecimento crescente",
              "Respiros estratégicos para prolongar a noite",
              "Reduz a ansiedade de ter que liderar tudo",
              "Evita o salto brusco para cartas intensas"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/90 text-sm font-light">
                <ArrowRight size={18} className="text-[var(--color-copper)] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
