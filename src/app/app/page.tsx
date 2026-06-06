import Link from "next/link";
import { PlayCircle, Zap, Flame, Heart, Layers, EyeOff, Video } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AppPage() {
  const userSession = await getSession();
  
  let activeSessionId = null;
  let isDarkUnlocked = false;

  if (userSession) {
    const active = await prisma.session.findFirst({
      where: { user_id: userSession.userId, status: "ACTIVE" },
      orderBy: { created_at: "desc" }
    });
    if (active) activeSessionId = active.id;

    const darkUnlock = await prisma.coupleUnlock.findUnique({
      where: {
        user_id_unlock_group_key: {
          user_id: userSession.userId,
          unlock_group_key: "DARK_THIRD_IMAGINATION"
        }
      }
    });
    isDarkUnlocked = !!(darkUnlock && darkUnlock.is_enabled);
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto pb-10">
      
      {/* Hero / Guided Session */}
      <div className="bg-gradient-to-br from-[#2a0a0f] to-[#1a0508] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5 text-center">
        <div className="absolute top-[-30%] right-[-20%] w-64 h-64 bg-[#B9825A]/10 blur-[60px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          {!activeSessionId ? (
            <>
              <h2 className="text-3xl font-light mb-4 leading-tight tracking-wide">
                Uma noite diferente <br />
                <span className="font-serif text-[#d4a373] italic">começa aqui</span>.
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[260px] leading-relaxed font-light">
                Para uma sequência completa, com começo, tensão e progressão.
              </p>
              <Link 
                href="/app/sessao/nova" 
                className="w-full bg-gradient-to-r from-[#B9825A] to-[#8C5D3D] text-white py-4 rounded-2xl font-medium tracking-wide shadow-xl shadow-[#B9825A]/20 hover:brightness-110 transition-all text-center"
              >
                Sessão Guiada
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-light mb-4 leading-tight tracking-wide">
                A noite ainda não <br />
                <span className="font-serif text-[#d4a373] italic">acabou</span>.
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[260px] leading-relaxed font-light">
                O clima já foi criado. Continuem do ponto de tensão em que pararam ou encerrem o jogo.
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

      {/* Modos Rápidos */}
      <div className="px-2 space-y-4">
        <h3 className="font-serif italic text-xl text-[#d4a373] mb-4">Modos Rápidos</h3>
        
        <Link href="/app/sessao/nova?mode=FAISCA" className="flex items-center gap-4 bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#B9825A]/20 flex items-center justify-center text-[#B9825A] group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 fill-current opacity-80" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-white mb-1 tracking-wide">Faísca</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-light">Uma carta. Agora.</p>
          </div>
        </Link>

        <Link href="/app/sessao/nova?mode=MERGULHO" className="flex items-center gap-4 bg-gradient-to-r from-red-950/40 to-transparent border border-red-900/30 p-5 rounded-2xl hover:bg-red-950/60 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 fill-current opacity-80" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-white mb-1 tracking-wide">Mergulho</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-light">Quando o clima já começou.</p>
          </div>
        </Link>

        <Link href="/app/sessao/nova?mode=NOITE_DELA" className="flex items-center gap-4 bg-gradient-to-r from-pink-950/40 to-transparent border border-pink-900/30 p-5 rounded-2xl hover:bg-pink-950/60 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-current opacity-80" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-white mb-1 tracking-wide">Noite Dela</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-light">Ela no centro desde a primeira carta.</p>
          </div>
        </Link>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Explorar */}
      <div className="px-2 space-y-4">
        <h3 className="font-serif italic text-xl text-[#d4a373] mb-4">Explorar</h3>
        
        <Link href="/app/sessao/nova?mode=FOCO_CATEGORIA" className="flex items-center gap-4 bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-white mb-1 tracking-wide">Foco em Categoria</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-light">Escolham o tipo de clima.</p>
          </div>
        </Link>

        {isDarkUnlocked ? (
          <Link href="/app/sessao/nova?mode=TONS_ESCUROS" className="flex items-center gap-4 bg-gradient-to-r from-black to-[#1a1a1a] border border-gray-800 p-5 rounded-2xl hover:border-gray-600 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-white mb-1 tracking-wide">Explorar Tons mais escuros</h4>
              <p className="text-sm text-gray-500 font-light">Um território mais provocante.</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-5 rounded-2xl opacity-60">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-white/50 mb-1 tracking-wide">Tons mais escuros</h4>
              <p className="text-sm text-[var(--color-text-secondary)] font-light">Disponível quando desbloqueado.</p>
            </div>
          </div>
        )}

        <Link href="/app/cena-solta" className="flex items-center gap-4 bg-purple-950/20 border border-purple-900/30 p-5 rounded-2xl hover:bg-purple-950/40 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Video className="w-5 h-5 fill-current opacity-80" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-white mb-1 tracking-wide">Cena Solta</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-light">Inspiração visual aleatória.</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
