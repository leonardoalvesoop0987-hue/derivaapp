"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ParticipantStatus {
  has_responded: boolean;
  last_version: number;
}

interface Participant {
  id: string;
  name: string;
  role: "WOMAN" | "MAN";
  standard: ParticipantStatus;
  dark: ParticipantStatus;
}

export default function AlinhamentoIndexPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDarkUnlocked, setIsDarkUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alignment/status")
      .then(res => res.json())
      .then(data => {
        if (data.participants) setParticipants(data.participants);
        setIsDarkUnlocked(!!data.is_dark_unlocked);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</div>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-8 pb-20">
      <h1 className="text-2xl font-light tracking-wide text-center mt-8">Alinhamento do Casal</h1>
      
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl border border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Estes formulários são <strong>individuais e privados</strong>. Seu parceiro ou parceira não verá suas respostas.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Elas servem para alinhar limites, interesses e cuidados dentro da experiência Deriva. As respostas podem influenciar adaptações no app, nas cartas, nos vídeos e nas recomendações para o casal.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed text-[var(--color-copper)]">
          Apenas a administração poderá consultar as respostas, sem exibir seu nome, apenas sexo, perguntas, respostas, data e versão.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-center mb-2">Alinhamento padrão</h2>
        <p className="text-xs text-center text-[var(--color-text-secondary)] mb-4">
          Para todo casal. Trata de desejos, vergonha e progressão geral.
        </p>

        {participants.map(p => (
          <button
            key={p.id + '-std'}
            onClick={() => router.push(`/app/alinhamento/${p.id}?type=standard`)}
            className="w-full flex items-center justify-between p-5 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-copper)] transition-colors rounded-xl"
          >
            <div className="text-left">
              <div className="font-medium text-white text-lg">{p.name}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                {p.role === "WOMAN" ? "Pessoa feminina" : "Pessoa masculina"}
              </div>
            </div>
            <div className="text-right">
              {p.standard?.has_responded ? (
                <span className="text-xs bg-[var(--color-copper)] text-white px-2 py-1 rounded-full">
                  Respondido (v{p.standard.last_version})
                </span>
              ) : (
                <span className="text-xs border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">
                  Pendente
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <h2 className="text-lg font-medium text-center mb-2">Alinhamento avançado<br/><span className="text-sm text-[var(--color-copper)]">Tons mais escuros</span></h2>
        <p className="text-xs text-center text-[var(--color-text-secondary)] mb-4">
          Focado em imaginação com terceiros, ciúme consentido e limites.
        </p>

        {!isDarkUnlocked ? (
          <div className="text-center p-6 bg-[var(--color-background-secondary)] rounded-xl border border-[var(--color-border)] border-dashed">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Disponível após desbloquear <strong>Tons mais escuros</strong> nas configurações.
            </p>
          </div>
        ) : (
          participants.map(p => (
            <button
              key={p.id + '-dark'}
              onClick={() => router.push(`/app/alinhamento/${p.id}?type=dark`)}
              className="w-full flex items-center justify-between p-5 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-copper)] transition-colors rounded-xl"
            >
              <div className="text-left">
                <div className="font-medium text-white text-lg">{p.name}</div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {p.role === "WOMAN" ? "Pessoa feminina" : "Pessoa masculina"}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                {p.dark?.has_responded ? (
                  <>
                    <span className="text-xs bg-[var(--color-copper)] text-white px-2 py-1 rounded-full">
                      Respondido (v{p.dark.last_version})
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">Responder novamente</span>
                  </>
                ) : (
                  <span className="text-xs border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">
                    Responder
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/app/configuracoes')}
          className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
        >
          Voltar às configurações
        </button>
      </div>
    </div>
  );
}
