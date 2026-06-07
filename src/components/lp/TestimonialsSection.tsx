/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "Eu era BEM tímida. A primeira carta deixou meu rosto vermelho, sério. Achei que ia ficar constrangida a noite toda. Mas a pausa entre elas, o ritmo... eu consegui respirar, me acalmar e entrar no jogo sem pressão. Quando cheguei numa carta mais pesada, meu corpo já estava quente e eu confortável. Meu marido notou uma mudança em mim que ele não via há anos.",
    author: "Mariana",
    location: "São Paulo/SP, 2024"
  },
  {
    text: "Confessei pro meu marido: 'Essas cartas vermelhas são pesadas demais'. Ele quis parar. Mas ela falou pra gente que dava pra pular ou diminuir a intensidade quando quisesse. Aí mudou TUDO. Porque aí eu entendi que eu tava no controle. Não era para agradar ninguém. Era pro meu prazer. Pela primeira vez em anos de casamento, fui eu quem quis mais, sabe?",
    author: "Fernanda",
    location: "Belo Horizonte/MG, 2025"
  },
  {
    text: "Acordei pro meu marido: 'Não aguento mais a rotina, acho que a gente perdeu a faísca'. Ele sugeriu fazer isso com o aplicativo e eu pensei 'só mais uma coisa forçada que ele quer fazer comigo'. Comecei constrangida, vermelha de vergonha. Mas essa mulher no áudio tem uma voz tão segura que você acredita que tudo é normal. E é. A semana inteira depois, ele procurava meu olhar diferente, mais atento. E eu também.",
    author: "Ana Carolina",
    location: "Brasília/DF, 2024"
  },
  {
    text: "Meu marido sugeriu, eu recusava. Achava que era coisa de pornô, sabe? Que ia ser meio grotesco. Quando entrei e vi a primeira carta falando sobre 'deixar seu corpo acordar devagar', entendi que era diferente. Que alguém que entendia de mulher tinha desenhado aquilo. Fiz. E foi um alívio, tipo 'finalmente posso explorar isso sem parecer uma pessoa ruim'. Meu marido nunca me viu tão presente.",
    author: "Isabella",
    location: "Rio de Janeiro/RJ, 2024"
  },
  {
    text: "Tinha certeza que ia ficar vermelha a noite toda de vergonha. Ficou? Sim. Mas era aquele tipo de vergonha que esquenta, sabe? Tipo, por volta da carta 15, 16, eu não conseguia nem olhar pro meu marido de tanta adrenalina. Passei de 'por que isso existe' para 'por que demorou tanto para fazer isso'. Casamento novo.",
    author: "Sophia",
    location: "Curitiba/PR, 2025"
  },
  {
    text: "Sempre fomos bem tradicionais, e eu sentia que com o tempo a gente estava muito na mesmice. Eu nunca teria coragem de 'pedir algo diferente'. Mas com as cartas como mediador, ficou fácil. Tipo, é a carta pedindo, não é você pedindo. Isso tirou uma pressão que eu não sabia que tinha. Agora a gente fala sobre coisas que antes ficavam guardadas.",
    author: "Patricia",
    location: "Salvador/BA, 2024"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / cardsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleTestimonials = testimonials.slice(
    currentIndex * cardsToShow,
    currentIndex * cardsToShow + cardsToShow
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-secondary)] px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2a1510]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16 lg:mb-20">
          <span className="text-[#d4a373] text-sm uppercase tracking-[0.2em] font-light mb-4 block">Experiência Real</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 text-white">
            O que <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">elas</span> dizem
          </h2>
          <p className="text-zinc-500 text-xs mt-4 font-light italic opacity-60">
            Relatos ilustrativos baseados em situações comuns de casais.
          </p>
        </motion.div>

        <div className="relative px-4 sm:px-12">
          {/* Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-[#0a0605] border border-white/5 text-white hover:text-[#d4a373] hover:border-[#d4a373]/30 transition-all shadow-xl disabled:opacity-50 hidden sm:flex"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-[#0a0605] border border-white/5 text-white hover:text-[#d4a373] hover:border-[#d4a373]/30 transition-all shadow-xl disabled:opacity-50 hidden sm:flex"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x < -50 || velocity.x < -500) {
                    nextSlide();
                  } else if (offset.x > 50 || velocity.x > 500) {
                    prevSlide();
                  }
                }}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 touch-pan-y`}
              >
                {visibleTestimonials.map((item, i) => (
                  <div 
                    key={i}
                    className="bg-[#0a0605] p-8 md:p-10 rounded-2xl border border-white/5 flex flex-col h-full relative group hover:border-[#d4a373]/20 transition-colors"
                  >
                    <span className="font-[var(--font-cormorant)] italic text-[5rem] leading-none absolute -top-4 -left-2 text-white/5 group-hover:text-[#d4a373]/10 transition-colors pointer-events-none">
                      "
                    </span>
                    <p className="text-zinc-300 font-light mb-8 relative z-10 leading-relaxed text-[15px]">
                      {item.text}
                    </p>
                    <div className="mt-auto pt-6 border-t border-white/5">
                      <span className="block font-[var(--font-cormorant)] italic text-xl text-white">{item.author}</span>
                      <span className="block text-xs text-zinc-500 mt-1 tracking-wider uppercase">{item.location}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[#d4a373]' : 'w-2 bg-white/10 hover:bg-[#d4a373]/50'}`}
                aria-label={`Ir para a página ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
