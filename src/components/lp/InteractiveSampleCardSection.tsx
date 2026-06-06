"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveSampleCardSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="relative py-20 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-lg [perspective:1000px]">
        
        {/* Card Container */}
        <div 
          className="relative w-64 h-[22rem] md:w-72 md:h-96 cursor-pointer [transform-style:preserve-3d] transition-transform duration-700 ease-in-out"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card (Closed) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1410] to-[#050505] flex flex-col items-center justify-center shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6">
              <span className="text-white/40 text-sm">✦</span>
            </div>
            <span className="text-[var(--font-cormorant)] italic text-zinc-400 text-lg">Toque para abrir</span>
          </div>

          {/* Back of Card (Revealed) */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl border border-[#4a2a6c]/30 flex flex-col p-8 shadow-2xl overflow-hidden"
            style={{
              transform: "rotateY(180deg)",
              background: 'linear-gradient(135deg, #1a2a6c 0%, #0d0820 100%)'
            }}
          >
            <div className="flex justify-between items-center mb-auto">
              <span className="text-white/50 text-xs tracking-widest uppercase">Nível 1</span>
              <span className="text-white/50 text-xs tracking-widest uppercase">Azul</span>
            </div>
            
            <p className="text-white text-xl md:text-2xl font-light leading-relaxed text-center font-[var(--font-cormorant)] italic my-auto">
              "Olha para ele. Sem pressa.<br/>Você define o ritmo agora."
            </p>

            <div className="mt-auto flex justify-center">
              <div className="w-8 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-400 font-light text-sm md:text-base max-w-xs mx-auto">
            É assim que o Deriva começa: simples, íntimo e sem empurrar você para nada antes da hora.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
