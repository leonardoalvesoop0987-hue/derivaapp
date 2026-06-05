"use client";

import { motion } from "framer-motion";
import { Smartphone, Package, ChevronRight } from "lucide-react";

interface AppAndPhysicalSectionProps {
  onBuyClick: () => void;
}

export function AppAndPhysicalSection({ onBuyClick }: AppAndPhysicalSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-background-secondary px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">A versão física é linda. O app é mais inteligente.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Juntos, eles deixam a experiência mais completa. Você não precisa esperar os correios: pode começar pelo app antes mesmo da versão física chegar em casa.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* O App */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-background-primary p-8 md:p-10 rounded-3xl border border-border flex flex-col h-full"
          >
            <div className="w-16 h-16 rounded-2xl bg-card border border-copper/20 flex items-center justify-center mb-6">
              <Smartphone className="text-copper" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">A inteligência do App</h3>
            <p className="text-text-secondary mb-8">
              O aplicativo tira toda a pressão de decidir &quot;o que fazer agora&quot;. Ele não apenas sorteia cartas, ele cria uma jornada.
            </p>
            <ul className="space-y-3 mt-auto">
              {[
                "Sorteio automático e progressão planejada",
                "Evita repetição de experiências",
                "Permite adicionar música ambiente",
                "Exibe mídia visual quando cabível",
                "Controle total dos níveis e da sessão em andamento"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* O Físico */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-card p-8 md:p-10 rounded-3xl border border-copper/20 flex flex-col h-full shadow-xl shadow-copper/5 relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-deep/10 blur-3xl rounded-full"></div>
            <div className="w-16 h-16 rounded-2xl bg-background-primary border border-copper/10 flex items-center justify-center mb-6 relative z-10">
              <Package className="text-red-deep" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">O charme da Versão Física</h3>
            <p className="text-text-secondary mb-8 relative z-10">
              Receber em casa um produto premium traz o aspecto tátil e luxuoso que nenhuma tela consegue substituir.
            </p>
            <ul className="space-y-3 mt-auto relative z-10">
              {[
                "Uma experiência tátil e luxuosa",
                "Ideal para usar longe das telas",
                "Perfeito para presentear a pessoa amada",
                "Fácil de levar em viagens",
                "Recebido com total discrição em sua casa"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-deep/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={onBuyClick}
            className="bg-transparent border border-copper hover:bg-copper/10 text-copper font-medium px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            Garantir os dois por R$ 19,90 <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
