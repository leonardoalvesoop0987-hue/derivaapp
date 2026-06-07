/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";

const fears = [
  { fear: "Achei que ia ficar constrangida", resolution: "Entendi que eu estava no controle" },
  { fear: "Parecia pesado demais para mim", resolution: "Meu corpo acordou no próprio ritmo" },
  { fear: "Não ia me deixar confortável", resolution: "Ficou claro que meu prazer importa" },
  { fear: "Meu corpo pode não responder", resolution: "Meu marido finalmente me via" },
];

export function FearIsNormalSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0a0605] to-[var(--color-background-secondary)] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#d4a373]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-white">
            O medo é <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">normal</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light">
            O que muitas mulheres relatam no começo. E o que muda depois.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {fears.map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-[#12080a] p-8 rounded-2xl border border-white/5 hover:border-[#d4a373]/20 transition-colors group">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm text-[#d4a373]/60 uppercase tracking-wider mb-2">Pensamento inicial</p>
                  <p className="text-zinc-300 font-light text-lg italic">"{item.fear}"</p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-[#d4a373] uppercase tracking-wider mb-2">Depois</p>
                  <p className="text-white font-light text-lg">{item.resolution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#d4a373]/10 to-transparent p-8 rounded-2xl border border-[#d4a373]/20">
            <p className="text-zinc-300 font-light text-xl">
              Não há um jeito 'certo' de responder. <br />
              <span className="text-[#d4a373] font-light italic">Sua única obrigação é consigo mesma.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
