"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Deck {
  id: string;
  name: string;
  type: string;
  description: string | null;
  requires_couple_unlock: boolean;
  unlock_group_key: string | null;
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

  const officialDecks = decks.filter(d => d.type === "SYSTEM" || d.type === "OFFICIAL");
  const customDecks = decks.filter(d => d.type === "COUPLE_CUSTOM" || d.type === "CUSTOM");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light">Decks Oficiais</h2>
        </div>
        
        {loading ? (
          <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando...</div>
        ) : officialDecks.length === 0 ? (
          <div className="text-[var(--color-text-secondary)] text-sm">Nenhum deck oficial disponível.</div>
        ) : (
          <div className="space-y-3">
            {officialDecks.map((deck) => (
              <Link
                key={deck.id}
                href={`/app/decks/${deck.id}`}
                className="block bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium flex items-center gap-2">
                    {deck.name}
                    {deck.requires_couple_unlock && <span className="text-[10px] bg-[var(--color-wine)]/30 text-[#ff8f8f] px-2 py-0.5 rounded-full uppercase">Bloqueado</span>}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-background-secondary)] px-2 py-1 rounded-md">
                    {deck._count.cards} cartas
                  </div>
                </div>
                {deck.description && (
                  <div className="text-sm text-[var(--color-text-secondary)] mt-2">
                    {deck.description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light">Meus Decks (Custom)</h2>
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
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse mt-4">Carregando...</div>
      ) : customDecks.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-background-secondary)] rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm mt-4">
          <p className="mb-3">Vocês ainda não criaram nenhum deck.</p>
          <button onClick={() => setShowForm(true)} className="text-[var(--color-copper)] hover:underline">
            Criar o primeiro
          </button>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {customDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/app/decks/${deck.id}`}
              className="block bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-copper)]/30 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{deck.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {deck._count.cards} cartas
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
