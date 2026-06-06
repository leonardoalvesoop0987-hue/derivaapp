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
            <span className="text-[#d4a373] text-sm uppercase tracking-[0.2em] font-light mb-4 block">O tempo a seu favor</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
              Sinta antes de <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">decidir</span>
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-lg font-light leading-relaxed">
            Esqueça a obrigação de estar pronta na hora. O corpo precisa de tempo. O Deriva abre espaço para o clima acontecer de forma natural.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { num: "01", title: "O clima começa antes", desc: "Nada entra pesado de primeira. A sequência abre espaço para olhar, toque e presença antes da intensidade." },
            { num: "02", title: "A surpresa ajuda", desc: "A próxima carta tira vocês do automático. Não é improviso solto. É provocação com direção." },
            { num: "03", title: "Vocês seguem no controle", desc: "Dá para pular, diminuir ou parar. O jogo esquenta, mas o limite continua sendo dos dois." }
          ].map((b, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15 + 0.2, duration: 0.8, ease: "easeOut" } } }}
              className="relative group"
            >
              {/* Editorial Number */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-[var(--font-cormorant)] italic font-light text-[var(--color-background-primary)] drop-shadow-[0_2px_2px_rgba(255,255,255,0.02)] opacity-80 absolute -top-8 -left-4 md:-top-10 md:-left-6 pointer-events-none group-hover:text-[#2a1510] transition-colors duration-500 z-0">
                {b.num}
              </div>
              
              <div className="relative z-10 pt-6">
                <div className="w-12 h-px bg-[#d4a373]/30 mb-6 group-hover:w-full transition-all duration-700 ease-in-out" />
                <h3 className="text-2xl font-[var(--font-cormorant)] italic mb-4 text-white">{b.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
