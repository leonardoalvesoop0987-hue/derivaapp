import Image from "next/image";

export function FounderAuthoritySection() {
  return (
    <section className="py-24 bg-[var(--color-background-primary)] relative overflow-hidden">
      {/* Editorial Grain Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=')]" />
      
      {/* Divider line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--color-copper)]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Column */}
          <div className="w-full lg:w-5/12 shrink-0">
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-[var(--color-copper)]/10 rounded-2xl -rotate-3 scale-105 transition-transform duration-500 hover:rotate-0" />
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-[var(--color-copper)]/20 shadow-2xl">
                <Image
                  src="/elizabeth.jpg"
                  alt="Elizabeth Mororó, Psicóloga e Sexóloga Clínica"
                  fill
                  className="object-cover object-top grayscale-[20%] contrast-110 brightness-95"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background-primary)] via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-7/12 text-center lg:text-left flex flex-col justify-center">
            {/* Minimalist marker */}
            <div className="w-8 h-1 bg-[var(--color-copper)]/50 mb-8 mx-auto lg:mx-0 rounded-full" />

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-8">
              Idealizado com olhar clínico e sensível para a{" "}
              <span className="text-[var(--color-copper)] italic">intimidade do casal</span>
            </h2>
            
            <blockquote className="text-xl md:text-2xl font-serif italic text-[var(--color-text-secondary)] leading-relaxed mb-10 border-l-2 border-[var(--color-copper)]/30 pl-6 py-2 relative">
              <span className="absolute -left-3 -top-2 text-4xl text-[var(--color-copper)]/20">&quot;</span>
              O Deriva não tenta forçar o que o casal não quer. Ele cria um espaço seguro e progressivo para vocês conversarem menos com cobrança e experimentarem mais desejo.
            </blockquote>
            
            <div className="space-y-4 text-base text-[var(--color-text-secondary)]/80 font-light leading-relaxed mb-10 max-w-2xl">
              <p>
                Como Psicóloga e Sexóloga Clínica, entendo que a quebra de rotina precisa de respeito ao ritmo de cada um. O app combina pausas, perguntas guiadas e diferentes níveis de intensidade para que a transição do leve ao mais quente aconteça com consentimento e muito conforto.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center lg:items-start gap-4 text-center md:text-left">
              <div>
                <h3 className="text-xl font-serif text-white mb-1 tracking-wide">Elizabeth Mororó</h3>
                <p className="text-[var(--color-copper)] text-sm mb-1 uppercase tracking-widest font-medium">Psicóloga e Sexóloga Clínica</p>
                <div className="text-xs text-[var(--color-text-secondary)] space-y-0.5">
                  <p>CRP 11/18388 • Fortaleza-CE</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Divider line bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--color-copper)]/20 to-transparent" />
    </section>
  );
}
