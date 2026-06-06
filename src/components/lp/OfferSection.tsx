"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface OfferSectionProps {
  onBuyClick: () => void;
  isLoading?: boolean;
}

export function OfferSection({ onBuyClick, isLoading = false }: OfferSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-32 lg:py-40 px-6 relative overflow-hidden bg-[var(--color-background-primary)]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-wine)]/5 to-[var(--color-background-secondary)] pointer-events-none" />
      
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-8">
          Sua próxima noite diferente <br className="hidden md:block" /> já está <span className="italic text-[var(--color-copper)]">garantida.</span>
        </h2>
        <p className="text-xl text-[var(--color-text-secondary)] mb-16 font-light max-w-2xl mx-auto leading-relaxed">
          Comece pelo app agora mesmo. Receba a versão física em casa. Use quando quiser transformar uma noite comum em algo íntimo, seguro e difícil de esquecer.
        </p>
        
        <div className="bg-[var(--color-background-secondary)]/80 backdrop-blur-md border border-[var(--color-copper)]/30 p-8 md:p-14 rounded-3xl mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-copper)]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-left flex-1">
              <span className="inline-block px-3 py-1 bg-[var(--color-copper)]/10 text-[var(--color-copper)] border border-[var(--color-copper)]/20 mb-6 uppercase tracking-[0.2em] text-xs font-semibold rounded-full">Acesso Completo</span>
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] shadow-[0_0_8px_rgba(184,115,51,0.8)] shrink-0" />
                  <span className="text-white font-light">Acesso vitalício e imediato ao App PWA</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] shadow-[0_0_8px_rgba(184,115,51,0.8)] shrink-0" />
                  <span className="text-white font-light">Versão física enviada para seu endereço</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] shadow-[0_0_8px_rgba(184,115,51,0.8)] shrink-0" />
                  <span className="text-white font-light">Embalagem 100% lisa e discreta</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-right md:border-l md:border-[var(--color-border)]/50 md:pl-12 flex-1 w-full">
              <span className="text-xl text-[var(--color-text-secondary)] line-through block mb-2 font-light">De R$ 199,00</span>
              <span className="text-5xl lg:text-6xl font-serif text-white block mb-2">R$ 19,90</span>
              <span className="text-sm text-[var(--color-copper)] block mb-8 font-medium uppercase tracking-[0.1em]">Pagamento único e sem assinaturas</span>
              
              <button 
                onClick={onBuyClick}
                disabled={isLoading}
                className="w-full bg-[var(--color-copper)] hover:bg-[var(--color-copper)]/90 text-[var(--color-background-primary)] font-medium text-lg py-5 rounded-xl transition-all duration-300 shadow-xl shadow-[var(--color-copper)]/20 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center min-h-[64px] group"
              >
                <span className="flex items-center gap-2">
                  Garantir Experiência <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <div className="mt-4 flex items-center justify-center md:justify-end gap-2 text-xs text-[var(--color-text-secondary)]/80">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Pagamento 100% seguro via Stripe
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
