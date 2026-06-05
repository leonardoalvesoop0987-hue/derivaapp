import Link from "next/link";
import { Play, PlayCircle, Flame, ShieldAlert, Sparkles } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero / Start */}
      <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-red-deep)] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Flame className="w-32 h-32" />
        </div>
        
        {!activeSessionId ? (
          <>
            <h2 className="text-2xl font-light mb-2">Pronto para começar?</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[80%] leading-relaxed">
              Escolha o ritmo da noite e deixe o Deriva conduzir o clima carta por carta.
            </p>
            <Link 
              href="/app/sessao/nova" 
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar sessão
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-light mb-2">Sessão em andamento</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[80%] leading-relaxed">
              O clima já começou. Continue de onde parou.
            </p>
            <Link 
              href={`/app/sessao/${activeSessionId}`}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              <PlayCircle className="w-5 h-5 fill-current" />
              Continuar sessão
            </Link>
          </>
        )}
      </div>

      {/* Como funciona */}
      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--color-copper)]" />
          <h3 className="font-medium text-[var(--color-text-primary)]">Como funciona</h3>
        </div>
        <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 ml-4 list-decimal marker:text-[var(--color-copper)]">
          <li>Escolha o modo e a intensidade.</li>
          <li>O Deriva sorteia as cartas em progressão.</li>
          <li>Vocês podem pular, inverter ou encerrar quando quiserem.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Segurança */}
        <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-[var(--color-copper)]" />
            <h3 className="font-medium text-[var(--color-text-primary)]">Combinado simples</h3>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Verde continua. Amarelo diminui. Vermelho para. Nenhuma carta precisa ser explicada ou justificada.
          </p>
        </div>

        {/* Frequência */}
        <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <h3 className="font-medium mb-2 text-[var(--color-text-primary)]">Dica</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Para manter o desejo alto, use sem pressa: até 2 vezes por semana costuma funcionar melhor.
          </p>
        </div>
      </div>

    </div>
  );
}
