"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "No começo eu achei que ficaria travada, mas o fato de começar leve ajudou muito. Não parecia pressão. Foi ficando natural.",
    author: "Camila",
    location: "Recife/PE, 2024"
  },
  {
    text: "Meu marido ficou muito mais atento aos detalhes. Parecia que ele tava focado só em mim, seguindo o que a carta pedia. Adorei essa sensação.",
    author: "Juliana",
    location: "São Paulo/SP, 2023"
  },
  {
    text: "O que mais gostei foi a progressão. Não pulou direto pro final. A gente teve tempo pra conversar, dar risada e depois o clima esquentou muito.",
    author: "Amanda",
    location: "Florianópolis/SC, 2025"
  },
  {
    text: "Nosso casamento é ótimo, não precisávamos 'salvar' nada. Mas a rotina cansa. O Deriva trouxe aquele frio na barriga do início do namoro de volta.",
    author: "Beatriz",
    location: "Rio de Janeiro/RJ, 2024"
  },
  {
    text: "Eu sou tímida e a ideia me assustava. Mas o fato de eu poder pular uma carta se não quisesse, me deu segurança pra tentar. Fui no meu ritmo.",
    author: "Fernanda",
    location: "Porto Alegre/RS, 2023"
  },
  {
    text: "Na primeira vez eu fiquei com vergonha, mas gostei porque não parecia que eu precisava virar outra pessoa. Foi indo aos poucos. Na terceira vez, eu já tava esperando a próxima carta.",
    author: "Marina",
    location: "Belo Horizonte/MG, 2024"
  },
  {
    text: "Foi um alívio não precisar 'conduzir' ou improvisar tudo sozinho. A surpresa das cartas fez ela se entregar de um jeito muito mais livre. Recomendo pra qualquer homem.",
    author: "Thiago",
    location: "Campinas/SP, 2024"
  },
  {
    text: "A gente já tinha uma relação boa, mas o Deriva trouxe uma provocação diferente. Parecia que a noite tinha roteiro, mas sem perder a espontaneidade.",
    author: "Larissa",
    location: "Brasília/DF, 2025"
  },
  {
    text: "Levamos para uma viagem de fim de semana na serra. Fez toda a diferença. Desligamos a TV e ficamos um tempão só focados um no outro.",
    author: "Rafael e Carol",
    location: "Gramado/RS, 2025"
  },
  {
    text: "Eu achava que ia ser só um baralho, mas o app com a música e o sorteio inteligente deixam o clima de cinema. Muito premium, muito bem feito.",
    author: "Patrícia",
    location: "Salvador/BA, 2026"
  },
  {
    text: "No dia a dia a gente acaba indo direto ao ponto pela correria. Jogamos no deck 'Azul e Rosa' e só focamos nas preliminares. Delícia.",
    author: "Isabela",
    location: "Curitiba/PR, 2024"
  },
  {
    text: "A gente jogou o baralho padrão várias vezes e depois resolvemos liberar o deck mais quente. Valeu a pena esperar a confiança crescer. Foi a melhor noite do ano.",
    author: "Daniela",
    location: "Goiânia/GO, 2025"
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
    }, 8000);
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-wine)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16 lg:mb-20">
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">Experiência Real</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 text-white">O que dizem os casais</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-4 font-light italic opacity-70">
            Relatos ilustrativos baseados em situações comuns de casais da comunidade.
          </p>
        </motion.div>

        <div className="relative px-4 sm:px-12">
          {/* Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-[var(--color-background-primary)] border border-[var(--color-border)] text-white hover:text-[var(--color-copper)] hover:border-[var(--color-copper)]/50 transition-all shadow-xl disabled:opacity-50 hidden sm:flex"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-[var(--color-background-primary)] border border-[var(--color-border)] text-white hover:text-[var(--color-copper)] hover:border-[var(--color-copper)]/50 transition-all shadow-xl disabled:opacity-50 hidden sm:flex"
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
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`}
              >
                {visibleTestimonials.map((item, i) => (
                  <div 
                    key={i}
                    className="bg-[var(--color-background-primary)] p-8 rounded-2xl border border-[var(--color-border)] flex flex-col h-full relative group hover:border-[var(--color-copper)]/30 transition-colors"
                  >
                    <Quote size={40} className="text-[var(--color-copper)]/10 absolute top-6 right-6 group-hover:text-[var(--color-copper)]/20 transition-colors" />
                    <p className="text-[var(--color-text-secondary)] italic mb-8 relative z-10 leading-relaxed text-[15px]">
                      “{item.text}”
                    </p>
                    <div className="mt-auto pt-6 border-t border-[var(--color-border)]/50">
                      <span className="block font-serif text-lg text-white">{item.author}</span>
                      <span className="block text-xs text-[var(--color-text-secondary)] mt-1 tracking-wider uppercase">{item.location}</span>
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
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[var(--color-copper)]' : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-copper)]/50'}`}
                aria-label={`Ir para a página ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
