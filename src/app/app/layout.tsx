"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Settings, LogOut } from "lucide-react";
import { GrainOverlay } from "@/components/lp/GrainOverlay";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const isHome = pathname === "/app";
  const isSession = pathname.startsWith("/app/sessao/") && !pathname.endsWith("/feedback");
  const isDecks = pathname.startsWith("/app/decks");
  const isSessionFeedback = pathname.includes("/sessao/") && pathname.endsWith("/feedback");

  return (
    <div className="min-h-screen flex flex-col relative bg-[var(--color-background-primary)] selection:bg-[var(--color-wine)] selection:text-white">
      <PWAInstallPrompt />
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--color-wine)] opacity-15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B9825A] opacity-10 blur-[100px] rounded-full mix-blend-screen" />
        <GrainOverlay opacity={0.03} />
      </div>

      {!isSession && (
        <header className="px-6 py-5 flex items-center justify-between relative z-10">
          <div className="text-xl font-serif tracking-widest text-[#d4a373] italic">Deriva</div>
          <div className="flex gap-4">
            <Link href="/app/configuracoes" className="text-[var(--color-text-secondary)] hover:text-[#d4a373] transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button
              className="text-[var(--color-text-secondary)] hover:text-[#d4a373] transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 relative z-10 ${isSession ? 'p-0' : 'p-6 pb-28'}`}>
        {children}
      </main>

      <nav className={`fixed bottom-0 w-full z-20 pb-[env(safe-area-inset-bottom)] ${isSession || isSessionFeedback ? 'hidden' : ''}`}>
        <div className="absolute inset-0 bg-[#0d0806]/80 backdrop-blur-xl border-t border-white/5" />
        <div className="relative flex justify-around items-center px-4 py-4 max-w-md mx-auto">
          <Link href="/app" className="flex flex-col items-center group w-16">
            <div className={`transition-all duration-300 ${isHome ? 'text-[#d4a373] scale-110' : 'text-white/40 group-hover:text-white/70'}`}>
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isHome ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className={`text-[10px] tracking-wide transition-colors ${isHome ? 'text-[#d4a373] font-medium' : 'text-white/40 group-hover:text-white/70'}`}>Início</span>
          </Link>
          
          <Link href="/app/sessao/nova" className="flex flex-col items-center group w-16">
            <div className={`transition-all duration-300 ${isSession ? 'text-[#d4a373] scale-110' : 'text-white/40 group-hover:text-white/70'}`}>
              <svg className="w-6 h-6 mb-1" fill={isSession ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSession ? 0 : 1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`text-[10px] tracking-wide transition-colors ${isSession ? 'text-[#d4a373] font-medium' : 'text-white/40 group-hover:text-white/70'}`}>Sessão</span>
          </Link>
          
          <Link href="/app/decks" className="flex flex-col items-center group w-16">
            <div className={`transition-all duration-300 ${isDecks ? 'text-[#d4a373] scale-110' : 'text-white/40 group-hover:text-white/70'}`}>
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={isDecks ? 2 : 1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isDecks ? 2 : 1.5} d="M7 8h10M7 12h10M7 16h10" />
              </svg>
            </div>
            <span className={`text-[10px] tracking-wide transition-colors ${isDecks ? 'text-[#d4a373] font-medium' : 'text-white/40 group-hover:text-white/70'}`}>Decks</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
