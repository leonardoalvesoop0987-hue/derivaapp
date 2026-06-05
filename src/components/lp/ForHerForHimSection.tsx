"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ForHerForHimSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const lists = {
    ela: [
      "Sentir-se desejada no centro do clima",
      "Entrar no clima aos poucos",
      "Menos pressão e mais confiança",
      "Liberdade para se soltar no próprio ritmo",
    ],
    ele: [
      "Sair da obrigação de ter que improvisar",
      "Ter uma condução inteligente do momento",
      "Sentir mais provocação com a parceira entregue",
      "Participar de uma experiência mais intensa",
    ],
    casal: [
      "Quebrar a rotina com novidade segura",
      "Criar uma memória difícil de esquecer",
      "Melhorar a intimidade e a presença",
      "Fortalecer uma relação já firme",
    ]
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <span className="text-copper font-semibold tracking-wider text-sm uppercase mb-3 block">Equilíbrio Perfeito</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Para ela. Para ele. Para os dois.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            O Deriva foi pensado para colocar a mulher no centro do clima, sem esquecer o desejo e a satisfação do homem. Ela sente que a noite foi construída para o ritmo dela. Ele sente que não precisa improvisar no escuro. Os dois ganham.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ela */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-background-secondary rounded-3xl p-8 border border-copper/10"
          >
            <h3 className="text-2xl font-bold mb-6 text-text-primary border-b border-border pb-4">Para Ela</h3>
            <ul className="space-y-4">
              {lists.ela.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-copper shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Ele */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="bg-background-secondary rounded-3xl p-8 border border-copper/10"
          >
            <h3 className="text-2xl font-bold mb-6 text-text-primary border-b border-border pb-4">Para Ele</h3>
            <ul className="space-y-4">
              {lists.ele.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-copper shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Casal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl p-8 border border-copper/30 shadow-xl shadow-copper/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 blur-3xl rounded-full"></div>
            <h3 className="text-2xl font-bold mb-6 text-copper border-b border-border pb-4 relative z-10">Para o Casal</h3>
            <ul className="space-y-4 relative z-10">
              {lists.casal.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-red-deep shrink-0 mt-0.5" />
                  <span className="text-text-primary font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
