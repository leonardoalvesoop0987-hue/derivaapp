"use client";

export function LpFooter() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--color-border)] bg-[var(--color-background-primary)] text-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-serif text-white tracking-widest uppercase">Deriva</span>
          <p className="text-[var(--color-text-secondary)]/60 text-xs mt-2 font-light tracking-wide">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        <div className="text-center md:text-right text-[var(--color-text-secondary)]/60 text-xs font-light">
          <p className="font-medium text-white/50 uppercase tracking-[0.2em] mb-2">🔞 Produto destinado a maiores de 18 anos</p>
          <p>O uso do aplicativo requer consentimento mútuo e clareza nas intenções.</p>
        </div>
      </div>
    </footer>
  );
}
