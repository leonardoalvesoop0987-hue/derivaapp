"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Plus, ToggleLeft, ToggleRight, ArrowLeft } from "lucide-react";

interface Card {
  id: string;
  title: string;
  category: string;
  intensity: string;
  is_active: boolean;
  is_invertible: boolean;
  requires_video: boolean;
}

interface Deck { id: string; name: string; }

type NewCard = {
  title: string;
  body: string;
  category: string;
  intensity: string;
  is_invertible: boolean;
  requires_video: boolean;
  receiver_rule: string;
};

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCard, setNewCard] = useState<NewCard>({
    title: "", body: "", category: "AZUL", intensity: "LEVE",
    is_invertible: false, requires_video: false, receiver_rule: "NONE",
  });

  useEffect(() => {
    fetch(`/api/decks/${id}`)
      .then((r) => r.json())
      .then((d: { deck: Deck; cards: Card[] }) => { setDeck(d.deck); setCards(d.cards ?? []); })
      .finally(() => setLoading(false));
  }, [id]);

  async function addCard(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/decks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const d: { card: Card } = await res.json();
      setCards((prev) => [...prev, d.card]);
      setNewCard({ title: "", body: "", category: "AZUL", intensity: "LEVE", is_invertible: false, requires_video: false, receiver_rule: "NONE" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleCard(cardId: string, is_active: boolean) {
    await fetch(`/api/decks/${id}/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !is_active }),
    });
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, is_active: !is_active } : c));
  }

  if (loading) return <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[var(--color-text-secondary)] hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-light flex-1">{deck?.name}</h2>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1 text-sm text-[var(--color-copper)]">
          <Plus className="w-4 h-4" /> Nova carta
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCard} className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] space-y-4">
          <h3 className="font-medium text-sm">Nova carta</h3>
          <input
            placeholder="Título"
            value={newCard.title}
            onChange={(e) => setNewCard((p) => ({ ...p, title: e.target.value }))}
            required
            className="w-full px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-copper)] text-white"
          />
          <textarea
            placeholder="Texto da carta"
            value={newCard.body}
            onChange={(e) => setNewCard((p) => ({ ...p, body: e.target.value }))}
            required
            rows={4}
            className="w-full px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-copper)] text-white resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Categoria</label>
              <select
                value={newCard.category}
                onChange={(e) => setNewCard((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-white"
              >
                {["AZUL","DERIVA","ROSA","ROXO","VERMELHO","PRETO"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Intensidade</label>
              <select
                value={newCard.intensity}
                onChange={(e) => setNewCard((p) => ({ ...p, intensity: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-white"
              >
                {["LEVE","QUENTE","INTENSO","PICO"].map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newCard.is_invertible} onChange={(e) => setNewCard((p) => ({ ...p, is_invertible: e.target.checked }))} />
              Invertível
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newCard.requires_video} onChange={(e) => setNewCard((p) => ({ ...p, requires_video: e.target.checked }))} />
              Requer vídeo
            </label>
          </div>
          <button type="submit" disabled={saving} className="w-full py-2 bg-[var(--color-wine)] rounded-xl text-sm hover:bg-[var(--color-red-deep)] transition-colors disabled:opacity-60">
            {saving ? "Salvando..." : "Adicionar carta"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className={`flex items-start gap-3 p-4 rounded-2xl border ${card.is_active ? "border-[var(--color-border)]" : "border-[var(--color-border)] opacity-50"} bg-[var(--color-card)]`}>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">{card.category} · {card.intensity}</div>
              <div className="font-medium text-sm truncate">{card.title}</div>
            </div>
            <button onClick={() => toggleCard(card.id, card.is_active)} className="text-[var(--color-text-secondary)] hover:text-white transition-colors flex-shrink-0">
              {card.is_active ? <ToggleRight className="w-6 h-6 text-[var(--color-copper)]" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-secondary)] text-sm">
            Nenhuma carta ainda. Adicione a primeira carta ao deck.
          </div>
        )}
      </div>
    </div>
  );
}
