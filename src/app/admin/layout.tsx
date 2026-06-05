import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)] sticky top-0 z-10">
        <div className="text-sm font-medium tracking-widest text-[var(--color-copper)]">ADMIN</div>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Dashboard</Link>
          <Link href="/admin/cartas" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Cartas</Link>
          <Link href="/admin/decks" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Decks</Link>
          <Link href="/admin/videos" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Vídeos</Link>
          <Link href="/admin/musicas" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Músicas</Link>
        </nav>
        <div className="ml-auto">
          <Link href="/app" className="text-xs text-[var(--color-text-secondary)] hover:underline">← App</Link>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
