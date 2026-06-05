"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function RelationshipSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto bg-card border border-copper/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-copper/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-copper/5 blur-[80px] rounded-full pointer-events-none"></div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-background-primary border border-border flex items-center justify-center mb-6">
            <ShieldCheck className="text-copper" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-6 text-text-primary">Para casais que buscam ainda mais intensidade.</h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            O Deriva foi feito para casais fortes, que já escolheram estar juntos e querem elevar o nível do desejo, da intimidade e da presença.
            A rotina é natural, mas a chama sempre pode ser intensificada. Descubram juntos novas formas de provocar, sentir e se conectar com confiança e entrega total.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
