"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SkipForward, Check, X, Maximize, Volume2, VolumeX } from "lucide-react";
import Hls from "hls.js";

interface VideoAsset {
  id: string;
  public_url: string | null;
  storage_key: string;
  hls_master_key: string | null;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hlsRef = useRef<Hls | null>(null);

  const selectVideo = useCallback((v: VideoAsset) => {
    void fetch("/api/session/video-select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, cardId, mediaAssetId: v.id }),
    }).catch(() => {});
    
    setCurrent(v);

    let src = v.public_url || `/uploads/${v.storage_key}`;
    if (v.hls_master_key) {
      src = `${process.env.NEXT_PUBLIC_APP_URL || ""}/uploads/${v.hls_master_key}`;
    }
    
    setVideoUrl(src);
    
    // In production with R2, we need signed URL
    fetch(`/api/media/${v.id}/url`)
      .then(res => res.json())
      .then(data => {
        if (data.url) setVideoUrl(data.url);
      })
      .catch(() => {});
  }, [cardId, sessionId]);

  const [empty, setEmpty] = useState(false);

  const drawVideo = useCallback(async () => {
    setLoading(true);
    setEmpty(false);
    try {
      const excludeIds = draws.map((d) => d.id).join(",");
      // Pass the cardId so the engine knows the context
      const res = await fetch(`/api/media?type=VIDEO&cardId=${cardId}&sessionId=${sessionId}${excludeIds ? `&exclude=${excludeIds}` : ""}`);
      const data: { asset: VideoAsset | null } = await res.json();

      if (!data.asset) {
        setEmpty(true);
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
  }, [draws, cardId, sessionId, onContinue, selectVideo]);

  function skip() {
    if (skipsLeft <= 0) return;
    setSkipsLeft((n) => n - 1);
    if (drawCount >= 3) return;
    drawVideo();
  }

  // HLS logic
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    
    // Cleanup previous hls
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (videoUrl.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        autoStartLoad: true,
        startLevel: -1 // auto
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl") || videoUrl.includes(".mp4")) {
      // Safari or direct MP4
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as HTMLVideoElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
        (videoRef.current as HTMLVideoElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.();
      }
    }
  };

  if (empty) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-[var(--color-text-secondary)] text-center text-sm italic">
          Nenhum vídeo adequado foi encontrado ou pronto para esta carta.
        </p>
        <button
          onClick={onContinue}
          className="w-full max-w-[200px] py-3 bg-[var(--color-wine)] text-white rounded-xl hover:bg-[var(--color-red-deep)] transition-colors font-medium shadow-lg"
        >
          Continuar
        </button>
      </div>
    );
  }

  if (!current && drawCount === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-[var(--color-copper)] font-medium text-center text-lg leading-snug">
          O Deriva separou um vídeo especial para este momento.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          <button
            onClick={drawVideo}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[var(--color-wine)] to-pink-700 rounded-xl hover:from-pink-700 hover:to-[var(--color-wine)] transition-colors font-medium text-white shadow-lg flex items-center justify-center"
          >
            {loading ? <span className="animate-pulse">Sorteando...</span> : "Revelar vídeo"}
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 bg-transparent border border-[var(--color-border)] rounded-xl hover:bg-white/5 transition-colors text-sm text-[var(--color-text-secondary)]"
          >
            Pular vídeo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
      {videoUrl && (
        <div className="relative group w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[var(--color-border)]">
          <video
            ref={videoRef}
            controls={true}
            playsInline
            muted={muted}
            className="w-full max-h-[50vh] object-contain"
          />
          {/* Custom Overlay Controls (opcional, pode deixar os nativos do controls=true mas adicionar botões extras) */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={toggleMute} className="p-2 bg-black/60 rounded-full text-white backdrop-blur-sm hover:bg-black/80 transition-colors">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={toggleFullscreen} className="p-2 bg-black/60 rounded-full text-white backdrop-blur-sm hover:bg-black/80 transition-colors">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-[var(--color-text-secondary)] px-1">
        <span>Sorteio {drawCount}/3</span>
        {skipsLeft > 0 && drawCount < 3 && (
          <span className="text-[var(--color-copper)]">{skipsLeft} pulo{skipsLeft !== 1 ? "s" : ""} restante{skipsLeft !== 1 ? "s" : ""}</span>
        )}
      </div>

      {drawCount >= 3 && draws.length > 1 && (
        <div className="bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Escolha entre os sorteados:</p>
          <div className="flex gap-2 flex-wrap">
            {draws.map((v, i) => (
              <button
                key={v.id}
                onClick={() => selectVideo(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  current?.id === v.id
                    ? "bg-[var(--color-copper)] text-white shadow-md"
                    : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-copper)]"
                }`}
              >
                Vídeo {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-center pt-2">
        {skipsLeft > 0 && drawCount < 3 && (
          <button
            onClick={skip}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-sm hover:border-[var(--color-copper)] transition-colors"
          >
            <SkipForward size={16} /> Pular
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-wine)] text-white text-sm font-medium hover:bg-[var(--color-red-deep)] transition-colors shadow-lg"
        >
          <Check size={18} /> Continuar Sessão
        </button>
      </div>
    </div>
  );
}
