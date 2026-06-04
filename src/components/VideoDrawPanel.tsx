"use client";

import { useState, useCallback } from "react";
import { SkipForward, Check, X } from "lucide-react";

interface VideoAsset {
  id: string;
  public_url: string | null;
  storage_key: string;
  video_category: string | null;
}

interface Props {
  cardId: string;
  sessionId: string;
  onContinue: () => void;
}

export default function VideoDrawPanel({ cardId, sessionId, onContinue }: Props) {
  const [draws, setDraws] = useState<VideoAsset[]>([]);
  const [current, setCurrent] = useState<VideoAsset | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [skipsLeft, setSkipsLeft] = useState(2);
  const [loading, setLoading] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const selectVideo = useCallback((v: VideoAsset) => {
    // Save selection (optional, for stats)
    void fetch("/api/session/video-select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, cardId, mediaAssetId: v.id }),
    }).catch(() => { /* non-blocking */ });
    setCurrent(v);

    const src = v.public_url || `/uploads/${v.storage_key}`;
    setVideoUrl(src);
    
    fetch(`/api/media/${v.id}/url`)
      .then(res => res.json())
      .then(data => {
        if (data.url) setVideoUrl(data.url);
      })
      .catch(() => {});
  }, [cardId, sessionId]);

  const drawVideo = useCallback(async () => {
    setLoading(true);
    try {
      const excludeIds = draws.map((d) => d.id).join(",");
      const res = await fetch(`/api/media?type=VIDEO${excludeIds ? `&exclude=${excludeIds}` : ""}`);
      const data: { asset: VideoAsset | null } = await res.json();

      if (!data.asset) {
        // No video available
        onContinue();
        return;
      }

      const newDraw = data.asset;
      setDraws((prev) => [...prev, newDraw]);
      setDrawCount((n) => n + 1);
      selectVideo(newDraw);
    } catch {
      onContinue();
    } finally {
      setLoading(false);
    }
  }, [draws, onContinue, selectVideo]);

  function skip() {
    if (skipsLeft <= 0) return;
    setSkipsLeft((n) => n - 1);
    if (drawCount >= 3) {
      // Can't draw more — show all drawn
      return;
    }
    drawVideo();
  }

  if (!current && drawCount === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-[var(--color-text-secondary)] text-sm text-center">
          Esta carta inclui um vídeo. Sortear agora?
        </p>
        <div className="flex gap-3">
          <button
            onClick={drawVideo}
            disabled={loading}
            className="px-6 py-3 bg-[var(--color-wine)] rounded-xl hover:bg-[var(--color-red-deep)] transition-colors text-sm"
          >
            {loading ? "Sorteando..." : "Sortear vídeo"}
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-transparent border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-card)] transition-colors text-sm text-[var(--color-text-secondary)]"
          >
            Continuar sem vídeo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {videoUrl && (
        <video
          key={current?.id}
          src={videoUrl}
          controls
          playsInline
          className="w-full max-h-64 rounded-xl bg-black object-contain"
        />
      )}

      <div className="flex justify-between items-center text-xs text-[var(--color-text-secondary)]">
        <span>Sorteio {drawCount}/3</span>
        {skipsLeft > 0 && drawCount < 3 && (
          <span>{skipsLeft} pulo{skipsLeft !== 1 ? "s" : ""} restante{skipsLeft !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Show all draws when 3 reached — let user pick */}
      {drawCount >= 3 && draws.length > 1 && (
        <div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Escolha entre os sorteados:</p>
          <div className="flex gap-2 flex-wrap">
            {draws.map((v, i) => (
              <button
                key={v.id}
                onClick={() => selectVideo(v)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                  current?.id === v.id
                    ? "border-[var(--color-copper)] text-[var(--color-copper)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                Vídeo {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {skipsLeft > 0 && drawCount < 3 && (
          <button
            onClick={skip}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)] transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            Pular
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-wine)] text-sm hover:bg-[var(--color-red-deep)] transition-colors"
        >
          <Check className="w-4 h-4" />
          Continuar carta
        </button>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-card)] transition-colors"
        >
          <X className="w-4 h-4" />
          Sem vídeo
        </button>
      </div>
    </div>
  );
}
