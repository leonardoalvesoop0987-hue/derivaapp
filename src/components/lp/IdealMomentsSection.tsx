"use client";

import { motion } from "framer-motion";
import { Moon, CalendarHeart, Plane, Wine, Coffee } from "lucide-react";

export function IdealMomentsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const moments = [
    { icon: <Wine size={24} />, text: "Depois de um jantar a dois em casa" },
    { icon: <Coffee size={24} />, text: "Num fim de semana sem pressa ou horários" },
    { icon: <Plane size={24} />, text: "Em uma viagem para criar novas memórias" },
    { icon: <CalendarHeart size={24} />, text: "Aniversário de namoro ou casamento" },
    { icon: <Moon size={24} />, text: "Quando quiserem testar limites com segurança" }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Quando usar o Deriva?</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            O Deriva não é para ser usado todo dia. Ele foi feito para noites específicas onde a intenção é elevar a conexão ao máximo de forma guiada e fluida. Funciona melhor quando vocês têm tempo, privacidade e vontade de explorar novos desejos juntos.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {moments.map((moment, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border px-6 py-4 rounded-full flex items-center gap-3 shadow-sm hover:border-copper/50 transition-colors"
            >
              <div className="text-copper/70">{moment.icon}</div>
              <span className="text-text-primary text-sm font-medium">{moment.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
