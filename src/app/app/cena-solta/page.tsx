"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, RefreshCw, Maximize, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";

interface VideoAsset {
  id: string;
  public_url: string | null;
  storage_key: string;
  hls_master_key: string | null;
}

export default function CenaSoltaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [current, setCurrent] = useState<VideoAsset | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const drawVideo = useCallback(async () => {
    setLoading(true);
    setEmpty(false);
    setCurrent(null);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/media/random");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!data.asset) {
        setEmpty(true);
        return;
      }
      
      const v = data.asset;
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
        
    } catch {
      setEmpty(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    const video = videoRef.current;
    if (hlsRef.current) hlsRef.current.destroy();

    if (videoUrl.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true, startLevel: -1 });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl") || videoUrl.includes(".mp4")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col absolute inset-0 z-50">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-sm tracking-widest uppercase font-medium text-white/50">Cena Solta</h1>
        <button onClick={() => router.push("/app")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white/80" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!current && !loading && !empty && (
          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-serif italic text-[#d4a373] mb-4">Inspiração Visual</h2>
            <p className="text-white/60 font-light mb-8 text-sm">Sortear um vídeo aleatório para compor o clima. Não inicia uma sessão formal.</p>
            <button onClick={drawVideo} className="w-full bg-[#B9825A] hover:brightness-110 text-white py-4 rounded-xl font-medium tracking-wide transition-all shadow-[0_0_30px_rgba(185,130,90,0.3)]">
              Sortear Vídeo
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 text-[#B9825A] animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium tracking-widest uppercase">Preparando...</span>
          </div>
        )}

        {empty && !loading && (
          <div className="text-center max-w-sm">
            <p className="text-white/50 text-sm italic mb-6">Nenhum vídeo disponível no momento.</p>
            <button onClick={() => router.push("/app")} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm">
              Voltar
            </button>
          </div>
        )}

        {current && videoUrl && (
          <div className="relative group w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            <video
              ref={videoRef}
              controls={true}
              playsInline
              muted={muted}
              className="w-full h-auto max-h-[75vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={toggleMute} className="p-3 bg-black/60 rounded-full text-white backdrop-blur-md hover:bg-black/80 transition-colors">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button onClick={toggleFullscreen} className="p-3 bg-black/60 rounded-full text-white backdrop-blur-md hover:bg-black/80 transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        )}

        {current && !loading && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <button onClick={drawVideo} className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors text-sm font-medium border border-white/10">
              <RefreshCw className="w-4 h-4" /> Sortear outro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
