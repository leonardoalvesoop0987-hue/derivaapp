"use client";

import { motion } from "framer-motion";

export function ForHerForHimSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const lists = {
    ela: [
      "Sentir-se desejada sem a pressão inicial",
      "Entrar no clima no seu próprio ritmo",
      "Mais segurança para tentar algo diferente",
      "Liberdade para apenas se soltar e receber",
    ],
    ele: [
      "Sair da obrigação de ter que guiar tudo",
      "Desfrutar de uma condução inteligente do momento",
      "Ver a parceira entregue e confortável",
      "Participar de uma experiência mais longa e intensa",
    ],
    casal: [
      "Redescobrir o desejo um pelo outro",
      "Sair da rotina do mesmo lugar e mesma hora",
      "Aumentar a conexão e o olho no olho",
      "Trazer de volta a sensação do 'começo'",
    ]
  };

  return (
    <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-[var(--color-background-primary)]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20 lg:mb-24">
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">O Equilíbrio Perfeito</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">
            Para ela. Para ele. <span className="italic text-[var(--color-copper)]">Para os dois.</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            O Deriva foi desenhado com atenção especial à experiência dela — e isso muda o jogo para ele. Ela sente que o ritmo a respeita. Ele sai do peso de ter que inventar tudo sozinho.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {/* Ela */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[var(--color-background-secondary)] rounded-2xl p-8 lg:p-10 border border-[var(--color-border)]/50 relative overflow-hidden group hover:border-[var(--color-copper)]/30 transition-colors"
          >
            <div className="w-10 h-px bg-[var(--color-copper)]/30 mb-6 group-hover:w-full transition-all duration-700 ease-in-out" />
            <h3 className="text-2xl font-serif mb-8 text-white">Para a Mulher</h3>
            <ul className="space-y-5">
              {lists.ela.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)]/60 mt-2 shrink-0" />
                  <span className="text-[var(--color-text-secondary)] font-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Ele */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="bg-[var(--color-background-secondary)] rounded-2xl p-8 lg:p-10 border border-[var(--color-border)]/50 relative overflow-hidden group hover:border-[var(--color-copper)]/30 transition-colors"
          >
            <div className="w-10 h-px bg-[var(--color-copper)]/30 mb-6 group-hover:w-full transition-all duration-700 ease-in-out" />
            <h3 className="text-2xl font-serif mb-8 text-white">Para o Homem</h3>
            <ul className="space-y-5">
              {lists.ele.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)]/60 mt-2 shrink-0" />
                  <span className="text-[var(--color-text-secondary)] font-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Casal */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="bg-[var(--color-card)]/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-[var(--color-copper)]/30 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-copper)]/10 blur-3xl rounded-full" />
            <div className="w-10 h-px bg-[var(--color-copper)] mb-6 group-hover:w-full transition-all duration-700 ease-in-out relative z-10" />
            <h3 className="text-2xl font-serif mb-8 text-[var(--color-copper)] relative z-10">Para a Relação</h3>
            <ul className="space-y-5 relative z-10">
              {lists.casal.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] mt-2 shrink-0 shadow-[0_0_8px_rgba(184,115,51,0.6)]" />
                  <span className="text-white font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
