"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  role: "WOMAN" | "MAN";
  has_responded: boolean;
  last_version: number;
}

export default function AlinhamentoIndexPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alignment/status")
      .then(res => res.json())
      .then(data => {
        if (data.participants) setParticipants(data.participants);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</div>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-8 pb-20">
      <h1 className="text-2xl font-light tracking-wide text-center mt-8">Alinhamento Privado</h1>
      
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl border border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Este formulário é <strong>individual e privado</strong>. Seu parceiro ou parceira não verá suas respostas.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Elas servem para alinhar limites, interesses e cuidados dentro da experiência Deriva. As respostas podem influenciar adaptações no app, nas cartas, nos vídeos e nas recomendações para o casal.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed text-[var(--color-copper)]">
          Apenas a administração poderá consultar as respostas, sem exibir seu nome, apenas sexo, perguntas, respostas, data e versão.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-center mb-4">Escolha quem vai responder agora:</h2>
        <p className="text-xs text-center text-[var(--color-text-secondary)] mb-6">
          As respostas de uma pessoa não ficam visíveis para a outra.
        </p>

        {participants.map(p => (
          <button
            key={p.id}
            onClick={() => router.push(`/app/alinhamento/${p.id}`)}
            className="w-full flex items-center justify-between p-5 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-copper)] transition-colors rounded-xl"
          >
            <div className="text-left">
              <div className="font-medium text-white text-lg">{p.name}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                {p.role === "WOMAN" ? "Pessoa feminina" : "Pessoa masculina"}
              </div>
            </div>
            <div className="text-right">
              {p.has_responded ? (
                <span className="text-xs bg-[var(--color-copper)] text-white px-2 py-1 rounded-full">
                  Respondido (v{p.last_version})
                </span>
              ) : (
                <span className="text-xs border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">
                  Pendente
                </span>
              )}
            </div>
          </button>
        ))}
        {participants.length === 0 && (
          <div className="text-center text-sm text-[var(--color-text-secondary)]">Nenhum participante configurado nesta conta.</div>
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
