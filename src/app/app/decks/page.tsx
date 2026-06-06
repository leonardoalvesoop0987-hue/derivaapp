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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto px-4 pb-12 pt-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[#d4a373] italic mb-2">Coleção</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-light">As opções disponíveis para a noite.</p>
      </div>
      
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xs uppercase tracking-widest text-white/50 font-medium">Decks Oficiais</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#d4a373]/30 border-t-[#d4a373] rounded-full animate-spin" />
          </div>
        ) : officialDecks.length === 0 ? (
          <div className="text-[var(--color-text-secondary)] text-sm text-center">Nenhum deck oficial disponível.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {officialDecks.map((deck) => (
              <Link
                key={deck.id}
                href={`/app/decks/${deck.id}`}
                className={`group block relative aspect-[3/4] rounded-2xl border p-5 flex flex-col justify-end overflow-hidden transition-all duration-500 ${
                  deck.requires_couple_unlock 
                    ? 'bg-[#130c0a] border-white/5 opacity-80 hover:opacity-100 grayscale-[0.5]' 
                    : 'bg-gradient-to-br from-[#2a0a0f] to-[#1a0508] border-[#d4a373]/20 hover:border-[#d4a373]/50 shadow-lg shadow-[#2a0a0f]/50'
                }`}
              >
                {/* Background noise/glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full mix-blend-screen z-0 transition-opacity duration-500 ${deck.requires_couple_unlock ? 'bg-white/5' : 'bg-[#B9825A]/20 group-hover:bg-[#B9825A]/40'}`} />
                
                <div className="relative z-10">
                  {deck.requires_couple_unlock && (
                    <span className="inline-block mb-3 text-[9px] border border-white/10 text-white/50 px-2 py-0.5 rounded-sm uppercase tracking-widest bg-black/40 backdrop-blur-sm">
                      Bloqueado
                    </span>
                  )}
                  <h4 className="text-xl font-serif italic text-white mb-1 drop-shadow-md leading-tight">
                    {deck.name}
                  </h4>
                  <div className="text-[10px] text-[#d4a373] uppercase tracking-widest mb-3">
                    {deck._count.cards} cartas
                  </div>
                  {deck.description && (
                    <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  )}
                  {deck.requires_couple_unlock && (
                    <div className="mt-4 text-[10px] text-white/40 italic">
                      Desbloquear em configurações
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xs uppercase tracking-widest text-white/50 font-medium">Meus Decks (Custom)</h3>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 text-xs text-[#d4a373] hover:text-white transition-colors tracking-wide"
          >
            <Plus className="w-4 h-4" />
            Novo deck
          </button>
        </div>

      {showForm && (
        <form onSubmit={createDeck} className="flex gap-3 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do deck"
            required
            className="flex-1 px-4 py-3 bg-[#130c0a] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#d4a373]/50 text-white transition-colors"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-3 bg-gradient-to-r from-[#4A1118] to-[#6A1922] rounded-xl text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 shadow-lg"
          >
            Criar
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse mt-4 text-center">Carregando...</div>
      ) : customDecks.length === 0 ? (
        <div className="text-center py-12 bg-[#130c0a] rounded-2xl border border-white/5 text-[var(--color-text-secondary)] text-sm mt-4">
          <p className="mb-4 font-light">Vocês ainda não criaram nenhum deck particular.</p>
          <button onClick={() => setShowForm(true)} className="text-[#d4a373] border border-[#d4a373]/30 px-6 py-2 rounded-full hover:bg-[#d4a373]/10 transition-colors">
            Criar o primeiro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {customDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/app/decks/${deck.id}`}
              className="group block relative aspect-square rounded-2xl border border-white/10 p-5 flex flex-col justify-end overflow-hidden bg-[#130c0a] hover:border-[#d4a373]/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
              <div className="relative z-10">
                <h4 className="text-lg font-serif text-white mb-1 group-hover:text-[#d4a373] transition-colors">{deck.name}</h4>
                <div className="text-xs text-white/40">
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
