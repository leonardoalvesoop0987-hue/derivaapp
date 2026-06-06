"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function DeckStructureSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const categories = [
    { color: "from-blue-600/30 to-transparent border-blue-500/20 text-blue-100", name: "Azul", desc: "Início e preparo" },
    { color: "from-pink-600/30 to-transparent border-pink-500/20 text-pink-100", name: "Rosa", desc: "Prazer e atenção nela" },
    { color: "from-red-600/30 to-transparent border-red-500/20 text-red-100", name: "Vermelho", desc: "Intensidade e calor" },
    { color: "from-[var(--color-copper)]/30 to-transparent border-[var(--color-copper)]/20 text-[var(--color-copper)]", name: "Deriva", desc: "Respiros e transições" },
    { color: "from-purple-600/30 to-transparent border-purple-500/20 text-purple-100", name: "Roxo", desc: "Tela e provocação áudio/vídeo" },
    { color: "from-zinc-700/50 to-transparent border-zinc-600/30 text-zinc-200", name: "Preto", desc: "Fantasia e mente" }
  ];

  const levels = [
    { name: "Leve", flames: 1, desc: "Toques suaves, conversas e aquecimento." },
    { name: "Quente", flames: 2, desc: "A temperatura sobe. Provocações diretas." },
    { name: "Intenso", flames: 3, desc: "Ação prolongada, foco no prazer físico." },
    { name: "Pico", flames: 4, desc: "O ápice do desejo e entrega." }
  ];

  return (
    <section className="py-32 px-6 relative bg-[var(--color-background-secondary)]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-24">
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">A Dinâmica</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Cartas que guiam a noite</h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Nenhuma noite é aleatória. As cartas se dividem em categorias e níveis de intensidade para criar uma coreografia perfeita entre o sutil e o intenso.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Categorias */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="text-2xl font-serif mb-8 text-white flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-copper)]/50 inline-block" />
              As Categorias
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className={`p-6 rounded-2xl border bg-gradient-to-br ${cat.color} backdrop-blur-sm transition-transform hover:-translate-y-1 duration-300`}>
                  <h4 className="font-serif text-xl mb-2">{cat.name}</h4>
                  <p className="text-sm opacity-80 font-light">{cat.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Aviso Tons mais Escuros */}
            <div className="mt-6 p-5 rounded-2xl border border-zinc-800 bg-black/40 flex items-start gap-4">
              <div className="mt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h4 className="text-zinc-300 font-medium text-sm mb-1">Conteúdos avançados bloqueados</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Cartas envolvendo imaginação com terceiros, fantasias mais ousadas ou fetiches específicos ficam na categoria &quot;Tons mais escuros&quot;, desativada por padrão. Vocês só habilitam se e quando quiserem.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Níveis */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h3 className="text-2xl font-serif mb-8 text-white flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-copper)]/50 inline-block" />
              A Intensidade
            </h3>
            <div className="space-y-4">
              {levels.map((lvl, i) => (
                <div key={i} className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-[var(--color-card)]/30 border border-[var(--color-border)] hover:bg-[var(--color-card)]/50 transition-colors">
                  <div className="flex-shrink-0 w-24">
                    <h4 className="font-serif text-xl text-white group-hover:text-[var(--color-copper)] transition-colors">{lvl.name}</h4>
                  </div>
                  <div className="flex gap-1.5 mb-2 sm:mb-0">
                    {[...Array(4)].map((_, j) => (
                      <Flame 
                        key={j} 
                        size={18} 
                        className={`transition-all duration-300 ${j < lvl.flames ? "text-[var(--color-red-deep)] fill-[var(--color-red-deep)]/40 drop-shadow-[0_0_8px_rgba(162,26,43,0.5)]" : "text-[var(--color-border)] stroke-1"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] font-light sm:ml-auto">
                    {lvl.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
