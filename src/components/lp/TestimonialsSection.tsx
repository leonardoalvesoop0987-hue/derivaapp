"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const testimonials = [
    {
      text: "Na primeira vez eu fiquei com vergonha, mas gostei porque não parecia que eu precisava virar outra pessoa. Foi indo aos poucos. Na terceira vez, eu já estava esperando a próxima carta.",
      author: "Marina",
      location: "Belo Horizonte/MG, 2024"
    },
    {
      text: "Eu achei que seria só brincadeira, mas a experiência foi além do que imaginávamos. Fez uma diferença enorme na forma como a gente se entrega, revelando um lado do outro que não conhecíamos.",
      author: "Renata",
      location: "Curitiba/PR, 2025"
    },
    {
      text: "Foi um alívio não precisar 'conduzir' tudo sozinho. A surpresa das cartas fez ela se entregar de um jeito que eu não via há um bom tempo. Muito mais leve e intenso.",
      author: "Thiago",
      location: "São Paulo/SP, 2024"
    }
  ];

  return (
    <section className="py-24 bg-background-secondary px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem os casais</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Histórias reais de quem já transformou a própria noite.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="bg-background-primary p-8 rounded-3xl border border-border flex flex-col h-full relative"
            >
              <Quote size={32} className="text-copper/20 absolute top-6 right-6" />
              <p className="text-text-secondary italic mb-8 relative z-10 leading-relaxed text-[15px]">
                “{item.text}”
              </p>
              <div className="mt-auto pt-6 border-t border-border/50">
                <span className="block font-semibold text-text-primary">{item.author}</span>
                <span className="block text-xs text-text-secondary mt-1">{item.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
