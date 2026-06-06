"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AdminCard } from "@/components/AdminCardModal";

const CATEGORIES = ["AZUL", "DERIVA", "ROSA", "ROXO", "VERMELHO", "PRETO", "TONS MAIS ESCUROS"];

function EditorialCard({ card, onSave }: { card: AdminCard, onSave: (updated: AdminCard) => void }) {
  const [formData, setFormData] = useState({
    title: card.title,
    body: card.body,
    session_short_text: card.session_short_text || "",
    session_quick_tip: card.session_quick_tip || "",
    is_active: card.is_active,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SAVING" | "SUCCESS" | "ERROR">("IDLE");

  const isDirty = 
    formData.title !== card.title ||
    formData.body !== card.body ||
    formData.session_short_text !== (card.session_short_text || "") ||
    formData.session_quick_tip !== (card.session_quick_tip || "") ||
    formData.is_active !== card.is_active;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setStatus("IDLE");
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus("SAVING");
    try {
      const res = await fetch("/api/admin/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: card.id,
          title: formData.title,
          body: formData.body,
          session_short_text: formData.session_short_text === "" ? null : formData.session_short_text,
          session_quick_tip: formData.session_quick_tip === "" ? null : formData.session_quick_tip,
          is_active: formData.is_active,
        }),
      });

      if (!res.ok) throw new Error();
      const { card: updated } = await res.json();
      onSave(updated);
      setStatus("SUCCESS");
      setTimeout(() => setStatus("IDLE"), 3000);
    } catch {
      setStatus("ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-colors ${isDirty ? "border-[var(--color-copper)]" : "border-[var(--color-border)]"} bg-[var(--color-background-secondary)]`}>
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex-1">
          <input 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            className="w-full bg-transparent border-b border-transparent focus:border-[var(--color-copper)] text-lg font-medium focus:outline-none pb-1 transition-colors"
          />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <label className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer">
            <input 
              type="checkbox" 
              name="is_active" 
              checked={formData.is_active} 
              onChange={handleChange}
              className="accent-[var(--color-copper)]"
            />
            Ativa
          </label>
          <div className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[var(--color-text-secondary)] border border-white/10 uppercase">
            {card.intensity}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Texto Original Completo</label>
          <textarea 
            name="body" 
            value={formData.body} 
            onChange={handleChange} 
            rows={3} 
            className="w-full bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)] resize-y" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#d4a373] mb-1">Texto Curto (Sessão)</label>
            <textarea 
              name="session_short_text" 
              value={formData.session_short_text} 
              onChange={handleChange} 
              rows={2} 
              className="w-full bg-black/20 border border-[#d4a373]/30 rounded-lg p-3 text-sm focus:outline-none focus:border-[#d4a373] resize-none" 
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Dica Rápida</label>
            <input 
              name="session_quick_tip" 
              value={formData.session_quick_tip} 
              onChange={handleChange} 
              className="w-full bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)]" 
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs">
          {status === "SUCCESS" && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={14}/> Salvo com sucesso</span>}
          {status === "ERROR" && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={14}/> Erro ao salvar</span>}
          {isDirty && status === "IDLE" && <span className="text-[var(--color-copper)] flex items-center gap-1"><AlertCircle size={14}/> Alterações não salvas</span>}
        </div>
        <button 
          onClick={handleSave} 
          disabled={!isDirty || loading}
          className="flex items-center gap-2 bg-[var(--color-copper)] hover:bg-[#b07355] disabled:bg-[var(--color-border)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={16} />
          {loading ? "Salvando..." : "Salvar Carta"}
        </button>
      </div>
    </div>
  );
}

function CategoryGroup({ category, cards, onSave }: { category: string, cards: AdminCard[], onSave: (updated: AdminCard) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (cards.length === 0) return null;

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-card)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[var(--color-background-secondary)] hover:bg-[var(--color-border)]/50 transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium tracking-wide">
            {category === "TONS MAIS ESCUROS" ? "Tons mais escuros" : category}
          </span>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-[var(--color-text-secondary)]">
            {cards.length} cartas
          </span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-[var(--color-text-secondary)]" /> : <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4 bg-black/10">
          {cards.map(card => (
            <EditorialCard key={card.id} card={card} onSave={onSave} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorialPage() {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cards")
      .then((r) => r.json())
      .then((d: { cards: AdminCard[] }) => setCards(d.cards ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updatedCard: AdminCard) => {
    setCards((prev) => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const groupedCards = useMemo(() => {
    const groups: Record<string, AdminCard[]> = {};
    CATEGORIES.forEach(c => groups[c] = []);
    
    cards.forEach(card => {
      let cat = card.category;
      if (card.requires_couple_unlock && card.unlock_group_key === "DARK_THIRD_IMAGINATION") {
        cat = "TONS MAIS ESCUROS";
      }
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(card);
    });
    
    return groups;
  }, [cards]);

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/cartas" className="p-2.5 bg-[var(--color-background-secondary)] hover:bg-[var(--color-border)] rounded-xl transition-colors border border-[var(--color-border)]">
          <ArrowLeft size={20} className="text-[var(--color-text-secondary)] hover:text-white" />
        </Link>
        <div>
          <h1 className="text-2xl font-light mb-1">Visão Editorial</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Edição rápida de textos para todas as cartas organizadas por categoria.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Carregando cartas...</div>
      ) : (
        <div className="space-y-4">
          {CATEGORIES.map(cat => (
            <CategoryGroup key={cat} category={cat} cards={groupedCards[cat] || []} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
