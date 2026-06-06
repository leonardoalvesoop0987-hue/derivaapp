"use client";

import { motion } from "framer-motion";

export function AtmosphericClosingSection() {
  return (
    <section className="relative py-32 md:py-48 px-6 min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Deep atmospheric background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #1a0d0a 0%, #0d0806 60%, var(--color-background-primary) 100%)'
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
            Uma carta aparece.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        >
          <p className="text-3xl md:text-5xl lg:text-6xl font-[var(--font-cormorant)] italic text-[#d4a373] leading-tight">
            Ela não avisa o que vem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
        >
          <p className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
            Você <span className="font-[var(--font-cormorant)] italic text-[#d4a373]">sente</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1.2 }}
        >
          <p className="text-3xl md:text-5xl lg:text-6xl font-[var(--font-cormorant)] italic text-zinc-500 leading-tight">
            Ele também.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
