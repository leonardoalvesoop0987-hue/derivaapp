"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminAlinhamentoDetailPage({ params }: { params: Promise<{ coupleId: string }> }) {
  const { coupleId } = use(params);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/alignment/${coupleId}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, [coupleId]);

  if (loading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</div>;
  if (!data || !data.couple) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Não encontrado.</div>;

  const standardWomanResponses = data.responses.filter((r: unknown) => r.role === "WOMAN" && r.form_type === "STANDARD_ALIGNMENT");
  const standardManResponses = data.responses.filter((r: unknown) => r.role === "MAN" && r.form_type === "STANDARD_ALIGNMENT");
  const darkWomanResponses = data.responses.filter((r: unknown) => r.role === "WOMAN" && r.form_type === "DARK_ALIGNMENT");
  const darkManResponses = data.responses.filter((r: unknown) => r.role === "MAN" && r.form_type === "DARK_ALIGNMENT");

  const renderResponse = (resp: unknown) => (
    <div key={resp.id} className="bg-[var(--color-background-secondary)] p-6 rounded-xl border border-[var(--color-border)] mb-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--color-border)]">
        <div>
          <span className="text-lg font-medium text-white mr-3">
            {resp.role === "WOMAN" ? "Pessoa Feminina" : "Pessoa Masculina"}
          </span>
          <span className="text-sm bg-[var(--color-copper)]/20 text-[var(--color-copper)] px-2 py-1 rounded">Versão {resp.version}</span>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          {resp.completed_at ? format(new Date(resp.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "-"}
        </div>
      </div>
      
      <div className="space-y-6">
        {resp.answers.answers.map((a: unknown, i: number) => (
          <div key={i}>
            <div className="text-sm text-[var(--color-text-secondary)] mb-1 font-medium">{a.questionId} - {a.question}</div>
            <div className="text-base text-white bg-[var(--color-card)] p-3 rounded-lg border border-[var(--color-border)]">
              {Array.isArray(a.answer) ? a.answer.join(", ") : 
               (typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer || "Nenhuma resposta"))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/alinhamentos" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
          &larr; Voltar
        </Link>
        <h1 className="text-2xl font-light tracking-wide text-white">Respostas da Conta: {data.couple.username}</h1>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-medium text-white border-b border-[var(--color-border)] pb-2">Alinhamento Padrão</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-6 text-[var(--color-copper)] border-b border-[var(--color-copper)]/30 pb-2">Feminino</h3>
            {standardWomanResponses.length === 0 ? (
              <p className="text-sm text-[var(--color-text-secondary)]">Nenhuma resposta registrada.</p>
            ) : (
              standardWomanResponses.map(renderResponse)
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium mb-6 text-[var(--color-copper)] border-b border-[var(--color-copper)]/30 pb-2">Masculino</h3>
            {standardManResponses.length === 0 ? (
              <p className="text-sm text-[var(--color-text-secondary)]">Nenhuma resposta registrada.</p>
            ) : (
              standardManResponses.map(renderResponse)
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-medium text-[var(--color-wine)] border-b border-[var(--color-border)] pb-2">Tons Mais Escuros (Avançado)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-6 text-[var(--color-wine)]/80 border-b border-[var(--color-wine)]/30 pb-2">Feminino</h3>
            {darkWomanResponses.length === 0 ? (
              <p className="text-sm text-[var(--color-text-secondary)]">Nenhuma resposta registrada.</p>
            ) : (
              darkWomanResponses.map(renderResponse)
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium mb-6 text-[var(--color-wine)]/80 border-b border-[var(--color-wine)]/30 pb-2">Masculino</h3>
            {darkManResponses.length === 0 ? (
              <p className="text-sm text-[var(--color-text-secondary)]">Nenhuma resposta registrada.</p>
            ) : (
              darkManResponses.map(renderResponse)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
