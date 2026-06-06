"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const atmosphereImages = [
  {
    src: "/lp/atmosfera/atmosfera-01.webp",
    alt: "Ambiente íntimo em tons escuros",
    caption: "Mais tensão antes do toque.",
  },
  {
    src: "/lp/atmosfera/atmosfera-02.webp",
    alt: "Cena atmosférica em luz vermelha",
    caption: "Mais intenção em cada escolha.",
  },
  {
    src: "/lp/atmosfera/atmosfera-03.webp",
    alt: "Clima sensual com luz baixa",
    caption: "Mais jogo entre vocês dois.",
  },
  {
    src: "/lp/atmosfera/atmosfera-04.webp",
    alt: "Ambiente íntimo e misterioso",
    caption: "A surpresa faz parte.",
  },
  {
    src: "/lp/atmosfera/atmosfera-05.webp",
    alt: "Luz suave e envolvente",
    caption: "Começa no olhar.",
  },
  {
    src: "/lp/atmosfera/atmosfera-06.webp",
    alt: "Cena com foco na presença",
    caption: "Esquenta no ritmo.",
  },
  {
    src: "/lp/atmosfera/atmosfera-07.webp",
    alt: "Clima de provocação elegante",
    caption: "Ela sente. Ele percebe.",
  },
  {
    src: "/lp/atmosfera/atmosfera-08.webp",
    alt: "Momento íntimo sugerido",
    caption: "Nem toda noite precisa ser previsível.",
  },
  {
    src: "/lp/atmosfera/atmosfera-09.webp",
    alt: "Tom escuro com detalhes em vermelho",
    caption: "Vocês decidem até onde vão.",
  },
];

export function AtmosphereCarouselSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % atmosphereImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + atmosphereImages.length) % atmosphereImages.length);
  };

  // For desktop, we calculate the visible items
  const getVisibleItems = () => {
    const prev = (currentIndex - 1 + atmosphereImages.length) % atmosphereImages.length;
    const next = (currentIndex + 1) % atmosphereImages.length;
    return [prev, currentIndex, next];
  };

  return (
    <section className="py-24 bg-background-primary relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-deep/5 via-background-primary to-background-primary pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-light tracking-tight text-text-primary mb-6"
          >
            O clima também faz <span className="font-serif italic text-red-light">parte do jogo.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary font-light leading-relaxed"
          >
            O Deriva não entrega uma lista de tarefas. Ele cria uma sequência: aproxima, provoca, dá pausa, esquenta de novo e deixa vocês decidirem até onde querem ir.
          </motion.p>
        </div>

        {/* Carousel Container */}
        {isDesktop ? (
          // Desktop: 3 cards visible, center is larger
          <div className="relative h-[600px] flex items-center justify-center">
            <div className="absolute left-0 z-20 flex items-center h-full pl-4">
              <button onClick={handlePrev} className="p-3 rounded-full bg-surface-primary/50 hover:bg-surface-primary backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6 w-full max-w-5xl">
              <AnimatePresence mode="popLayout">
                {getVisibleItems().map((imageIndex, idx) => {
                  const isCenter = idx === 1;
                  const item = atmosphereImages[imageIndex];
                  return (
                    <motion.div
                      key={`${imageIndex}-${idx}`}
                      initial={{ opacity: 0, scale: 0.8, x: idx === 0 ? -100 : idx === 2 ? 100 : 0 }}
                      animate={{ 
                        opacity: isCenter ? 1 : 0.5, 
                        scale: isCenter ? 1 : 0.85,
                        x: 0,
                        zIndex: isCenter ? 10 : 0
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-surface-primary ${
                        isCenter ? "w-[400px] h-[550px]" : "w-[300px] h-[450px]"
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent mix-blend-multiply" />
                      <div className="absolute inset-0 bg-red-deep/10 mix-blend-overlay" />
                      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/noise.png')", backgroundRepeat: "repeat" }} />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 10 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg text-white font-light tracking-wide"
                        >
                          {item.caption}
                        </motion.p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="absolute right-0 z-20 flex items-center h-full pr-4">
              <button onClick={handleNext} className="p-3 rounded-full bg-surface-primary/50 hover:bg-surface-primary backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          // Mobile: CSS Snap Carousel
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {atmosphereImages.map((item, idx) => (
              <div 
                key={idx} 
                className="snap-center shrink-0 w-[85vw] max-w-[340px] aspect-[4/5] relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="85vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-red-deep/20 mix-blend-overlay" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
                  <p className="text-white text-lg font-light tracking-wide drop-shadow-md">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
