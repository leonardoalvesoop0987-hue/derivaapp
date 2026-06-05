"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AdminDeckModal, AdminDeck } from "@/components/AdminDeckModal";

type Deck = AdminDeck & {
  _count: { cards: number };
};

export default function AdminDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<AdminDeck | null>(null);

  useEffect(() => {
    fetch("/api/admin/decks")
      .then((res) => res.json())
      .then((data) => {
        if (data.decks) setDecks(data.decks);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Carregando decks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Gerenciamento de Decks</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Controle os decks oficiais e do sistema (Padrão, Estreia, Tons Mais Escuros).
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-[var(--color-copper)] hover:bg-[#b07355] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          onClick={() => alert("Criação de novos decks em breve.")}
        >
          <Plus size={16} />
          Novo Deck Oficial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map(deck => (
          <div key={deck.id} className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-copper)] transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{deck.name}</h3>
              {deck.is_active ? (
                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">Ativo</span>
              ) : (
                <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">Inativo</span>
              )}
            </div>
            
            <div className="text-xs text-[var(--color-text-secondary)] mb-4">
              <p>Slug: <span className="font-mono text-white">{deck.slug || "Nenhum"}</span></p>
              <p>Tipo: <span className="text-white">{deck.type}</span></p>
            </div>

            {deck.requires_couple_unlock && (
              <div className="text-xs bg-[var(--color-wine)]/20 text-[#ff8f8f] p-2 rounded mb-4 border border-[var(--color-wine)]/30">
                Bloqueado ({deck.unlock_group_key})
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {deck._count?.cards || 0} cartas
              </span>
              <button className="text-xs text-[var(--color-copper)] hover:underline" onClick={() => setSelectedDeck(deck as AdminDeck)}>
                Editar
              </button>
            </div>
          </div>
        ))}
        {decks.length === 0 && (
          <div className="col-span-full p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-background-secondary)] rounded-2xl border border-[var(--color-border)]">
            Nenhum deck encontrado.
          </div>
        )}
      </div>

      {selectedDeck && (
        <AdminDeckModal
          deck={selectedDeck}
          isOpen={true}
          onClose={() => setSelectedDeck(null)}
          onSave={(updatedDeck) => {
            setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
          }}
        />
      )}
    </div>
  );
}
