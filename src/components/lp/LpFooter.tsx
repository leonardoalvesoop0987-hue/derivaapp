"use client";

export function LpFooter() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-background-primary text-center">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <span className="text-lg font-bold text-text-primary tracking-widest uppercase">Deriva</span>
          <p className="text-text-secondary text-sm mt-1">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        <div className="text-right text-text-secondary/60 text-xs">
          <p className="font-semibold uppercase tracking-wider mb-1">🔞 Produto destinado a maiores de 18 anos</p>
          <p>O uso do aplicativo requer consentimento mútuo e clareza nas intenções.</p>
        </div>
      </div>
    </footer>
  );
}
