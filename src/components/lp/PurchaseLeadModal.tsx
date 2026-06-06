import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface PurchaseLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseLeadModal({ isOpen, onClose }: PurchaseLeadModalProps) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [age, setAge] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setError("");
      setEmail("");
      setWhatsapp("");
      setAge("");
      setIsAdult(false);
      setCountdown(10);
    }, 300);
  };

  // Success countdown
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, countdown]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !whatsapp || !age) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setError("Você precisa ter 18 anos ou mais.");
      return;
    }

    if (!isAdult) {
      setError("Você deve confirmar que tem 18 anos ou mais.");
      return;
    }

    // Simulate API call success
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-text-secondary)] hover:text-white transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-[var(--color-copper)] mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-white mb-4">Tudo certo.</h3>
              <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                O Deriva entrará em contato com você para enviar a oferta e o link de pagamento.
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]/60 mb-8">
                Esta janela será fechada automaticamente em {countdown} segundos.
              </p>
              <button 
                onClick={handleClose}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-medium py-3 rounded-xl transition-colors border border-[var(--color-border)]"
              >
                Fechar agora
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-2 pr-6 leading-tight">
                Receba a oferta do Deriva
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
                Informe seus dados para receber o link de pagamento e a oferta de acesso ao app + versão física.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-[var(--color-red-deep)]/10 border border-[var(--color-red-deep)]/20 text-[var(--color-red-deep)] text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5 ml-1">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-copper)] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5 ml-1">WhatsApp</label>
                    <input 
                      type="tel" 
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="(DD) 90000-0000"
                      className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-copper)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Idade</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="Sua idade"
                      min="1"
                      className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-copper)] transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 mt-6 mb-8 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={isAdult}
                      onChange={e => setIsAdult(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border border-[var(--color-border)] rounded-md bg-[var(--color-background-secondary)] checked:bg-[var(--color-copper)] checked:border-[var(--color-copper)] transition-colors cursor-pointer"
                    />
                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-white transition-colors select-none">
                    Confirmo que tenho 18 anos ou mais.
                  </span>
                </label>

                <button 
                  type="submit"
                  className="w-full bg-[var(--color-copper)] hover:bg-[var(--color-copper)]/90 text-[var(--color-background-primary)] font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-[var(--color-copper)]/20"
                >
                  Receber oferta
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
