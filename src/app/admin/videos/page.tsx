/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, Edit2, EyeOff, Filter, Loader2, PlayCircle, RefreshCw, Trash2, Upload, X } from "lucide-react";

export interface MediaAsset {
  id: string;
  type: "VIDEO" | "MUSIC";
  internal_label: string | null;
  video_category: string | null;
  content_type: string | null;
  visual_tags: string[];
  processing_status: string;
  processing_error: string | null;
  classification_status: string;
  is_active: boolean;
  size_bytes: number;
  duration_seconds: number | null;
  thumbnail_key: string | null;
  hls_master_key: string | null;
  processing_started_at: string | null;
  processing_heartbeat_at: string | null;
  processing_finished_at: string | null;
  original_filename: string | null;
}

const CATEGORIES = ["LESBICO", "FFM", "MMF", "MF"];
const CONTENT_TYPES = ["COMPLETE", "ORAL_ONLY", "PENETRATION_ONLY"];
const TAGS = ["POV", "NO_FACE"];
const STATUS_FILTERS = [
  { key: "TODOS", label: "Todos" },
  { key: "READY", label: "Prontos" },
  { key: "QUEUED", label: "Fila" },
  { key: "PROCESSING", label: "Processando" },
  { key: "ERROR", label: "Erro" },
  { key: "PENDING_CLASSIFICATION", label: "Pendentes" },
];

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function statusLabel(status: string) {
  if (status === "QUEUED") return "Na fila";
  if (status === "PROCESSING") return "Processando";
  if (status === "READY") return "Pronto";
  if (status === "ERROR") return "Erro";
  return status;
}

function statusClass(status: string) {
  if (status === "READY") return "border-green-800/50 text-green-300 bg-green-900/20";
  if (status === "ERROR") return "border-red-800/50 text-red-300 bg-red-900/20";
  if (status === "PROCESSING") return "border-yellow-800/50 text-yellow-300 bg-yellow-900/20";
  return "border-white/10 text-white/60 bg-white/5";
}

export default function AdminVideosPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    internal_label: "",
    video_category: "LESBICO",
    content_type: "COMPLETE",
    visual_tags: [] as string[],
    is_active: false,
  });

  const load = () => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { media: MediaAsset[] }) => {
        setAssets((d.media ?? []).filter((m) => m.type === "VIDEO"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => ({
    total: assets.length,
    ready: assets.filter(a => a.processing_status === "READY").length,
    queued: assets.filter(a => a.processing_status === "QUEUED").length,
    processing: assets.filter(a => a.processing_status === "PROCESSING").length,
    error: assets.filter(a => a.processing_status === "ERROR").length,
    pending: assets.filter(a => a.classification_status === "PENDING_CLASSIFICATION").length,
  }), [assets]);

  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesStatus =
      statusFilter === "TODOS" ||
      asset.processing_status === statusFilter ||
      (statusFilter === "PENDING_CLASSIFICATION" && asset.classification_status === "PENDING_CLASSIFICATION");
    const matchesCategory = categoryFilter === "TODOS" || asset.video_category === categoryFilter;
    return matchesStatus && matchesCategory;
  }), [assets, statusFilter, categoryFilter]);

  function toggleTag(tag: string) {
    setForm(prev => ({
      ...prev,
      visual_tags: prev.visual_tags.includes(tag)
        ? prev.visual_tags.filter(t => t !== tag)
        : [...prev.visual_tags, tag],
    }));
  }

  async function submitUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("type", "VIDEO");
    files.forEach(file => fd.append("files", file));

    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setFiles([]);
      setShowUpload(false);
      load();
    } catch {
      alert("Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const res = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        internal_label: form.internal_label,
        video_category: form.video_category,
        content_type: form.content_type,
        visual_tags: form.visual_tags,
        is_active: form.is_active,
      }),
    });

    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Erro ao salvar.");
    }
  }

  function openEdit(asset: MediaAsset) {
    setForm({
      internal_label: asset.internal_label ?? "",
      video_category: asset.video_category ?? "LESBICO",
      content_type: asset.content_type ?? "COMPLETE",
      visual_tags: asset.visual_tags ?? [],
      is_active: asset.is_active,
    });
    setEditing(asset);
  }

  async function reprocessAsset(asset: MediaAsset) {
    const res = await fetch(`/api/admin/media/${asset.id}/reprocess`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Erro ao reenfileirar.");
    }
    load();
  }

  async function cancelAsset(asset: MediaAsset) {
    const res = await fetch(`/api/admin/media/${asset.id}/cancel`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Erro ao cancelar.");
    }
    load();
  }

  async function toggleActive(asset: MediaAsset) {
    const res = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id, is_active: !asset.is_active }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Erro ao alterar status.");
    }
    load();
  }

  async function deleteAsset(asset: MediaAsset) {
    if (!confirm("Tem certeza que deseja excluir este video?")) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id }),
    });
    if (!res.ok) alert("Erro ao excluir.");
    load();
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light mb-1">Videos</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Upload em massa, fila sequencial e classificacao posterior.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-wine)] rounded-xl hover:bg-[var(--color-red-deep)] transition-colors text-sm font-medium shadow-lg">
          <Upload size={16} /> Upload em massa
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <Metric icon={<Filter size={16} />} label="Total" value={counts.total} />
        <Metric icon={<CheckCircle2 size={16} />} label="Prontos" value={counts.ready} />
        <Metric icon={<Clock3 size={16} />} label="Fila" value={counts.queued} />
        <Metric icon={<Activity size={16} />} label="Processando" value={counts.processing} />
        <Metric icon={<AlertTriangle size={16} />} label="Erro" value={counts.error} />
        <Metric icon={<Edit2 size={16} />} label="Pendentes" value={counts.pending} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-2 rounded-lg border text-xs transition-colors ${statusFilter === filter.key ? "border-[var(--color-copper)] text-white bg-[var(--color-copper)]/10" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/30"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["TODOS", ...CATEGORIES].map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-2 rounded-lg border text-xs transition-colors ${categoryFilter === category ? "border-[var(--color-copper)] text-white bg-[var(--color-copper)]/10" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/30"}`}
            >
              {category === "TODOS" ? "Todas categorias" : category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] py-10 animate-pulse">Carregando...</div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)] border border-dashed border-[var(--color-border)] rounded-xl">
          Nenhum video neste filtro.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map(asset => (
            <div key={asset.id} className={`flex items-center gap-4 p-4 rounded-xl border bg-[var(--color-card)] ${asset.is_active ? "border-[var(--color-border)]" : "border-white/10 opacity-75"}`}>
              <div className="w-20 h-12 bg-black rounded-md border border-[var(--color-border)] overflow-hidden relative shrink-0">
                {asset.thumbnail_key && <img src={`/uploads/${asset.thumbnail_key}`} className="w-full h-full object-cover" alt="" />}
                <PlayCircle size={16} className="absolute inset-0 m-auto text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${statusClass(asset.processing_status)}`}>{statusLabel(asset.processing_status)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${asset.classification_status === "CLASSIFIED" ? "border-blue-800/50 text-blue-300 bg-blue-900/20" : "border-orange-800/50 text-orange-300 bg-orange-900/20"}`}>
                    {asset.classification_status === "CLASSIFIED" ? "Classificado" : "Pendente"}
                  </span>
                  {asset.video_category && <span className="text-[10px] text-[var(--color-copper)] font-bold">{asset.video_category}</span>}
                  {asset.content_type && <span className="text-[10px] text-white/50">{asset.content_type}</span>}
                  {asset.visual_tags?.map(tag => <span key={tag} className="text-[10px] text-blue-300">{tag}</span>)}
                </div>
                <div className="text-sm font-medium truncate">{asset.internal_label || asset.original_filename || "Sem titulo"}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {formatSize(asset.size_bytes)}
                  {asset.duration_seconds ? ` · ${asset.duration_seconds}s` : ""}
                  {asset.processing_started_at && asset.processing_status === "PROCESSING" ? ` · desde ${new Date(asset.processing_started_at).toLocaleTimeString()}` : ""}
                </div>
                {asset.processing_error && (
                  <div className="text-xs text-red-300 mt-1 line-clamp-2">{asset.processing_error}</div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(asset.processing_status === "ERROR" || asset.processing_status === "PROCESSING") && (
                  <button onClick={() => reprocessAsset(asset)} className="px-2 py-1 text-xs rounded-md bg-red-900/30 text-red-200 hover:bg-red-900/50">
                    <RefreshCw size={13} className="inline mr-1" /> Reprocessar
                  </button>
                )}
                {(asset.processing_status === "QUEUED" || asset.processing_status === "PROCESSING") && (
                  <button onClick={() => cancelAsset(asset)} className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/60 hover:text-white">
                    Cancelar
                  </button>
                )}
                <button onClick={() => openEdit(asset)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-text-secondary)] hover:text-white" title="Editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => toggleActive(asset)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-text-secondary)] hover:text-white" title={asset.is_active ? "Desativar" : "Ativar"}>
                  {asset.is_active ? <EyeOff size={16} /> : <PlayCircle size={16} />}
                </button>
                <button onClick={() => deleteAsset(asset)} className="p-2 rounded-lg hover:bg-red-900/30 text-[var(--color-text-secondary)] hover:text-red-300" title="Excluir">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <Modal title="Upload em massa" onClose={() => setShowUpload(false)}>
          <form onSubmit={submitUpload} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Arquivos de video</label>
              <input
                type="file"
                multiple
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo"
                onChange={e => setFiles(Array.from(e.target.files ?? []))}
                className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-wine)] file:text-white hover:file:bg-[var(--color-red-deep)] file:cursor-pointer"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-3">
                Cada arquivo cria um registro inativo, pendente de classificacao e entra na fila. O processamento roda fora da request.
              </p>
            </div>
            {files.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {files.map(file => (
                  <div key={`${file.name}-${file.size}`} className="px-3 py-2 text-xs text-white/70 flex justify-between gap-3">
                    <span className="truncate">{file.name}</span>
                    <span>{formatSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">Cancelar</button>
              <button disabled={uploading || files.length === 0} className="px-4 py-2 text-sm bg-[var(--color-copper)] rounded-lg text-white disabled:opacity-50 flex items-center gap-2">
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {editing && (
        <Modal title="Classificar video" onClose={() => setEditing(null)}>
          <form onSubmit={submitEdit} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Titulo</label>
              <input value={form.internal_label} onChange={e => setForm({ ...form, internal_label: e.target.value })} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-copper)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Categoria</label>
                <select value={form.video_category} onChange={e => setForm({ ...form, video_category: e.target.value })} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm">
                  {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Tipo</label>
                <select value={form.content_type} onChange={e => setForm({ ...form, content_type: e.target.value })} className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm">
                  {CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button type="button" key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-2 rounded-lg border text-xs ${form.visual_tags.includes(tag) ? "border-blue-500 bg-blue-900/30 text-blue-200" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[var(--color-copper)]" />
              Ativo nos sorteios
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">Cancelar</button>
              <button className="px-4 py-2 text-sm bg-[var(--color-copper)] rounded-lg text-white">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3">
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs mb-1">{icon}{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
