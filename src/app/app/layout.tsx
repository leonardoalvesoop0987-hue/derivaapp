"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Settings } from "lucide-react";
import { GrainOverlay } from "@/components/lp/GrainOverlay";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === "/app";
  const isSession = pathname.startsWith("/app/sessao/") && !pathname.endsWith("/feedback");
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
          <Link href="/app/configuracoes" className="text-[var(--color-text-secondary)] hover:text-[#d4a373] transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </header>
      )}

      <main className={`flex-1 relative z-10 ${isSession ? 'p-0' : 'p-6'}`}>
        {children}
      </main>
    </div>
  );
}
