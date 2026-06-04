"use client";

import { useState, useEffect, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SkipForward, Repeat, Check, X } from "lucide-react";
import type { CardType, SessionCardType, SessionType } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import VideoDrawPanel from "@/components/VideoDrawPanel";
import SafetyCodeSheet from "@/components/SafetyCodeSheet";

type SessionResponse = {
  card?: CardType;
  state?: SessionCardType;
  session?: SessionType;
  completed?: boolean;
  reason?: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  AZUL: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  DERIVA: "text-gray-300 border-gray-300/20 bg-gray-300/10",
  ROSA: "text-pink-400 border-pink-400/20 bg-pink-400/10",
  ROXO: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  VERMELHO: "text-red-400 border-red-400/20 bg-red-400/10",
  PRETO: "text-gray-400 border-gray-400/20 bg-gray-900",
};

const INTENSITY_LABELS: Record<string, string> = {
  LEVE: "Leve",
  QUENTE: "Quente",
  INTENSO: "Intenso",
  PICO: "Pico",
};

export default function SessaoCardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<CardType | null>(null);
  const [state, setState] = useState<SessionCardType | null>(null);
  const [session, setSession] = useState<SessionType | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const fetchNext = useCallback(async (action: string) => {
    setLoading(true);
    setShowVideo(false);
    try {
      const res = await fetch("/api/session/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resolvedParams.id, action }),
      });
      const data: SessionResponse = await res.json();

      if (data.completed) {
        setCompleted(true);
      } else if (data.card && data.state && data.session) {
        setCard(data.card);
        setState(data.state);
        setSession(data.session);
        // Auto-show video panel for Roxo cards that require video
        if (data.card.category === "ROXO" && data.card.requires_video && data.session.videos_enabled) {
          setShowVideo(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void fetchNext("START");
  }, [fetchNext]);

  async function handleAbort() {
    await fetch("/api/session/abort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: resolvedParams.id }),
    });
    router.push(`/app/sessao/${resolvedParams.id}/feedback`);
  }

  if (loading && !card) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse">Sorteando...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-6 text-center">
        <h2 className="text-3xl font-light">Sessão Encerrada</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Se quiser, ajuste o deck para as próximas vezes.
        </p>
        <button
          onClick={() => router.push(`/app/sessao/${resolvedParams.id}/feedback`)}
          className="bg-[var(--color-wine)] px-8 py-3 rounded-full hover:bg-[var(--color-red-deep)] transition-colors"
        >
          Ver feedback
        </button>
        <button
          onClick={() => router.push("/app")}
          className="text-[var(--color-text-secondary)] text-sm hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  if (!card || !state || !session) return null;

  const categoryStyle = CATEGORY_STYLES[card.category] ?? "text-white border-white/20 bg-white/10";
  const progress = ((session.current_position + 1) / session.target_card_count) * 100;

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] animate-in fade-in duration-500">
      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--color-border)] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[var(--color-copper)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header row */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryStyle}`}>
            {card.category}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
            {INTENSITY_LABELS[card.intensity]}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SafetyCodeSheet onClose={() => {}} onAbort={handleAbort} />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {session.current_position + 1}/{session.target_card_count}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-light mb-6 tracking-wide">{card.title}</h2>
        <div className="text-base text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {card.body}
        </div>

        {state.was_inverted && (
          <div className="mt-6 text-sm font-medium text-[var(--color-copper)]">
            Ação invertida
          </div>
        )}

        {/* Video panel for Roxo cards */}
        {showVideo && (
          <div className="mt-8 p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
            <VideoDrawPanel
              cardId={card.id}
              sessionId={session.id}
              onContinue={() => setShowVideo(false)}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-8 pb-4 flex-wrap">
        {card.is_invertible && session.inversions_used < 2 && (
          <button
            onClick={() => fetchNext("INVERT")}
            disabled={loading}
            className="flex flex-col items-center p-3 rounded-2xl bg-[var(--color-background-secondary)] hover:bg-[var(--color-card)] transition-colors border border-[var(--color-border)] min-w-[64px]"
          >
            <Repeat className="w-5 h-5 mb-1 text-[var(--color-copper)]" />
            <span className="text-xs">Inverter ({2 - session.inversions_used})</span>
          </button>
        )}

        {session.skips_used < 2 && (
          <button
            onClick={() => fetchNext("SKIP")}
            disabled={loading}
            className="flex flex-col items-center p-3 rounded-2xl bg-[var(--color-background-secondary)] hover:bg-[var(--color-card)] transition-colors border border-[var(--color-border)] min-w-[64px]"
          >
            <SkipForward className="w-5 h-5 mb-1" />
            <span className="text-xs">Pular ({2 - session.skips_used})</span>
          </button>
        )}

        <button
          onClick={() => fetchNext("NEXT")}
          disabled={loading}
          className="flex flex-col items-center p-3 px-6 rounded-2xl bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors border border-transparent min-w-[80px]"
        >
          <Check className="w-5 h-5 mb-1" />
          <span className="text-xs">Próxima</span>
        </button>

        <button
          onClick={handleAbort}
          className="flex flex-col items-center p-3 rounded-2xl bg-transparent hover:bg-[var(--color-card)] transition-colors border border-[var(--color-border)] min-w-[64px]"
        >
          <X className="w-5 h-5 mb-1 text-[var(--color-text-secondary)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">Encerrar</span>
        </button>
      </div>

      {/* Music player */}
      <AudioPlayer enabled={session.music_enabled} />
    </div>
  );
}
