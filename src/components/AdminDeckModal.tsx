"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

export type AdminDeck = {
  id: string;
  name: string;
  slug: string | null;
  type: string;
  is_active: boolean;
  requires_couple_unlock: boolean;
  unlock_group_key: string | null;
  description: string | null;
  cover_style: string | null;
  back_design: string | null;
  is_default: boolean;
};

type Props = {
  deck: AdminDeck;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeck: AdminDeck) => void;
};

export function AdminDeckModal({ deck, isOpen, onClose, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminDeck>>(deck || {});

  if (!isOpen || !deck) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/decks/${deck.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || null,
          description: formData.description || null,
          type: formData.type || "OFFICIAL",
          is_active: formData.is_active,
          is_default: formData.is_default,
          requires_couple_unlock: formData.requires_couple_unlock,
          unlock_group_key: formData.unlock_group_key || null,
          cover_style: formData.cover_style || null,
          back_design: formData.back_design || null,
        }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar");
      const { deck: updated } = await res.json();
      onSave({ ...deck, ...updated });
      setIsEditing(false);
    } catch (_err) {
      alert("Erro ao salvar o deck. Verifique os logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-medium">{isEditing ? "Editar Deck" : "Detalhes do Deck"}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              ID: <span className="font-mono text-xs">{deck.id}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-background-secondary)] rounded-full transition-colors text-[var(--color-text-secondary)] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-1">Nome</div>
                <div className="text-lg font-medium">{deck.name}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-2">Descrição</div>
                <div className="bg-[var(--color-background-secondary)] p-5 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap leading-relaxed">
                  {deck.description || "Nenhuma"}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Status</div>
                  <div className={`text-sm ${deck.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {deck.is_active ? "Ativo" : "Inativo"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Tipo</div>
                  <div className="text-sm">{deck.type}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Deck Padrão</div>
                  <div className="text-sm">{deck.is_default ? "Sim" : "Não"}</div>
                </div>
                <div className="col-span-full">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Bloqueado (Unlock)</div>
                  <div className="text-sm">
                    {deck.requires_couple_unlock ? `Sim (${deck.unlock_group_key})` : "Não"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Nome</label>
                <input name="name" value={formData.name || ""} onChange={handleChange} required className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Descrição</label>
                <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Slug</label>
                  <input name="slug" value={formData.slug || ""} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Tipo</label>
                  <select name="type" value={formData.type || "OFFICIAL"} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="SYSTEM">System</option>
                    <option value="OFFICIAL">Official</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4 mt-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_active" checked={formData.is_active || false} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Deck Ativo
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_default" checked={formData.is_default || false} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Deck Padrão
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="requires_couple_unlock" checked={formData.requires_couple_unlock || false} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Bloqueado (Unlock)
                </label>
                
                {formData.requires_couple_unlock && (
                  <div className="col-span-2">
                    <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Chave do Grupo de Desbloqueio</label>
                    <input name="unlock_group_key" value={formData.unlock_group_key || ""} onChange={handleChange} placeholder="Ex: DARK_THIRD_IMAGINATION" className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)] uppercase" />
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3 bg-[var(--color-background-secondary)]/50 rounded-b-2xl">
          {!isEditing ? (
            <>
              <button onClick={onClose} className="px-5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
                Fechar
              </button>
              <button onClick={() => setIsEditing(true)} className="px-5 py-2 text-sm bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] text-white rounded-lg transition-colors shadow-lg">
                Editar Deck
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsEditing(false); setFormData(deck); }} className="px-5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors" disabled={loading}>
                Cancelar
              </button>
              <button type="submit" form="edit-form" disabled={loading} className="px-5 py-2 text-sm bg-[var(--color-copper)] hover:bg-[#b07355] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                {loading ? "Salvando..." : <><Check size={16} /> Salvar Alterações</>}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
