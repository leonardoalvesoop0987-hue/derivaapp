"use client";

import { useEffect, useState, useCallback } from "react";
import { Upload, Trash2, EyeOff, PlayCircle } from "lucide-react";

interface MediaAsset {
  id: string;
  type: "VIDEO" | "MUSIC";
  internal_label: string | null;
  music_mood: string | null;
  is_active: boolean;
  size_bytes: number;
  duration_seconds: number | null;
}

export default function AdminMusicasPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { media: MediaAsset[] }) =>
        setAssets((d.media ?? []).filter((m) => m.type === "MUSIC"))
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id: string, is_active: boolean) => {
    await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !is_active }),
    });
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !is_active } : a))
    );
  };

  const deleteAsset = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta música?")) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      load();
    } else {
      alert("Erro ao deletar");
    }
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("type", "MUSIC");
    form.append("music_mood", "SENSUAL");
    await fetch("/api/admin/media/upload", { method: "POST", body: form });
    load();
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light mb-1">Músicas</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Faça upload de arquivos MP3/AAC para tocar de fundo nas sessões.</p>
        </div>
        <label className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-wine)] rounded-xl cursor-pointer hover:bg-[var(--color-red-deep)] transition-colors text-sm font-medium shadow-lg">
          <Upload size={16} />
          {uploading ? "Enviando..." : "Upload Rápido"}
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse py-10">
          Carregando...
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm border border-dashed border-[var(--color-border)] rounded-xl">
          Nenhuma música cadastrada.
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`flex items-center gap-4 p-4 rounded-xl border bg-[var(--color-card)] transition-all ${asset.is_active ? "border-[var(--color-border)]" : "border-red-900/30 opacity-60"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate mb-1">
                  {asset.internal_label ?? "Sem rótulo"}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {(asset.size_bytes / 1024 / 1024).toFixed(1)} MB
                  {asset.duration_seconds ? ` · ${asset.duration_seconds}s` : ""}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(asset.id, asset.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    asset.is_active
                      ? "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-red-400"
                      : "text-red-400 hover:text-green-400 hover:bg-green-900/30"
                  }`}
                  title={asset.is_active ? "Desativar Música" : "Reativar Música"}
                >
                  {asset.is_active ? <EyeOff size={16} /> : <PlayCircle size={16} />}
                </button>
                <button 
                  onClick={() => deleteAsset(asset.id)}
                  className="p-2 text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Deletar Música"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
