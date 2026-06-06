"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

export type AdminCard = {
  id: string;
  title: string;
  body: string;
  category: string;
  intensity: string;
  position: number;
  is_active: boolean;
  is_invertible: boolean;
  requires_video: boolean;
  receiver_rule: string | null;
  metadata_json?: string | null;
  session_short_text?: string | null;
  session_quick_tip?: string | null;
  primary_tag?: string | null;
  stage?: string | null;
  erotic_function?: string | null;
  progression_role?: string | null;
  is_available_in_default: boolean;
  is_available_in_estreia: boolean;
  is_available_in_custom_selection: boolean;
  requires_couple_unlock: boolean;
  unlock_group_key?: string | null;
  deck: { name: string; type: string };
};

type Props = {
  card: AdminCard;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: AdminCard) => void;
};

export function AdminCardModal({ card, isOpen, onClose, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminCard>>(card || {});

  if (!isOpen || !card) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: card.id,
          title: formData.title,
          body: formData.body,
          category: formData.category || "AZUL",
          intensity: formData.intensity || "LEVE",
          position: formData.position || 0,
          is_active: formData.is_active,
          is_invertible: formData.is_invertible,
          requires_video: formData.requires_video,
          receiver_rule: formData.receiver_rule === "null" ? null : formData.receiver_rule,
          primary_tag: formData.primary_tag === "null" ? null : formData.primary_tag,
          stage: formData.stage === "null" ? null : formData.stage,
          erotic_function: formData.erotic_function === "null" ? null : formData.erotic_function,
          progression_role: formData.progression_role === "null" ? null : formData.progression_role,
          session_short_text: formData.session_short_text === "" ? null : formData.session_short_text,
          session_quick_tip: formData.session_quick_tip === "" ? null : formData.session_quick_tip,
          is_available_in_default: formData.is_available_in_default,
          is_available_in_estreia: formData.is_available_in_estreia,
          is_available_in_custom_selection: formData.is_available_in_custom_selection,
          requires_couple_unlock: formData.requires_couple_unlock,
          unlock_group_key: formData.unlock_group_key === "null" ? null : formData.unlock_group_key,
        }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar");
      const { card: updated } = await res.json();
      onSave(updated);
      setIsEditing(false);
    } catch (_err) {
      alert("Erro ao salvar a carta. Verifique os logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-medium">{isEditing ? "Editar Carta" : "Detalhes da Carta"}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              ID: <span className="font-mono text-xs">{card.id}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-background-secondary)] rounded-full transition-colors text-[var(--color-text-secondary)] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-background-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Categoria</div>
                  <div className="font-medium">{card.category}</div>
                </div>
                <div className="bg-[var(--color-background-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Intensidade</div>
                  <div className="font-medium">{card.intensity}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-1">Título</div>
                <div className="text-lg font-medium">{card.title}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-2">Corpo (Texto Completo)</div>
                <div className="bg-[var(--color-background-secondary)] p-5 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap leading-relaxed">
                  {card.body}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Status</div>
                  <div className={`text-sm ${card.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {card.is_active ? "Ativa" : "Inativa"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Requer Vídeo</div>
                  <div className="text-sm">{card.requires_video ? "Sim" : "Não"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Invertível</div>
                  <div className="text-sm">{card.is_invertible ? "Sim" : "Não"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Regra Receptor</div>
                  <div className="text-sm">{card.receiver_rule || "Nenhuma"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Estágio</div>
                  <div className="text-sm">{card.stage || "Não definido"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Função Erótica</div>
                  <div className="text-sm">{card.erotic_function || "Não definida"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Tag Principal</div>
                  <div className="text-sm">{card.primary_tag || "Não definida"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Papel na Progressão</div>
                  <div className="text-sm">{card.progression_role || "Não definido"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Padrão</div>
                  <div className="text-sm">{card.is_available_in_default ? "Sim" : "Não"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Estreia</div>
                  <div className="text-sm">{card.is_available_in_estreia ? "Sim" : "Não"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Seleção Casal</div>
                  <div className="text-sm">{card.is_available_in_custom_selection ? "Sim" : "Não"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Bloqueada (Unlock)</div>
                  <div className="text-sm">
                    {card.requires_couple_unlock ? `Sim (${card.unlock_group_key})` : "Não"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="AZUL">Azul</option>
                    <option value="DERIVA">Deriva</option>
                    <option value="ROSA">Rosa</option>
                    <option value="ROXO">Roxa</option>
                    <option value="VERMELHO">Vermelha</option>
                    <option value="PRETO">Preta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Intensidade</label>
                  <select name="intensity" value={formData.intensity} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="LEVE">Leve 🔥</option>
                    <option value="QUENTE">Quente 🔥🔥</option>
                    <option value="INTENSO">Intenso 🔥🔥🔥</option>
                    <option value="PICO">Pico 🔥🔥🔥🔥</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Título</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1 flex justify-between items-center">
                  <span>Corpo da Carta (Texto Completo Original)</span>
                </label>
                <textarea name="body" value={formData.body} onChange={handleChange} required rows={5} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)] resize-none" />
              </div>

              <div className="bg-[#1a1410] p-4 rounded-xl border border-[#d4a373]/20 space-y-4">
                <div>
                  <label className="block text-sm text-[#d4a373] mb-1 font-medium">Texto curto (Sessão)</label>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">O texto curto aparece durante a sessão para leitura rápida. O texto completo continuará disponível no botão “Ver detalhes”.</p>
                  <textarea name="session_short_text" value={formData.session_short_text || ""} onChange={handleChange} rows={3} placeholder="Texto reduzido para leitura rápida..." className="w-full bg-[var(--color-background-secondary)] border border-[#d4a373]/30 rounded-lg p-3 text-sm focus:outline-none focus:border-[#d4a373] resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Dica Rápida (Opcional)</label>
                  <input name="session_quick_tip" value={formData.session_quick_tip || ""} onChange={handleChange} placeholder="Ex: Olhem nos olhos, falem baixo..." className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4 mt-4">
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Estágio (Stage)</label>
                  <select name="stage" value={formData.stage || "null"} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="null">Não definido</option>
                    <option value="OPENING">Abertura (Opening)</option>
                    <option value="WARMUP">Aquecimento (Warmup)</option>
                    <option value="TEASING">Provocação (Teasing)</option>
                    <option value="BUILDUP">Construção (Buildup)</option>
                    <option value="INTENSE">Intenso (Intense)</option>
                    <option value="PEAK">Pico (Peak)</option>
                    <option value="COOLDOWN">Respiro (Cooldown)</option>
                    <option value="CLOSING">Fechamento (Closing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Função Erótica</label>
                  <select name="erotic_function" value={formData.erotic_function || "null"} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="null">Não definida</option>
                    <option value="PREPARO">Preparo</option>
                    <option value="PROVOCACAO">Provocação</option>
                    <option value="PRAZER_NELA">Prazer Nela</option>
                    <option value="PRAZER_NELE">Prazer Nele</option>
                    <option value="PRAZER_CASAL">Prazer Casal</option>
                    <option value="TRANSICAO">Transição</option>
                    <option value="RESPIRO">Respiro</option>
                    <option value="FANTASIA">Fantasia</option>
                    <option value="VIDEO_ESTIMULO">Vídeo Estímulo</option>
                    <option value="PICO">Pico</option>
                    <option value="FECHAMENTO">Fechamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Tag Principal</label>
                  <input name="primary_tag" value={formData.primary_tag || ""} onChange={handleChange} placeholder="Ex: BEIJO, MASSAGEM" className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)] uppercase" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Papel na Progressão</label>
                  <select name="progression_role" value={formData.progression_role || "null"} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="null">Não definido</option>
                    <option value="ABRIR">Abrir</option>
                    <option value="AQUECER">Aquecer</option>
                    <option value="PROVOCAR">Provocar</option>
                    <option value="INTENSIFICAR">Intensificar</option>
                    <option value="SUSTENTAR">Sustentar</option>
                    <option value="PICO">Pico</option>
                    <option value="RESPIRAR">Respirar</option>
                    <option value="FECHAR">Fechar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4 mt-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Carta Ativa (Aparece na Sessão)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="requires_video" checked={formData.requires_video} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Requer Vídeo
                </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_invertible" checked={formData.is_invertible} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Invertível
                </label>
                
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Regra Receptor</label>
                  <select name="receiver_rule" value={formData.receiver_rule || "null"} onChange={handleChange} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none focus:border-[var(--color-copper)]">
                    <option value="null">Sem destinatário fixo</option>
                    <option value="WOMAN">Para ela</option>
                    <option value="MAN">Para ele</option>
                    <option value="ANY">Sortear na sessão</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4 mt-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_available_in_default" checked={formData.is_available_in_default} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Padrão (Deck Principal)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_available_in_estreia" checked={formData.is_available_in_estreia} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Deck Estreia
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_available_in_custom_selection" checked={formData.is_available_in_custom_selection} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Custom (Seleção Casal)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="requires_couple_unlock" checked={formData.requires_couple_unlock} onChange={handleChange} className="w-4 h-4 accent-[var(--color-copper)] bg-[var(--color-background-secondary)] border-[var(--color-border)]" />
                  Bloqueada (Unlock)
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
                Editar Carta
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsEditing(false); setFormData(card); }} className="px-5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors" disabled={loading}>
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
