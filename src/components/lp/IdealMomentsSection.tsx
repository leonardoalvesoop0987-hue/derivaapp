"use client";

import { motion } from "framer-motion";
import { Moon, CalendarHeart, Plane, Wine, Coffee } from "lucide-react";

export function IdealMomentsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const moments = [
    { icon: <Wine size={20} strokeWidth={1.5} />, text: "Depois de um jantar a dois" },
    { icon: <Coffee size={20} strokeWidth={1.5} />, text: "Num fim de semana sem horários" },
    { icon: <Plane size={20} strokeWidth={1.5} />, text: "Em uma viagem ou hotel" },
    { icon: <CalendarHeart size={20} strokeWidth={1.5} />, text: "Aniversário de namoro ou casamento" },
    { icon: <Moon size={20} strokeWidth={1.5} />, text: "Quando quiserem sair da rotina" }
  ];

  return (
    <section className="py-24 lg:py-32 px-6 bg-[var(--color-background-secondary)]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16 lg:mb-20">
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">A Ocasião Perfeita</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">Quando usar o <span className="italic text-[var(--color-copper)]">Deriva?</span></h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            O Deriva não é para ser usado na pressa de uma terça-feira comum. Ele foi feito para noites específicas onde a intenção é elevar a conexão com tempo, privacidade e desejo.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {moments.map((moment, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] px-6 py-4 rounded-full flex items-center gap-4 hover:border-[var(--color-copper)]/40 hover:bg-[var(--color-card)] transition-all group"
            >
              <div className="text-[var(--color-copper)]/60 group-hover:text-[var(--color-copper)] transition-colors">{moment.icon}</div>
              <span className="text-white/90 text-sm font-light">{moment.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
