"use client";

import { motion } from "framer-motion";
import { Music, PlayCircle } from "lucide-react";

export function MediaAndMusicSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-background-secondary px-6 border-y border-border/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-wine/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-copper">
              <Music size={28} />
            </div>
            <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-red-deep">
              <PlayCircle size={28} />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Música, clima e mídia</h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            Algumas experiências ficam mais fortes com ambiente. Por isso, o app pode usar trilha sensual para dar ritmo e, em cartas específicas, apresentar vídeos adultos pensados para provocar a imaginação e aumentar a tensão visual do momento. 
          </p>
          <p className="text-text-primary text-base font-medium mt-6">
            Nada precisa ser forçado: o casal segue no próprio ritmo, podendo habilitar ou desabilitar o que quiser. O foco é a intimidade de vocês.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
