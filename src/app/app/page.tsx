import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AppPage() {
  const userSession = await getSession();
  
  let activeSessionId = null;
  if (userSession) {
    const active = await prisma.session.findFirst({
      where: { user_id: userSession.userId, status: "ACTIVE" },
      orderBy: { created_at: "desc" }
    });
    if (active) activeSessionId = active.id;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      
      {/* Hero / Start */}
      <div className="bg-gradient-to-br from-[#2a0a0f] to-[#1a0508] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5 text-center">
        <div className="absolute top-[-30%] right-[-20%] w-64 h-64 bg-[#B9825A]/10 blur-[60px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          {!activeSessionId ? (
            <>
              <h2 className="text-3xl font-light mb-4 leading-tight tracking-wide">
                A noite começa <br />
                <span className="font-serif text-[#d4a373] italic">devagar</span>.
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[260px] leading-relaxed font-light">
                Escolham o ritmo e deixem o Deriva conduzir carta por carta — sem pressa, sem cobrança, no tempo de vocês.
              </p>
              <Link 
                href="/app/sessao/nova" 
                className="w-full bg-[#B9825A] text-white py-4 rounded-2xl font-medium tracking-wide shadow-lg shadow-[#B9825A]/20 hover:brightness-110 transition-all text-center"
              >
                Começar a noite
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-light mb-4 leading-tight tracking-wide">
                A noite ainda não <br />
                <span className="font-serif text-[#d4a373] italic">acabou</span>.
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[260px] leading-relaxed font-light">
                O clima já começou. Continuem de onde pararam ou encerrem quando quiserem.
              </p>
              <Link 
                href={`/app/sessao/${activeSessionId}`}
                className="w-full bg-gradient-to-r from-[#4A1118] to-[#6A1922] text-white py-4 rounded-2xl font-medium tracking-wide shadow-lg shadow-[#4A1118]/30 hover:brightness-110 transition-all text-center flex justify-center items-center gap-2"
              >
                <PlayCircle className="w-5 h-5 fill-current opacity-80" />
                Continuar a noite
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Como funciona (Editorial) */}
      <div className="px-2">
        <h3 className="font-serif italic text-xl text-[#d4a373] mb-6">Como funciona</h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="font-serif text-2xl text-white/20">01</span>
            <div>
              <h4 className="font-medium text-white mb-1 tracking-wide text-sm">Escolham o clima</h4>
              <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
                Leve, quente ou mais intenso. O ponto de partida é de vocês.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-serif text-2xl text-white/20">02</span>
            <div>
              <h4 className="font-medium text-white mb-1 tracking-wide text-sm">Revelem uma carta</h4>
              <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
                A surpresa faz parte do jogo. Vocês só precisam seguir até onde fizer sentido.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-serif text-2xl text-white/20">03</span>
            <div>
              <h4 className="font-medium text-white mb-1 tracking-wide text-sm">Sigam no ritmo dos dois</h4>
              <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
                Pular, diminuir ou parar também faz parte da experiência.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Dicas e Combinado */}
      <div className="px-2 space-y-8 pb-4">
        <div>
          <h3 className="text-sm font-medium text-white tracking-widest uppercase mb-2">Combinado simples</h3>
          <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
            <span className="text-green-400 font-medium">Verde</span> continua. <span className="text-yellow-400 font-medium">Amarelo</span> diminui. <span className="text-red-400 font-medium">Vermelho</span> para. Não precisa justificar na hora. O combinado existe para proteger o clima dos dois.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white tracking-widest uppercase mb-2">Melhor quando existe tempo</h3>
          <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed">
            O Deriva funciona melhor sem pressa: uma noite tranquila, o celular no modo silencioso e espaço para vocês entrarem no clima.
          </p>
        </div>
      </div>

    </div>
  );
}
