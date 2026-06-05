"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, ArrowLeft } from "lucide-react";

interface Card {
  id: string;
  title: string;
  category: string;
  intensity: string;
}

interface Deck { id: string; name: string; type: string; }

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/decks/${id}`)
      .then((r) => r.json())
      .then((d: { deck: Deck; cards: Card[] }) => { 
        setDeck(d.deck); 
        setCards(d.cards ?? []); 
        setSelectedCardIds(new Set((d.cards ?? []).map(c => c.id)));
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isEditing && allCards.length === 0) {
      fetch('/api/cards')
        .then(r => r.json())
        .then((d: { cards: Card[] }) => setAllCards(d.cards ?? []));
    }
  }, [isEditing, allCards.length]);

  async function saveSelection() {
    setSaving(true);
    try {
      const res = await fetch(`/api/decks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds: Array.from(selectedCardIds) }),
      });
      if (res.ok) {
        setIsEditing(false);
        // Refresh cards
        fetch(`/api/decks/${id}`)
          .then((r) => r.json())
          .then((d: { deck: Deck; cards: Card[] }) => { 
            setDeck(d.deck); 
            setCards(d.cards ?? []); 
          });
      }
    } finally {
      setSaving(false);
    }
  }

  function toggleCard(cardId: string) {
    const newSet = new Set(selectedCardIds);
    if (newSet.has(cardId)) newSet.delete(cardId);
    else newSet.add(cardId);
    setSelectedCardIds(newSet);
  }

  if (loading) return <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[var(--color-text-secondary)] hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-light flex-1">{deck?.name}</h2>
        {deck?.type === "COUPLE_CUSTOM" && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm text-[var(--color-copper)]">
            Editar Seleção
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">{card.category} · {card.intensity}</div>
                <div className="font-medium text-sm truncate">{card.title}</div>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-secondary)] text-sm bg-[var(--color-background-secondary)] rounded-2xl border border-[var(--color-border)]">
              Este deck ainda não possui cartas.
              <br/>
              <button onClick={() => setIsEditing(true)} className="text-[var(--color-copper)] hover:underline mt-2">Selecionar Cartas</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Selecione as Cartas ({selectedCardIds.size})</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="text-sm text-[var(--color-text-secondary)] hover:text-white px-3 py-1">Cancelar</button>
              <button onClick={saveSelection} disabled={saving} className="text-sm bg-[var(--color-copper)] hover:bg-[#b07355] text-white px-3 py-1 rounded-md transition-colors disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {allCards.length === 0 ? (
              <div className="text-xs text-[var(--color-text-secondary)]">Carregando catálogo de cartas...</div>
            ) : (
              allCards.map((card) => (
                <div 
                  key={card.id} 
                  onClick={() => toggleCard(card.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedCardIds.has(card.id) ? "border-[var(--color-copper)] bg-[var(--color-copper)]/10" : "border-[var(--color-border)] bg-[var(--color-background-secondary)] hover:border-white/20"
                  }`}
                >
                  <div className="mt-0.5 text-[var(--color-copper)]">
                    {selectedCardIds.has(card.id) ? <CheckSquare size={18} /> : <Square size={18} className="text-[var(--color-text-secondary)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">{card.category} · {card.intensity}</div>
                    <div className="font-medium text-sm">{card.title}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
