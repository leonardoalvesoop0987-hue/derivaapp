"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AlignmentStatus {
  id: string;
  username: string;
  womanVersion: number;
  manVersion: number;
  womanLastDate: string | null;
  manLastDate: string | null;
  status: string;
  created_at: string;
}

export default function AdminAlinhamentosPage() {
  const [alignments, setAlignments] = useState<AlignmentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/alignment")
      .then(r => r.json())
      .then(d => {
        if (d.alignments) setAlignments(d.alignments);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const formatDate = (d: string | null) => d ? format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light tracking-wide text-white">Alinhamentos (Contas Casal)</h1>
      </div>

      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-background-secondary)]">
              <tr>
                <th className="px-6 py-4 font-medium">Conta / Username</th>
                <th className="px-6 py-4 font-medium">Feminina (V)</th>
                <th className="px-6 py-4 font-medium">Masculina (V)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">Carregando...</td></tr>
              ) : alignments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">Nenhum registro encontrado.</td></tr>
              ) : (
                alignments.map(item => (
                  <tr key={item.id} className="hover:bg-[var(--color-background-secondary)] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.username}</td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {item.womanVersion > 0 ? `v${item.womanVersion} (${formatDate(item.womanLastDate)})` : "-"}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {item.manVersion > 0 ? `v${item.manVersion} (${formatDate(item.manLastDate)})` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "AMBOS_RESPONDERAM" && <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">Completo</span>}
                      {item.status === "APENAS_FEMININA" && <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full text-xs">Só Ela</span>}
                      {item.status === "APENAS_MASCULINA" && <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full text-xs">Só Ele</span>}
                      {item.status === "NENHUM_RESPONDEU" && <span className="bg-[var(--color-border)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full text-xs">Pendente</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/alinhamentos/${item.id}`} className="text-[var(--color-copper)] hover:text-white transition-colors">
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
