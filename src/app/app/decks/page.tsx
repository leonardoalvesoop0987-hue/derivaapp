"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Deck {
  id: string;
  name: string;
  _count: { cards: number };
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/decks")
      .then((r) => r.json())
      .then((d: { decks: Deck[] }) => setDecks(d.decks ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function createDeck(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const d: { deck: Deck } = await res.json();
      setDecks((prev) => [d.deck, ...prev]);
      setName("");
      setShowForm(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Meus decks</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-sm text-[var(--color-copper)] hover:underline"
        >
          <Plus className="w-4 h-4" />
          Novo deck
        </button>
      </div>

      {showForm && (
        <form onSubmit={createDeck} className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do deck"
            required
            className="flex-1 px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-copper)] text-white"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-[var(--color-wine)] rounded-xl text-sm hover:bg-[var(--color-red-deep)] transition-colors disabled:opacity-60"
          >
            Criar
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando...</div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)] text-sm">
          <p className="mb-4">Nenhum deck personalizado ainda.</p>
          <button onClick={() => setShowForm(true)} className="text-[var(--color-copper)] hover:underline">
            Criar o primeiro
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/app/decks/${deck.id}`}
              className="block bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/30 transition-colors"
            >
              <div className="font-medium">{deck.name}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                {deck._count.cards} carta{deck._count.cards !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
