"use client";

import { motion } from "framer-motion";
import { Play, Volume2, Zap } from "lucide-react";

const videoFeatures = [
  {
    icon: Play,
    title: "Sensualidade em Movimento",
    description: "Ritmo lento e envolvente que deixa você aproveitar cada momento. Sem pressa. Sem foco em certos atos. Apenas você, seu corpo, e a conexão com seu parceiro.",
  },
  {
    icon: Zap,
    title: "Atmosfera que Acalma e Excita",
    description: "Ambientes em tons escuros e aconchegantes. Luz que envolve. Tudo cuidadosamente criado para você se sentir segura enquanto explora seu próprio tesão.",
  },
  {
    icon: Volume2,
    title: "Mais do que Ação",
    description: "Nem tudo é intenso. Existem cartas focadas em conexão, em olhares, em preliminares que despertam o desejo juntos. Fortalecimento do vínculo. Construção de tesão.",
  },
];

export function VideosForYouSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-background-secondary)] px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2a1510]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-white">
            Os vídeos foram pensados <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">para você</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light">
            Nenhum deles é genérico. Todos foram criados com você em mente.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} variants={itemVariants} className="bg-[#0a0605] p-10 rounded-2xl border border-white/5 hover:border-[#d4a373]/20 transition-all group">
                <div className="mb-6">
                  <div className="w-14 h-14 bg-[#d4a373]/10 group-hover:bg-[#d4a373]/20 rounded-full flex items-center justify-center transition-colors mb-6">
                    <Icon className="w-7 h-7 text-[#d4a373]" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-4">{feature.title}</h3>
                </div>

                <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
