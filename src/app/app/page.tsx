import Link from "next/link";
import { Play } from "lucide-react";

export default function AppPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero / Start */}
      <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-red-deep)] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Play className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-light mb-2">Pronto para iniciar?</h2>
        <p className="text-[var(--color-text-secondary)] mb-8 text-sm max-w-[80%]">
          O Deriva conduz a sessão por cartas, com progressão, surpresa e liberdade para parar ou pular a qualquer momento.
        </p>
        <Link 
          href="/app/sessao/nova" 
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          Iniciar Sessão
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-secondary)] mb-1">Última sessão</div>
          <div className="font-medium text-sm">Há 3 dias</div>
        </div>
        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-secondary)] mb-1">Frequência ideal</div>
          <div className="font-medium text-sm text-[var(--color-copper)]">Até 2x semana</div>
        </div>
      </div>

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)]">
        <h3 className="font-medium mb-2">Consentimento</h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Lembre-se: Verde = continua, Amarelo = diminui, Vermelho = para imediatamente. Pule cartas sem precisar justificar.
        </p>
      </div>
      
    </div>
  );
}
