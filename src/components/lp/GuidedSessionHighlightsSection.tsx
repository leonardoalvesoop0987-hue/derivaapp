"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, Mic, PlayCircle, Lock, SlidersHorizontal, Monitor } from "lucide-react";

export function GuidedSessionHighlightsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const featureItem = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <Flame size={20} strokeWidth={1.5} />,
      title: "Começa no ritmo certo",
      desc: "Vocês escolhem se querem algo leve, quente ou mais intenso. O Deriva organiza a sequência para o clima crescer sem parecer forçado."
    },
    {
      icon: <Sparkles size={20} strokeWidth={1.5} />,
      title: "Ela pode ser o centro",
      desc: "Quando o casal quiser, a sessão pode puxar mais atenção para ela — com ele participando, provocando e entrando no jogo."
    },
    {
      icon: <Mic size={20} strokeWidth={1.5} />,
      title: "A carta também pode falar",
      desc: "Em vez de parar tudo para ler, a narração pode conduzir a carta com uma voz feminina envolvente, curta e no clima certo."
    },
    {
      icon: <PlayCircle size={20} strokeWidth={1.5} />,
      title: "Música e estímulo visual",
      desc: "A trilha ajuda a criar ambiente. Em cartas específicas, vídeos podem entrar como provocação, sempre com controle do casal."
    },
    {
      icon: <Lock size={20} strokeWidth={1.5} />,
      title: "O mais ousado fica bloqueado",
      desc: "Conteúdos avançados, como Tons mais escuros, só aparecem se forem desbloqueados pelos dois. Nada surge por acidente."
    },
    {
      icon: <SlidersHorizontal size={20} strokeWidth={1.5} />,
      title: "Vocês mantêm o controle",
      desc: "Pular, diminuir ou encerrar faz parte do jogo. O Deriva esquenta a noite, mas o limite continua sendo de vocês."
    },
    {
      icon: <Monitor size={20} strokeWidth={1.5} />,
      title: "Funciona também em tela grande",
      desc: "Celular, tablet ou Android TV: a experiência se adapta para deixar o app menos no centro e o clima mais presente."
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-primary)] px-6 border-y border-[var(--color-border)] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-red-deep)]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-copper)]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeInUp}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">Sessão Guiada</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">
            Uma sessão guiada para transformar o clima em jogo.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-light">
            A experiência começa no ritmo escolhido por vocês e evolui com cartas, música, estímulos e comandos curtos. Pode começar leve, ficar quente, colocar ela no centro ou abrir conteúdos mais ousados quando os dois quiserem.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={featureItem}
              className={`p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex flex-col gap-4 ${idx === 6 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-background-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-copper)]">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-white font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
