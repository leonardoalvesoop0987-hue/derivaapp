"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onBuyClick: () => void;
  isLoading?: boolean;
}

export function HeroSection({ onBuyClick, isLoading = false }: HeroSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Background Atmosférico */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #2a1510 0%, #0d0806 70%, var(--color-background-primary) 100%)'
        }}
      />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-12">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col items-center w-full">
          
          <h1 className="text-[2.5rem] md:text-6xl lg:text-[5rem] font-light text-white leading-[1.1] mb-8 tracking-tight">
            Existe uma <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">noite</span> mais sua.<br className="hidden md:block"/>
            Mais <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">lenta</span>. Mais quente.<br className="hidden md:block"/>
            Mais <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">inesquecível</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-light">
            O Deriva guia o casal por cartas, música e escolhas inesperadas — sem pressa, sem obrigação e com espaço para o <span className="font-[var(--font-cormorant)] italic text-zinc-300">desejo</span> aparecer no ritmo certo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <button 
              onClick={onBuyClick}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-red-deep)] hover:brightness-110 text-white font-medium px-10 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl relative disabled:opacity-80 disabled:cursor-not-allowed group"
            >
              <span className="text-[17px] tracking-wide">Descubra a sua noite</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform opacity-70" />
            </button>
            <a 
              href="/app"
              className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white font-medium px-10 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center text-[17px]"
            >
              Já tenho uma conta
            </a>
          </div>
          <p className="text-sm text-zinc-500 mt-8 font-light tracking-wide">
            Acesso imediato ao App • Físico entregue em casa
          </p>
        </motion.div>
      </div>
    </section>
  );
}
