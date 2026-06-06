"use client";

import { motion } from "framer-motion";

export function DeckStructureSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const categories = [
    { color: "from-[#1a2a6c] to-[#0d0820] border-blue-500/10 text-blue-100", name: "Azul", desc: "Início e preparo", example: "Começa onde o corpo ainda está aprendendo a relaxar." },
    { color: "from-[#4a102b] to-[#160710] border-pink-500/10 text-pink-100", name: "Rosa", desc: "Prazer e atenção nela", example: "A atenção vai para ela, mas o efeito volta para os dois." },
    { color: "from-[#4a1118] to-[#140607] border-red-500/10 text-red-100", name: "Vermelho", desc: "Intensidade e calor", example: "Quando o clima já não precisa ser explicado." },
    { color: "from-[#3a2416] to-[#0d0806] border-[#d4a373]/10 text-[#d4a373]", name: "Deriva", desc: "Respiros e transições", example: "Respira, aproxima, reorganiza o desejo." },
    { color: "from-[#32124a] to-[#100719] border-purple-500/10 text-purple-100", name: "Roxo", desc: "Tela e provocação áudio/vídeo", example: "Um estímulo, uma pausa, uma provocação." },
    { color: "from-[#1a1410] to-[#050505] border-zinc-700/30 text-zinc-300", name: "Preto", desc: "Fantasia e mente", example: "Personagem, cena e imaginação entre vocês dois." }
  ];

  const levels = [
    { name: "Leve", blocks: 1, desc: "Toques suaves, conversas e aquecimento." },
    { name: "Quente", blocks: 2, desc: "A temperatura sobe. Provocações diretas." },
    { name: "Intenso", blocks: 3, desc: "Ação prolongada, foco no prazer físico." },
    { name: "Pico", blocks: 4, desc: "O ápice do desejo e entrega." }
  ];

  return (
    <section className="py-32 px-6 relative bg-[var(--color-background-primary)]">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-white tracking-wide">
            A cor de cada <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">sensação</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            As cartas se dividem em grupos para que o ritmo obedeça ao que vocês sentem, e não ao acaso.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Categorias */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="text-2xl font-[var(--font-cormorant)] italic mb-8 text-white flex items-center gap-3">
              <span className="w-8 h-px bg-[#d4a373]/50 inline-block" />
              Os Grupos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className={`p-6 rounded-2xl border bg-gradient-to-br ${cat.color} backdrop-blur-sm transition-transform hover:-translate-y-1 duration-300 shadow-2xl`}>
                  <h4 className="font-light text-xl mb-1">{cat.name}</h4>
                  <p className="text-xs opacity-60 font-light mb-4 tracking-widest uppercase">{cat.desc}</p>
                  <p className="text-sm font-[var(--font-cormorant)] italic opacity-90 leading-relaxed">"{cat.example}"</p>
                </div>
              ))}
            </div>
            
            {/* Aviso Tons mais Escuros */}
            <div className="mt-6 p-5 rounded-2xl border border-zinc-800/50 bg-[#0a0605] flex items-start gap-4">
              <div>
                <h4 className="text-zinc-400 font-[var(--font-cormorant)] italic text-lg mb-1">Tons mais escuros</h4>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  "Só aparece quando o casal decide abrir essa porta." Conteúdos que envolvem imaginação com terceiros e fantasias mais ousadas ficam ocultos e só podem ser habilitados manualmente.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Níveis */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h3 className="text-2xl font-[var(--font-cormorant)] italic mb-8 text-white flex items-center gap-3">
              <span className="w-8 h-px bg-[#d4a373]/50 inline-block" />
              A Intensidade
            </h3>
            <div className="space-y-4">
              {levels.map((lvl, i) => (
                <div key={i} className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-[#0a0605] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex-shrink-0 w-24">
                    <h4 className="font-light tracking-wide text-lg text-white group-hover:text-[#d4a373] transition-colors">{lvl.name}</h4>
                  </div>
                  <div className="flex gap-1.5 mb-2 sm:mb-0">
                    {[...Array(4)].map((_, j) => (
                      <div 
                        key={j} 
                        className={`w-4 h-1.5 rounded-full transition-all duration-300 ${j < lvl.blocks ? "bg-[#d4a373] shadow-[0_0_8px_rgba(212,163,115,0.4)]" : "bg-white/10"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 font-light sm:ml-auto">
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
