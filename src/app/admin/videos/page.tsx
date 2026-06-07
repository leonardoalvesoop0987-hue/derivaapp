/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useMemo } from "react";
import { Upload, X, Trash2, Edit2, PlayCircle, EyeOff, LayoutGrid, List } from "lucide-react";

export interface MediaAsset {
  id: string;
  type: "VIDEO" | "MUSIC";
  internal_label: string | null;
  video_category: string | null;
  content_type: string | null;
  visual_tags: string[];
  processing_status: string;
  processing_error: string | null;
  is_active: boolean;
  size_bytes: number;
  duration_seconds: number | null;
  thumbnail_key: string | null;
}

const CATEGORIES = ["LESBICO", "FFM", "MMF", "MF"];
const TAGS = ["POV", "NO_FACE"];

export default function AdminVideosPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("TODOS");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("LIST");
  
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showEdit, setShowEdit] = useState<MediaAsset | null>(null);

  const [form, setForm] = useState({
    internal_label: "",
    video_category: "LESBICO",
    content_type: "COMPLETE",
    visual_tags: [] as string[],
    file: null as File | null
  });

  const load = () => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { media: MediaAsset[] }) =>
        setAssets((d.media ?? []).filter((m) => m.type === "VIDEO"))
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => {
    const countsMap: Record<string, number> = { TODOS: assets.length };
    CATEGORIES.forEach(c => {
      countsMap[c] = assets.filter(a => a.video_category === c).length;
    });
    return countsMap;
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => activeTab === "TODOS" || a.video_category === activeTab);
  }, [assets, activeTab]);

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      visual_tags: prev.visual_tags.includes(tag) 
        ? prev.visual_tags.filter(t => t !== tag) 
        : [...prev.visual_tags, tag]
    }));
  };

  const submitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) return alert("Selecione o arquivo de vídeo.");
    
    setUploading(true);
    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("type", "VIDEO");
    fd.append("video_category", form.video_category);
    fd.append("content_type", form.content_type);
    fd.append("visual_tags", JSON.stringify(form.visual_tags));
    if (form.internal_label.trim()) {
      fd.append("internal_label", form.internal_label.trim());
    } else {
      fd.append("internal_label", `Vídeo ${Math.floor(Math.random() * 90000) + 10000}`);
    }

    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setShowUpload(false);
      setForm({ internal_label: "", video_category: "LESBICO", content_type: "COMPLETE", visual_tags: [], file: null });
      load();
    } catch {
      alert("Erro no upload.");
    } finally {
      setUploading(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEdit) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: showEdit.id,
          internal_label: form.internal_label,
          video_category: form.video_category,
          content_type: form.content_type,
          visual_tags: form.visual_tags,
          is_active: form.file === null ? showEdit.is_active : form.file // trick for active
        }),
      });
      if (!res.ok) throw new Error();
      setShowEdit(null);
      load();
    } catch {
      alert("Erro ao remover.");
    }
  };

  const toggleActive = async (asset: MediaAsset) => {
    const res = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id, is_active: !asset.is_active }),
    });
    if (res.ok) {
      setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, is_active: !asset.is_active } : a));
    }
  };

  const deleteAsset = async (asset: MediaAsset) => {
    if (!confirm("Tem certeza que deseja deletar este vídeo? Essa ação pode remover os arquivos processados do R2.")) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id }),
    });
    if (res.ok) {
      load();
    } else {
      const data = await res.json();
      alert(data.message || data.error || "Erro ao deletar");
      load();
    }
  };

  const reprocessAsset = async (asset: MediaAsset) => {
    const res = await fetch(`/api/admin/media/${asset.id}/reprocess`, {
      method: "POST"
    });
    if (res.ok) {
      load();
    } else {
      alert("Erro ao enviar para reprocessamento.");
    }
  };

  const openEdit = (asset: MediaAsset) => {
    setForm({
      internal_label: asset.internal_label || "",
      video_category: asset.video_category || "LESBICO",
      content_type: asset.content_type || "COMPLETE",
      visual_tags: asset.visual_tags || [],
      file: asset.is_active as Record<string, unknown>
    });
    setShowEdit(asset);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light mb-1">Vídeos</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Gerencie o acervo de vídeos (Uploads são processados em background para HLS)</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-wine)] rounded-xl hover:bg-[var(--color-red-deep)] transition-colors text-sm font-medium shadow-lg">
          <Upload size={16} /> Novo Vídeo
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["TODOS", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                activeTab === cat 
                  ? "border-[var(--color-copper)] bg-[var(--color-copper)]/10 text-white" 
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]"
              }`}
            >
              {cat} <span className="opacity-50 ml-1">({counts[cat] || 0})</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-lg p-1 bg-[var(--color-background-secondary)]">
          <button onClick={() => setViewMode("LIST")} className={`p-1.5 rounded-md ${viewMode === "LIST" ? "bg-[var(--color-card)] text-white" : "text-[var(--color-text-secondary)]"}`}>
            <List size={18} />
          </button>
          <button onClick={() => setViewMode("GRID")} className={`p-1.5 rounded-md ${viewMode === "GRID" ? "bg-[var(--color-card)] text-white" : "text-[var(--color-text-secondary)]"}`}>
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] py-10 animate-pulse">Carregando...</div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] border border-dashed border-[var(--color-border)] rounded-xl">
          Nenhum vídeo encontrado nesta categoria.
        </div>
      ) : viewMode === "LIST" ? (
        <div className="space-y-2">
          {filteredAssets.map(asset => (
            <div key={asset.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${asset.is_active ? "border-[var(--color-border)] bg-[var(--color-card)]" : "border-red-900/30 bg-black/40 opacity-75"}`}>
              <div className="w-16 h-10 bg-black rounded flex items-center justify-center overflow-hidden shrink-0 border border-[var(--color-border)] relative">
                {asset.thumbnail_key && <img src={`${process.env.NEXT_PUBLIC_APP_URL || ""}/uploads/${asset.thumbnail_key}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} alt="" />}
                <PlayCircle size={16} className="absolute text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[var(--color-copper)]">{asset.video_category}</span>
                  <span className="text-[10px] bg-[var(--color-background-secondary)] px-2 py-0.5 rounded text-[var(--color-text-secondary)]">{asset.content_type?.replace('_ONLY', '')}</span>
                  {asset.visual_tags?.map(t => <span key={t} className="text-[10px] bg-blue-900/30 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded">{t}</span>)}
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${asset.processing_status === 'READY' ? 'border-green-800/50 text-green-400 bg-green-900/20' : asset.processing_status === 'ERROR' ? 'border-red-800/50 text-red-400 bg-red-900/20' : 'border-yellow-800/50 text-yellow-400 bg-yellow-900/20'}`}>
                    {asset.processing_status}
                  </span>
                </div>
                <div className="text-sm font-medium truncate">{asset.internal_label}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{(asset.size_bytes / 1024 / 1024).toFixed(1)} MB {asset.duration_seconds ? `· ${asset.duration_seconds}s` : ""}</div>
                {asset.processing_status === 'ERROR' && (
                  <div className="text-xs text-red-400 mt-1 line-clamp-2">
                    Erro: {asset.processing_error || "Falha desconhecida no processamento"}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {asset.processing_status === 'ERROR' && (
                  <button onClick={() => reprocessAsset(asset)} className="text-[10px] px-2 py-1 bg-red-900/40 text-red-300 hover:bg-red-800/60 rounded-md transition-colors" title="Reprocessar vídeo">Reprocessar</button>
                )}
                <button onClick={() => openEdit(asset)} className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-text-secondary)] hover:text-white transition-colors" title="Editar Metadados"><Edit2 size={16} /></button>
                <button onClick={() => toggleActive(asset)} className={`p-2 rounded-lg transition-colors ${asset.is_active ? "hover:bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] hover:text-red-400" : "hover:bg-green-900/30 text-red-400 hover:text-green-400"}`} title={asset.is_active ? "Desativar" : "Reativar"}>{asset.is_active ? <EyeOff size={16} /> : <PlayCircle size={16} />}</button>
                <button onClick={() => deleteAsset(asset)} className="p-2 hover:bg-red-900/30 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 transition-colors" title="Deletar"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <div key={asset.id} className={`flex flex-col rounded-xl border transition-all overflow-hidden ${asset.is_active ? "border-[var(--color-border)] bg-[var(--color-card)]" : "border-red-900/30 bg-black/40 opacity-75"}`}>
              <div className="aspect-video bg-black relative">
                {asset.thumbnail_key && <img src={`${process.env.NEXT_PUBLIC_APP_URL || ""}/uploads/${asset.thumbnail_key}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} alt="" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white">{asset.duration_seconds ? `${Math.floor(asset.duration_seconds/60)}:${(asset.duration_seconds%60).toString().padStart(2, '0')}` : "--:--"}</div>
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end pl-8">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shadow ${asset.processing_status === 'READY' ? 'bg-green-600 text-white' : asset.processing_status === 'ERROR' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>{asset.processing_status}</span>
                </div>
                {!asset.is_active && <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center backdrop-blur-sm"><span className="bg-red-900 px-3 py-1 text-xs font-bold rounded-lg border border-red-700 text-red-200 uppercase tracking-wider">Inativo</span></div>}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold text-[var(--color-copper)]">{asset.video_category}</span>
                  <span className="text-[10px] bg-[var(--color-background-secondary)] px-1.5 py-0.5 rounded text-[var(--color-text-secondary)]">{asset.content_type === "PENETRATION_ONLY" ? "PENETR." : asset.content_type?.split('_')[0]}</span>
                </div>
                <div className="text-sm font-medium truncate mb-2">{asset.internal_label}</div>
                <div className="flex gap-1 mb-3 flex-wrap mt-auto">
                  {asset.visual_tags?.map(t => <span key={t} className="text-[9px] bg-blue-900/30 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-auto">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(asset)} className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1"><Edit2 size={12} /> Editar</button>
                    {asset.processing_status === 'ERROR' && (
                      <button onClick={() => reprocessAsset(asset)} className="text-[10px] px-1.5 py-0.5 bg-red-900/40 text-red-300 hover:bg-red-800/60 rounded-md transition-colors" title="Reprocessar">↻ Reprocessar</button>
                    )}
                  </div>
                  <button onClick={() => deleteAsset(asset)} className="text-xs text-red-400/70 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {(showUpload || showEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-medium">{showUpload ? "Enviar Novo Vídeo" : "Editar Metadados do Vídeo"}</h2>
              <button onClick={() => { setShowUpload(false); setShowEdit(null); }} className="p-2 hover:bg-[var(--color-background-secondary)] rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="media-form" onSubmit={showUpload ? submitUpload : submitEdit} className="space-y-5">
                
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Título (Opcional)</label>
                  <input type="text" value={form.internal_label} onChange={e => setForm({...form, internal_label: e.target.value})} placeholder="Se vazio, gerará um nome automático..." className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Categoria (Escolha Única)</label>
                    <select value={form.video_category} onChange={e => setForm({...form, video_category: e.target.value})} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)]">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c === 'MF' ? 'MF (1 Homem 1 Mulher)' : c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Tipo de Conteúdo</label>
                    <select value={form.content_type} onChange={e => setForm({...form, content_type: e.target.value})} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)]">
                      <option value="COMPLETE">Completo (Oral + Penetração)</option>
                      <option value="ORAL_ONLY">Somente Oral</option>
                      <option value="PENETRATION_ONLY">Somente Penetração</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Tags Visuais (Múltipla Escolha)</label>
                  <div className="flex gap-2">
                    {TAGS.map(tag => (
                      <button type="button" key={tag} onClick={() => toggleTag(tag)} className={`px-4 py-2 rounded-lg border text-sm transition-colors ${form.visual_tags.includes(tag) ? "border-blue-500 bg-blue-900/30 text-blue-200" : "border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-background-secondary)]"}`}>
                        {tag === 'POV' ? 'POV (Visão em Primeira Pessoa)' : 'No Face (Rostos Ocultos)'}
                      </button>
                    ))}
                  </div>
                </div>

                {showEdit && (
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                     <input type="checkbox" checked={form.file as Record<string, unknown>} onChange={e => setForm({...form, file: e.target.checked as Record<string, unknown>})} className="w-4 h-4 accent-[var(--color-copper)]" />
                     <span className="text-sm">Vídeo Ativo (Entra em Sorteios)</span>
                  </label>
                )}

                {showUpload && (
                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Arquivo de Vídeo</label>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo" onChange={e => setForm({...form, file: e.target.files?.[0] || null})} className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-wine)] file:text-white hover:file:bg-[var(--color-red-deep)] file:cursor-pointer" />
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2 mt-4">
                      Formatos compatíveis: MP4, WEBM, MOV, MKV, AVI.<br/>
                      Tamanho máximo: 1 GB. Duração máxima: 60 minutos.<br/>
                      O vídeo será processado no background (HLS, múltiplas resoluções) e aparecerá como READY assim que concluído.
                    </p>
                  </div>
                )}
              </form>
            </div>

            <div className="p-4 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-background-secondary)]/50 rounded-b-2xl">
              <button onClick={() => { setShowUpload(false); setShowEdit(null); }} className="px-5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white" disabled={uploading}>Cancelar</button>
              <button type="submit" form="media-form" disabled={uploading} className="px-5 py-2 text-sm bg-[var(--color-copper)] hover:bg-[#b07355] text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                {uploading ? "Aguarde..." : showUpload ? "Confirmar e Enviar" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
