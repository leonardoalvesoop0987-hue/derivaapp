"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function DeckStructureSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const categories = [
    { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", name: "Azul", desc: "Início e preparo" },
    { color: "bg-copper/20 text-copper border-copper/30", name: "Deriva", desc: "Respiros e transições" },
    { color: "bg-pink-500/20 text-pink-400 border-pink-500/30", name: "Rosa", desc: "Prazer e atenção nela" },
    { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", name: "Roxo", desc: "Estímulos com tela e provocação" },
    { color: "bg-red-500/20 text-red-400 border-red-500/30", name: "Vermelho", desc: "Intensidade" },
    { color: "bg-zinc-800/80 text-zinc-300 border-zinc-700", name: "Preto", desc: "Fantasia e mente" }
  ];

  const levels = [
    { name: "Leve", flames: 1 },
    { name: "Quente", flames: 2 },
    { name: "Intenso", flames: 3 },
    { name: "Pico", flames: 4 }
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Tipos de cartas e níveis</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Cada carta pertence a uma categoria e a um nível de intensidade. Isso evita que a noite pareça aleatória demais ou intensa cedo demais. O sistema combina surpresa com progressão lógica.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Categorias */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-bold mb-8 text-text-primary">As Categorias</h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${cat.color} backdrop-blur-sm bg-opacity-10 flex flex-col justify-center`}>
                  <span className="font-bold text-lg mb-1">{cat.name}</span>
                  <span className="text-sm opacity-90">{cat.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Níveis */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-bold mb-8 text-text-primary">Os Níveis</h3>
            <div className="space-y-6">
              {levels.map((lvl, i) => (
                <div key={i} className="flex items-center gap-6 p-5 rounded-2xl bg-background-secondary border border-border">
                  <div className="w-24 font-bold text-lg text-text-primary">{lvl.name}</div>
                  <div className="flex-1 h-2 bg-background-primary rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-copper to-red-deep rounded-full" 
                      style={{ width: `${(lvl.flames / 4) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, j) => (
                      <Flame 
                        key={j} 
                        size={20} 
                        className={j < lvl.flames ? "text-red-deep fill-red-deep/20" : "text-border"} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
