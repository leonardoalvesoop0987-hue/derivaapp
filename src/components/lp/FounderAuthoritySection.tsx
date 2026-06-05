import Image from "next/image";

export function FounderAuthoritySection() {
  return (
    <section className="py-24 bg-[var(--color-background-secondary)]/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-wine)]/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Column */}
          <div className="w-full lg:w-5/12 shrink-0">
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-[var(--color-copper)]/30 shadow-2xl">
              <Image
                src="/elizabeth.jpg"
                alt="Elizabeth Mororó, Psicóloga e Sexóloga Clínica"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 via-transparent to-transparent" />
              
              {/* Overlay Text inside Image on Mobile (optional, but requested layout is text on side) */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-block bg-[var(--color-wine)]/80 backdrop-blur-md border border-[var(--color-copper)]/20 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-[var(--color-copper)] font-medium mb-3">
                  Idealização Profissional
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-7/12 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6 text-white leading-tight">
              Idealizado com olhar clínico e sensível para a <span className="text-[var(--color-copper)] italic font-serif">intimidade do casal</span>
            </h2>
            
            <div className="space-y-6 text-base md:text-lg text-[var(--color-text-secondary)] font-light leading-relaxed mb-8">
              <p>
                O Deriva foi pensado para conduzir experiências íntimas com progressão, consentimento, cuidado emocional e espaço para que cada casal avance no próprio ritmo.
              </p>
              <p>
                A proposta não é forçar comportamentos nem transformar intimidade em obrigação. É criar um caminho guiado para que o casal possa sair do automático, conversar menos com cobrança e experimentar mais presença, desejo e conexão.
              </p>
              <p className="text-sm md:text-base border-l-2 border-[var(--color-copper)]/40 pl-4 py-1 italic">
                O app combina progressão, limites, pausas, perguntas privadas e cartas com diferentes níveis de intensidade para tornar a experiência mais segura, natural e adaptável.
              </p>
            </div>

            <div className="bg-[var(--color-card)]/40 border border-[var(--color-border)] p-5 md:p-6 rounded-2xl inline-block text-left shadow-lg backdrop-blur-sm">
              <h3 className="text-xl text-white font-medium mb-1">Elizabeth Mororó</h3>
              <p className="text-[var(--color-copper)] text-sm mb-2">Psicóloga e Sexóloga Clínica</p>
              <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <p>CRP 11/18388</p>
                <p>Fortaleza-CE</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
