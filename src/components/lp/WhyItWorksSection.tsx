"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Maximize2 } from "lucide-react";

export function WhyItWorksSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-background-secondary px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que isso funciona?</h2>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            O segredo não está em uma carta isolada. Está na ordem. O Deriva organiza a experiência para que o casal não pule direto para o ápice: primeiro vem o clima, depois a provocação, depois a intensidade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Sparkles className="text-copper" size={28} />, title: "Criação do Clima", desc: "Começamos devagar. Reduzimos a pressão de 'inventar algo novo' guiando vocês com leveza." },
            { icon: <ArrowUpRight className="text-copper" size={28} />, title: "Construção do Desejo", desc: "Intercalamos momentos de respiro e provocação, aumentando a expectativa de forma natural." },
            { icon: <Maximize2 className="text-copper" size={28} />, title: "Surpresa sem Pressão", desc: "Tudo foi pensado para casais que já têm intimidade, mas que querem explorar novas camadas da relação com segurança." }
          ].map((b, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.2 } } }}
              className="bg-card p-8 rounded-2xl border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-background-primary flex items-center justify-center mb-6 shadow-inner shadow-copper/5">
                {b.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{b.title}</h3>
              <p className="text-text-secondary leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
