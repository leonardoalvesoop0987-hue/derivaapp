"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onBuyClick: () => void;
}

export function HeroSection({ onBuyClick }: HeroSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
        <span className="inline-block py-1 px-3 rounded-full border border-copper/30 bg-copper/10 text-copper text-xs font-semibold tracking-widest uppercase mb-8">
          Para Casais Adultos
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary leading-tight">
          Transforme uma noite comum em uma experiência <br className="hidden md:block" /> que vocês vão lembrar.
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          O Deriva combina app, cartas e sorteios inteligentes para guiar o casal por uma sequência sensual, progressiva e surpreendente — do leve ao muito quente, no ritmo certo.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBuyClick}
            className="w-full sm:w-auto bg-red-deep hover:bg-wine text-text-primary font-medium px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-deep/25"
          >
            Quero o Deriva por R$ 19,90 <ChevronRight size={18} />
          </button>
          <a 
            href="/app"
            className="w-full sm:w-auto bg-transparent border border-copper/30 hover:border-copper text-copper font-medium px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center"
          >
            Já tenho uma conta
          </a>
        </div>
        <p className="text-sm text-text-secondary mt-6">Acesso imediato ao App + Versão física enviada para sua casa</p>
      </motion.div>
    </section>
  );
}
