"use client";

import { motion } from "framer-motion";
import { Shuffle, ArrowRight } from "lucide-react";

export function SmartRandomSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-background-secondary px-6 border-y border-border/50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="shrink-0 relative"
        >
          <div className="w-32 h-32 bg-background-primary rounded-full border border-copper/30 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(184,115,51,0.15)]">
            <Shuffle size={48} className="text-copper" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 bg-copper/20 blur-2xl rounded-full"></div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo é sorteado, mas não de qualquer jeito</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            O Deriva usa algoritmos de progressão e sorteios com regras para manter a surpresa sem perder a direção. A experiência muda a cada sessão, mas nunca fica bagunçada.
          </p>
          <ul className="space-y-3">
            {[
              "Sequência guiada para intensidade crescente",
              "Respiros estratégicos para evitar exaustão",
              "Reduz a insegurança e indecisão do casal",
              "Sem depender de escolher tudo manualmente"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-text-primary text-sm font-medium justify-center md:justify-start">
                <ArrowRight size={16} className="text-copper/70" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
