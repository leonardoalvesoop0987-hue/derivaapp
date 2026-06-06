"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onBuyClick: () => void;
  isLoading?: boolean;
}

export function HeroSection({ onBuyClick, isLoading = false }: HeroSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageFade = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-wine)]/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-copper)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Column */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
          <span className="inline-block py-1.5 px-4 rounded-full border border-[var(--color-copper)]/30 bg-[var(--color-copper)]/10 text-[var(--color-copper)] text-xs font-semibold tracking-widest uppercase mb-6 lg:mb-8">
            Para Casais Adultos
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
            Transforme uma noite comum em uma experiência{" "}
            <span className="text-[var(--color-copper)] italic">inesquecível.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-lg leading-relaxed">
            O Deriva combina app, cartas e sorteios inteligentes para guiar o casal por uma sequência sensual, progressiva e surpreendente — do leve ao muito quente, no ritmo de vocês.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={onBuyClick}
              disabled={isLoading}
              className="w-full sm:w-auto bg-[var(--color-copper)] hover:bg-[var(--color-copper)]/90 text-[var(--color-background-primary)] font-medium px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-copper)]/20 relative disabled:opacity-80 disabled:cursor-not-allowed group"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold leading-tight flex items-center gap-1 text-[16px]">
                  Acesso ao App + Físico <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[12px] opacity-80 mt-0.5">Por apenas R$ 19,90</span>
              </div>
            </button>
            <a 
              href="/app"
              className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white/50 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              Já tenho uma conta
            </a>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]/70 mt-6 lg:mt-8">
            Acesso imediato ao App. O baralho físico será enviado para sua casa.
          </p>
        </motion.div>

        {/* Image Column */}
        <motion.div initial="hidden" animate="visible" variants={imageFade} className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[400px] lg:max-w-[550px] aspect-square lg:aspect-[4/5]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-background-primary)] via-transparent to-transparent z-10 pointer-events-none" />
            <Image 
              src="/ilustracards.png" 
              alt="Cartas premium do Deriva para casais" 
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
