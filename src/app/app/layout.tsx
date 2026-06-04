"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Settings, Home, Play, LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background-primary)] sticky top-0 z-10">
        <div className="text-xl font-light tracking-widest">DERIVA</div>
        <div className="flex gap-4">
          <Link href="/app/configuracoes" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          <button
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] z-10">
        <div className="flex justify-around py-4">
          <Link href="/app" className="flex flex-col items-center text-[var(--color-text-secondary)] hover:text-[var(--color-copper)] transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Início</span>
          </Link>
          <Link href="/app/sessao/nova" className="flex flex-col items-center text-[var(--color-text-secondary)] hover:text-[var(--color-copper)] transition-colors">
            <Play className="w-6 h-6 mb-1" />
            <span className="text-xs">Sessão</span>
          </Link>
          <Link href="/app/decks" className="flex flex-col items-center text-[var(--color-text-secondary)] hover:text-[var(--color-copper)] transition-colors">
            <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <path d="M6 2l12 0"/>
            </svg>
            <span className="text-xs">Decks</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
