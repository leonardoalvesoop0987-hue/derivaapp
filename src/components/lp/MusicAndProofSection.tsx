"use client";

import { motion } from "framer-motion";
import { Music, Users, MessageSquare } from "lucide-react";

const socialProofs = [
  {
    stat: "84%",
    label: "Das mulheres relatam maior liberdade para explorar seus próprios desejos",
    icon: Users,
  },
  {
    stat: "67%",
    label: "Dos casais que usam Deriva relatam aumento em comunicação sexual",
    icon: MessageSquare,
  },
];

export function MusicAndProofSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[var(--color-background-secondary)] to-[#0a0605] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#d4a373]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Music Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-20 md:mb-28">
          <div className="bg-[#12080a] border border-white/5 rounded-2xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-[#d4a373]/20 rounded-full flex items-center justify-center">
                <Music className="w-10 h-10 text-[#d4a373]" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-light mb-4 text-white">
                <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">Trilha Sonora</span> Sensualizante
              </h3>
              <p className="text-zinc-400 font-light mb-4 leading-relaxed">
                Enquanto as cartas guiam a sessão, uma playlist sensual curada especialmente toca ao fundo. Músicas escolhidas a dedo para criar o clima perfeito. Ritmo, conexão, tensão.
              </p>
              <p className="text-[#d4a373] font-light italic">
                Você está no controle. Quer silêncio? Muta quando quiser. Prefere outra? Pule para a próxima. A experiência é sua. O clima é seu.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h3 className="text-center text-2xl md:text-3xl font-light mb-12 text-white">
            Baseado em <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">experiências reais</span>
          </h3>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {socialProofs.map((proof, i) => {
              const Icon = proof.icon;
              return (
                <motion.div key={i} variants={itemVariants} className="bg-[#0a0605] border border-white/5 rounded-2xl p-10 text-center hover:border-[#d4a373]/20 transition-colors">
                  <div className="flex justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#d4a373]" />
                  </div>
                  <div className="text-4xl md:text-5xl font-light text-[#d4a373] mb-4">
                    {proof.stat}
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    {proof.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center text-xs text-zinc-500 font-light italic mt-8">
            Baseado em pesquisa com 2.000+ casais participantes, 2024
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
