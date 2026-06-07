"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Pause, Play, SkipForward, Music } from "lucide-react";

interface MediaAsset {
  id: string;
  public_url: string | null;
  storage_key: string;
}

export default function AudioPlayer({ enabled }: { enabled: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [blocked, setBlocked] = useState(false);

  const fetchAndPlay = useCallback(async (excludeId?: string) => {
    try {
      const url = excludeId
        ? `/api/media?type=MUSIC&exclude=${excludeId}`
        : `/api/media?type=MUSIC`;
      const res = await fetch(url);
      const data: { asset: MediaAsset | null } = await res.json();
      if (!data.asset) return;

      setAsset(data.asset);
      let src = data.asset.public_url || `/uploads/${data.asset.storage_key}`;
      
      // Fetch signed URL se existir endpoint configurado
      try {
        const urlRes = await fetch(`/api/media/${data.asset.id}/url`);
        if (urlRes.ok) {
          const urlData = await urlRes.json();
          if (urlData.url) src = urlData.url;
        }
      } catch {
        // Fallback para original
      }

      if (audioRef.current) {
        audioRef.current.src = src;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(true);
              setBlocked(false);
            })
            .catch(() => {
              setBlocked(true);
              setPlaying(false);
            });
        }
      }
    } catch {
      // Silently handle - sessão não quebra por música
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const audio = new Audio();
    audioRef.current = audio;

    // Note: setVisible was removed - component is always rendered when enabled=true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAndPlay().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [enabled, fetchAndPlay]);

  // Register onended after asset changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !asset) return;
    const handleEnded = () => fetchAndPlay(asset.id).catch(() => {});
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [asset, fetchAndPlay]);

  if (!enabled) return null;

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setPlaying(true);
          setBlocked(false);
        })
        .catch(() => setBlocked(true));
    }
  }

  function skipMusic() {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
    fetchAndPlay(asset?.id).catch(() => {});
  }

  return (
    <div className="fixed bottom-[calc(90px+env(safe-area-inset-bottom))] right-4 z-20 flex items-center gap-2 bg-[var(--color-background-secondary)]/90 backdrop-blur-sm px-3 py-2 rounded-full border border-[var(--color-border)] shadow-lg">
      <Music className="w-3.5 h-3.5 text-[var(--color-copper)]" />
      {blocked ? (
        <button
          onClick={togglePlay}
          className="text-xs text-[var(--color-copper)] hover:underline"
        >
          Tocar música
        </button>
      ) : (
        <>
          <button
            onClick={togglePlay}
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
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
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
