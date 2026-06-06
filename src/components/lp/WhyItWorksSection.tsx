"use client";

import { motion } from "framer-motion";

export function WhyItWorksSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-secondary)] px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="text-center md:text-left mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">A Lógica por trás do Jogo</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Por que a <span className="italic">progressão</span> funciona?
            </h2>
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-md text-lg font-light leading-relaxed">
            O segredo não está em uma carta isolada. Está na ordem. O Deriva organiza a experiência para que vocês não pulem direto para o ápice.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { num: "01", title: "Criação do Clima", desc: "A ansiedade e a cobrança de \"ter que inventar algo novo\" desaparecem quando vocês começam devagar. O ritmo inicial reduz as defesas naturais." },
            { num: "02", title: "Construção do Desejo", desc: "Intercalamos momentos de tensão e alívio. Um toque intenso, seguido de um respiro e uma conversa. Isso aumenta a expectativa para a próxima etapa." },
            { num: "03", title: "Surpresa Segura", desc: "Nada extremo aparece do nada. A sequência foi pensada para casais que já têm boa intimidade, mas que querem reacender o olhar um para o outro sem choques." }
          ].map((b, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15 + 0.2, duration: 0.8, ease: "easeOut" } } }}
              className="relative group"
            >
              {/* Editorial Number */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-light text-[var(--color-background-primary)] drop-shadow-[0_2px_2px_rgba(255,255,255,0.05)] opacity-50 absolute -top-8 -left-4 md:-top-10 md:-left-6 pointer-events-none group-hover:text-[var(--color-wine)] transition-colors duration-500 z-0">
                {b.num}
              </div>
              
              <div className="relative z-10 pt-6">
                <div className="w-12 h-px bg-[var(--color-copper)]/50 mb-6 group-hover:w-full transition-all duration-700 ease-in-out" />
                <h3 className="text-2xl font-serif mb-4 text-white">{b.title}</h3>
                <p className="text-[var(--color-text-secondary)] font-light leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
