"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface OfferSectionProps {
  onBuyClick: () => void;
}

export function OfferSection({ onBuyClick }: OfferSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-background-secondary border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-deep/10 pointer-events-none" />
      
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary leading-tight">
          Sua próxima noite diferente <br className="hidden md:block" /> já está planejada.
        </h2>
        <p className="text-xl text-text-secondary mb-12">
          Comece pelo app agora mesmo. Receba a versão física em casa. Use quando quiser transformar uma noite comum em algo íntimo, guiado e difícil de esquecer.
        </p>
        
        <div className="bg-card border border-copper/30 p-8 md:p-12 rounded-3xl mb-8 relative overflow-hidden shadow-[0_0_80px_rgba(184,115,51,0.08)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-deep/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left">
              <span className="block text-copper mb-2 uppercase tracking-widest text-sm font-bold">Acesso Completo</span>
              <ul className="space-y-2 mb-6">
                <li className="text-text-primary font-medium">✨ Acesso imediato ao App Deriva</li>
                <li className="text-text-primary font-medium">📦 Versão física entregue em casa</li>
                <li className="text-text-primary font-medium">🔒 Embalagem 100% discreta</li>
              </ul>
            </div>
            
            <div className="text-center md:text-right md:border-l md:border-border/50 md:pl-8">
              <span className="text-5xl font-extrabold text-text-primary block mb-2 tracking-tight">R$ 19,90</span>
              <span className="text-sm text-text-secondary block mb-6">Pagamento único e vitalício</span>
              <button 
                onClick={onBuyClick}
                className="w-full md:w-auto bg-red-deep hover:bg-wine text-text-primary font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-deep/20 flex items-center justify-center gap-2"
              >
                Quero começar com o Deriva <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
