"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Smartphone, ChevronRight } from "lucide-react";

interface AppAndPhysicalSectionProps {
  onBuyClick: () => void;
  isLoading?: boolean;
}

export function AppAndPhysicalSection({ onBuyClick, isLoading = false }: AppAndPhysicalSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-primary)] px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a373]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background-primary)] via-transparent to-transparent z-10 pointer-events-none" />
          <Image 
            src="/ilustracards.png" 
            alt="Cartas premium do Deriva" 
            fill
            className="object-contain drop-shadow-2xl opacity-90"
          />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-white tracking-wide">
            O App e o <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">Físico</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Você não precisa esperar. Acesso imediato pelo celular para começar hoje mesmo, enquanto a versão premium de mesa viaja até sua casa.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* O App */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-[#0a0605] p-8 md:p-10 rounded-3xl border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Smartphone className="text-zinc-300" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-[var(--font-cormorant)] italic mb-4 text-white">Na palma da mão</h3>
            <p className="text-zinc-400 font-light mb-8 leading-relaxed">
              O aplicativo tira o peso de "conduzir". Ele sorteia, avança no ritmo certo e sugere trilhas sonoras. Vocês só precisam aproveitar a noite.
            </p>
            <ul className="space-y-4 mt-auto">
              {[
                "Sorteio que lê o clima do casal",
                "Progressão que nunca repete roteiro",
                "Controle total: avance ou pule quando quiser"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-light text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* O Físico */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#1a1410] to-[#050505] p-8 md:p-10 rounded-3xl border border-[#d4a373]/20 flex flex-col h-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#d4a373]/10 blur-3xl rounded-full"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#d4a373]/10 border border-[#d4a373]/20 flex items-center justify-center mb-6 relative z-10">
              <span className="font-[var(--font-cormorant)] italic text-[#d4a373] text-3xl">D</span>
            </div>
            <h3 className="text-2xl font-[var(--font-cormorant)] italic mb-4 text-[#d4a373] relative z-10">O toque do Papel</h3>
            <p className="text-zinc-400 font-light mb-8 relative z-10 leading-relaxed">
              O celular fica de lado. Quando a caixa chega, a experiência se torna tátil, analógica e ainda mais íntima.
            </p>
            <ul className="space-y-4 mt-auto relative z-10">
              {[
                "Acabamento premium de alta gramatura",
                "Ideal para noites de vinho sem telas",
                "Discrição total na embalagem de entrega"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-light text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373]/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-20 text-center flex justify-center">
          <button 
            onClick={onBuyClick}
            disabled={isLoading}
            className="group relative overflow-hidden rounded-full p-[1px] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#d4a373] via-[#b57a4e] to-[#d4a373] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div className="relative bg-[#0a0605] px-8 py-4 rounded-full transition-all duration-300 group-hover:bg-opacity-0">
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#d4a373]/30 border-t-[#d4a373] animate-spin my-1 mx-auto" />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-zinc-500 line-through opacity-70 leading-tight mb-1">De R$ 199,00</span>
                  <span className="font-light tracking-wide flex items-center gap-2 text-white group-hover:text-black transition-colors duration-300">
                    Acesso imediato + Físico por R$ 19,90 <ChevronRight size={18} className="opacity-70" />
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
