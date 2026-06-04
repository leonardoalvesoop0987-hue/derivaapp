"use client";

import { useEffect, useState, useCallback } from "react";

interface Card {
  id: string;
  title: string;
  category: string;
  intensity: string;
  is_active: boolean;
  deck: { name: string; type: string };
}

export default function AdminCartasPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/cards")
      .then((r) => r.json())
      .then((d: { cards: Card[] }) => setCards(d.cards ?? []))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(async (id: string, is_active: boolean) => {
    const res = await fetch("/api/admin/cards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !is_active }),
    });
    const d: { card: Card } = await res.json();
    setCards((prev) => prev.map((c) => c.id === d.card.id ? { ...c, is_active: d.card.is_active } : c));
  }, []);

  const filtered = cards.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-light flex-1">Cartas</h1>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--color-copper)] w-48"
        />
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((card) => (
            <div
              key={card.id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${card.is_active ? "border-[var(--color-border)] bg-[var(--color-card)]" : "border-[var(--color-border)] bg-[var(--color-card)] opacity-50"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">
                  {card.deck.type === "SYSTEM" ? "Sistema" : card.deck.name} · {card.category} · {card.intensity}
                </div>
                <div className="text-sm font-medium truncate">{card.title}</div>
              </div>
              <button
                onClick={() => toggle(card.id, card.is_active)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors flex-shrink-0 ${card.is_active ? "border-green-700/50 text-green-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-700/50" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-green-400 hover:border-green-700/50"}`}
              >
                {card.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
