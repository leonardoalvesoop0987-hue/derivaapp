"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminCardModal, AdminCard } from "@/components/AdminCardModal";
import { Search, Eye, PowerOff, Power } from "lucide-react";

const CATEGORIES = ["TODAS", "AZUL", "DERIVA", "ROSA", "ROXO", "VERMELHO", "PRETO"];

export default function AdminCartasPage() {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("TODAS");
  
  const [selectedCard, setSelectedCard] = useState<AdminCard | null>(null);

  useEffect(() => {
    fetch("/api/admin/cards")
      .then((r) => r.json())
      .then((d: { cards: AdminCard[] }) => setCards(d.cards ?? []))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const countsMap: Record<string, number> = { TODAS: cards.length };
    CATEGORIES.forEach(c => {
      if (c !== "TODAS") countsMap[c] = cards.filter(card => card.category === c).length;
    });
    return countsMap;
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchSearch = card.title.toLowerCase().includes(search.toLowerCase()) || card.body.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeTab === "TODAS" || card.category === activeTab;
      return matchSearch && matchCat;
    });
  }, [cards, search, activeTab]);

  const handleSave = (updatedCard: AdminCard) => {
    setCards((prev) => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const handleToggleActive = async (card: AdminCard) => {
    const res = await fetch("/api/admin/cards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id, is_active: !card.is_active }),
    });
    if (res.ok) {
      const { card: updated } = await res.json();
      handleSave(updated);
    } else {
      alert("Erro ao alterar o status da carta.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-light mb-2">Cartas</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Gerencie o deck base, ajuste textos, categorias, intensidade e disponibilidade das {cards.length} cartas totais do sistema.
        </p>
      </div>

      {/* Categorias / Dashboard */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex flex-col px-4 py-3 rounded-xl border transition-all ${
              activeTab === cat 
                ? "border-[var(--color-copper)] bg-[var(--color-copper)]/10" 
                : "border-[var(--color-border)] bg-[var(--color-background-secondary)] hover:border-[var(--color-text-secondary)]"
            }`}
          >
            <span className="text-xs font-medium tracking-wide mb-1">{cat === "TODAS" ? "Todas" : cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
            <span className={`text-xl font-light ${activeTab === cat ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>
              {counts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[var(--color-text-secondary)]" />
        </div>
        <input
          type="text"
          placeholder="Buscar por título ou trecho..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--color-copper)] transition-colors"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse py-10">Carregando cartas do banco de dados...</div>
      ) : (
        <div className="space-y-3">
          {filteredCards.length === 0 ? (
            <div className="text-[var(--color-text-secondary)] text-sm py-10">Nenhuma carta encontrada.</div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  card.is_active 
                    ? "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text-secondary)]/50" 
                    : "border-red-900/30 bg-[var(--color-background-secondary)] opacity-60"
                }`}
              >
                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: getCategoryColor(card.category) }} />
                
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-secondary)]">
                      {card.category}
                    </span>
                    <span className="text-[10px] bg-[var(--color-background-secondary)] px-2 py-0.5 rounded text-[var(--color-text-secondary)]">
                      {card.intensity}
                    </span>
                    {!card.is_active && (
                      <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded border border-red-800">
                        INATIVA
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.stage && <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-[var(--color-text-secondary)] border border-white/10">Estágio: {card.stage}</span>}
                    {card.primary_tag && <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-[var(--color-text-secondary)] border border-white/10">Tag: {card.primary_tag}</span>}
                    {card.erotic_function && <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-[var(--color-text-secondary)] border border-white/10">Func: {card.erotic_function}</span>}
                  </div>
                  <div className="text-base font-medium truncate mb-1">{card.title}</div>
                  <div className="text-xs text-[var(--color-text-secondary)] truncate">
                    {card.body}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-white transition-colors flex items-center gap-2"
                    title="Ver Detalhes"
                  >
                    <Eye size={16} />
                    <span className="text-xs hidden sm:inline">Ver / Editar</span>
                  </button>
                  <button
                    onClick={() => handleToggleActive(card)}
                    className={`p-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
                      card.is_active 
                        ? "border-red-900/30 text-red-400 hover:bg-red-900/20" 
                        : "border-green-900/30 text-green-400 hover:bg-green-900/20"
                    }`}
                    title={card.is_active ? "Desativar Carta" : "Ativar Carta"}
                  >
                    {card.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                    <span className="text-xs hidden sm:inline">{card.is_active ? "Desativar" : "Ativar"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AdminCardModal 
        key={selectedCard?.id || "empty"}
        card={selectedCard!} 
        isOpen={selectedCard !== null} 
        onClose={() => setSelectedCard(null)} 
        onSave={handleSave} 
      />
    </div>
  );
}

function getCategoryColor(category: string) {
  switch (category) {
    case "AZUL": return "#3b82f6";
    case "DERIVA": return "#f59e0b";
    case "ROSA": return "#ec4899";
    case "ROXO": return "#8b5cf6";
    case "VERMELHO": return "#ef4444";
    case "PRETO": return "#1f2937";
    default: return "#4b5563";
  }
}
