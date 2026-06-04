"use client";

import { useEffect, useState, useCallback } from "react";
import { Upload } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-light flex-1">Músicas</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-wine)] rounded-xl cursor-pointer hover:bg-[var(--color-red-deep)] transition-colors text-sm">
          <Upload className="w-4 h-4" />
          {uploading ? "Enviando..." : "Upload"}
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
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">
          Carregando...
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)] text-sm">
          Nenhuma música cadastrada. Faça upload de arquivos de áudio.
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`flex items-center gap-4 p-4 rounded-xl border bg-[var(--color-card)] ${asset.is_active ? "border-[var(--color-border)]" : "border-[var(--color-border)] opacity-50"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">
                  {asset.music_mood}
                </div>
                <div className="text-sm truncate">
                  {asset.internal_label ?? "Sem rótulo"}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {(asset.size_bytes / 1024 / 1024).toFixed(1)} MB
                  {asset.duration_seconds ? ` · ${asset.duration_seconds}s` : ""}
                </div>
              </div>
              <button
                onClick={() => toggle(asset.id, asset.is_active)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  asset.is_active
                    ? "border-green-700/50 text-green-400 hover:text-red-400 hover:border-red-700/50"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-green-400"
                }`}
              >
                {asset.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
