"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Pause, Play, SkipForward, Music, AlertCircle } from "lucide-react";

interface MediaAsset {
  id: string;
  public_url: string | null;
  storage_key: string;
}

export default function AudioPlayer({ enabled }: { enabled: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [error, setError] = useState(false);

  const fetchAndPlay = useCallback(async (excludeId?: string) => {
    try {
      setError(false);
      const url = excludeId
        ? `/api/media?type=MUSIC&exclude=${excludeId}`
        : `/api/media?type=MUSIC`;

      const res = await fetch(url);
      const data: { asset: MediaAsset | null } = await res.json();

      if (!data.asset) {
        console.warn("[AudioPlayer] Nenhuma música disponível");
        return;
      }

      setAsset(data.asset);

      // Use the stream endpoint which handles CORS properly
      let src = `/api/media/${data.asset.id}/stream`;
      console.log("[AudioPlayer] Usando stream endpoint com CORS:", src);

      // Enviar src para o elemento <audio> do DOM
      if (audioRef.current) {
        audioRef.current.src = src;
        console.log("[AudioPlayer] Iniciando reprodução:", src);

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(true);
              setError(false);
              console.log("[AudioPlayer] Reproduzindo");
            })
            .catch((err) => {
              console.error("[AudioPlayer] Erro ao reproduzir:", err);
              setError(true);
              setPlaying(false);
            });
        }
      }
    } catch (err) {
      console.error("[AudioPlayer] Erro ao buscar música:", err);
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Garantir que existe um elemento <audio> no DOM
    if (!audioRef.current) {
      console.warn("[AudioPlayer] Ref não inicializada!");
      return;
    }

    console.log("[AudioPlayer] Inicializando com enabled=true");
    fetchAndPlay().catch((err) => console.error("[AudioPlayer] Init error:", err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [enabled, fetchAndPlay]);

  // Quando a música termina, pegar próxima
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !asset) return;

    const handleEnded = () => {
      console.log("[AudioPlayer] Música terminou, pulando para próxima");
      fetchAndPlay(asset.id).catch((err) => console.error("[AudioPlayer] Skip error:", err));
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [asset, fetchAndPlay]);

  if (!enabled) return null;

  function togglePlay() {
    if (!audioRef.current) {
      console.warn("[AudioPlayer] Ref não disponível");
      return;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setPlaying(true);
          setError(false);
        })
        .catch((err) => {
          console.error("[AudioPlayer] Erro ao reproduzir:", err);
          setError(true);
        });
    }
  }

  function skipMusic() {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
    fetchAndPlay(asset?.id).catch((err) => console.error("[AudioPlayer] Skip error:", err));
  }

  return (
    <>
      {/* Elemento <audio> anexado ao DOM */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Controles da música */}
      <div className="flex items-center gap-2 bg-[var(--color-background-secondary)]/90 backdrop-blur-sm px-3 py-2 rounded-full border border-[var(--color-border)] shadow-lg">
        <Music className="w-3.5 h-3.5 text-[var(--color-copper)]" />

        {error ? (
          <button
            onClick={() => fetchAndPlay()}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            title="Erro ao carregar música. Clique para tentar novamente."
          >
            <AlertCircle className="w-3 h-3" />
            Erro
          </button>
        ) : !asset ? (
          <span className="text-xs text-white/50 animate-pulse">Carregando...</span>
        ) : (
          <>
            <button
              onClick={togglePlay}
              className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
              title={playing ? "Pausar" : "Reproduzir"}
            >
              {playing ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={skipMusic}
              className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
              title="Próxima música"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
