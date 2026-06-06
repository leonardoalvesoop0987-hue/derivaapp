import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light">Admin — Deriva</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/cartas" className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/50 transition-colors">
          <h2 className="font-medium mb-1">Cartas</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Ativar, desativar e editar cartas do deck padrão.</p>
        </Link>
        <Link href="/admin/videos" className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/50 transition-colors">
          <h2 className="font-medium mb-1">Vídeos</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Gerenciar e rotular vídeos para cartas Roxas.</p>
        </Link>
        <Link href="/admin/musicas" className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/50 transition-colors">
          <h2 className="font-medium mb-1">Músicas</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Gerenciar trilhas da sessão.</p>
        </Link>
        <Link href="/admin/settings/voice" className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/50 transition-colors">
          <h2 className="font-medium mb-1">Voz & Narração</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Gerenciar TTS, testes e áudios gerados.</p>
        </Link>
      </div>
    </div>
  );
}
