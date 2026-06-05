import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AcessoRestrito() {
  return (
    <div className="flex flex-col h-[70vh] items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-20 h-20 bg-[var(--color-wine)]/20 rounded-full flex items-center justify-center mb-4 border border-[var(--color-wine)]/50">
        <ShieldAlert className="w-10 h-10 text-[var(--color-copper)]" />
      </div>
      <h2 className="text-3xl font-light">Acesso Restrito</h2>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8 max-w-[250px] mx-auto leading-relaxed">
        Você não tem permissão para acessar esta área. Se acredita que isto é um erro, entre em contato com o suporte.
      </p>
      <Link
        href="/app"
        className="bg-[var(--color-wine)] px-8 py-4 rounded-full text-white font-medium hover:bg-[var(--color-red-deep)] transition-colors shadow-lg shadow-[var(--color-wine)]/20"
      >
        Voltar para o App
      </Link>
    </div>
  );
}
