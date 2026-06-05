"use client";

import { useState, useEffect, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SkipForward, Repeat, Check, X, Flame, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  AZUL: "from-blue-500/20 to-blue-900/40 border-blue-500/30 text-blue-200",
  DERIVA: "from-gray-500/20 to-gray-900/40 border-gray-500/30 text-gray-200",
  ROSA: "from-pink-500/20 to-pink-900/40 border-pink-500/30 text-pink-200",
  ROXO: "from-purple-500/20 to-purple-900/40 border-purple-500/30 text-purple-200",
  VERMELHO: "from-red-500/20 to-red-900/40 border-red-500/30 text-red-200",
  PRETO: "from-gray-800 to-black border-gray-700 text-gray-300",
};

const CATEGORY_NAMES: Record<string, string> = {
  AZUL: "Azul",
  DERIVA: "Deriva",
  ROSA: "Rosa",
  ROXO: "Roxa",
  VERMELHO: "Vermelha",
  PRETO: "Preta",
};

const INTENSITY_FIRE: Record<string, string> = {
  LEVE: "🔥",
  QUENTE: "🔥🔥",
  INTENSO: "🔥🔥🔥",
  PICO: "🔥🔥🔥🔥",
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
  
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

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

  function renderCardBody(body: string) {
    // Remove mechanical text
    return body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();
  }

  function getReceiverText(rule: string | null | undefined, wasInverted: boolean) {
    if (!rule || rule === "NONE" || rule === "ANY") return null;
    let target = rule;
    if (wasInverted) {
      target = rule === "MAN" ? "WOMAN" : "MAN";
    }
    return target === "MAN" ? "Agora é com você, gato." : "Agora é com ela.";
  }

  if (loading && !card) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-[var(--color-copper)] flex flex-col items-center gap-4 animate-pulse">
          <Flame className="w-8 h-8" />
          <span className="text-sm font-medium tracking-widest uppercase">Preparando o clima...</span>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-[var(--color-wine)]/20 rounded-full flex items-center justify-center mb-4">
          <Flame className="w-10 h-10 text-[var(--color-copper)]" />
        </div>
        <h2 className="text-3xl font-light">O clima ferveu.</h2>
        <p className="text-[var(--color-text-secondary)] text-sm mb-8 max-w-[250px] mx-auto leading-relaxed">
          O Deriva cumpriu o seu papel por hoje. Agora é com vocês.
        </p>
        <button
          onClick={() => router.push(`/app/sessao/${resolvedParams.id}/feedback`)}
          className="bg-[var(--color-wine)] px-8 py-4 rounded-full text-white font-medium hover:bg-[var(--color-red-deep)] transition-colors shadow-lg shadow-[var(--color-wine)]/20"
        >
          Dar feedback do deck
        </button>
      </div>
    );
  }

  if (!card || !state || !session) return null;

  const bgStyle = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES["PRETO"];
  const progress = ((session.current_position + 1) / session.target_card_count) * 100;
  const receiverText = getReceiverText(card.receiver_rule, state.was_inverted);

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      
      {/* Abort Modal */}
      <AnimatePresence>
        {showAbortConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            >
              <h3 className="text-xl font-medium mb-3">Deseja mesmo parar?</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                O clima será interrompido e você irá para a tela de feedback.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowAbortConfirm(false)} className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium">Continuar</button>
                <button onClick={handleAbort} className="flex-1 py-3 rounded-xl bg-[var(--color-wine)] text-white text-sm font-medium">Encerrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="h-1 bg-black/40 rounded-full mb-6 overflow-hidden border border-white/5">
        <div className="h-full bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-copper)] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <SafetyCodeSheet onClose={() => {}} onAbort={() => setShowAbortConfirm(true)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-black/20 px-3 py-1 rounded-full border border-white/5 shadow-inner">
            Carta {session.current_position + 1} de {session.target_card_count}
          </span>
        </div>
      </div>

      {/* Card physical container */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id + (state.was_inverted ? "-inv" : "")}
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`w-full min-h-[400px] flex flex-col p-8 rounded-[2rem] bg-gradient-to-br ${bgStyle} border backdrop-blur-md shadow-2xl relative overflow-hidden`}
          >
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2rem]" />
            
            <div className="flex items-center justify-between mb-8 z-10">
              <span className="text-sm font-medium uppercase tracking-widest opacity-80">
                {CATEGORY_NAMES[card.category] || card.category}
              </span>
              <span className="text-base" title={card.intensity}>
                {INTENSITY_FIRE[card.intensity] || "🔥"}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center z-10">
              <h2 className="text-2xl font-medium mb-4 leading-snug drop-shadow-md">
                {card.title}
              </h2>
              <div className="text-base opacity-90 leading-relaxed whitespace-pre-wrap font-light">
                {renderCardBody(card.body)}
              </div>
            </div>

            {receiverText && (
              <div className="mt-8 pt-4 border-t border-white/10 z-10 text-center">
                <span className="text-sm font-medium tracking-wide text-[var(--color-copper)] drop-shadow-md">
                  {receiverText}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Video panel for Roxo cards */}
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl"
          >
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-[1.4rem]">
              <VideoDrawPanel
                cardId={card.id}
                sessionId={session.id}
                onContinue={() => setShowVideo(false)}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Actions (Floating bottom) */}
      <div className="flex justify-center items-center gap-4 pt-10 pb-6 relative z-20">
        {card.is_invertible && session.inversions_used < 2 && (
          <button
            onClick={() => fetchNext("INVERT")}
            disabled={loading}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md"
            title={`Inverter (${2 - session.inversions_used} restantes)`}
          >
            <Repeat className="w-5 h-5 text-[var(--color-copper)]" />
          </button>
        )}

        <button
          onClick={() => setShowAbortConfirm(true)}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-[var(--color-red-deep)] hover:border-transparent transition-colors border border-white/10 backdrop-blur-md"
          title="Encerrar"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {session.skips_used < 2 && (
          <button
            onClick={() => fetchNext("SKIP")}
            disabled={loading}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md"
            title={`Pular (${2 - session.skips_used} restantes)`}
          >
            <SkipForward className="w-5 h-5 text-white/70" />
          </button>
        )}

        <button
          onClick={() => fetchNext("NEXT")}
          disabled={loading}
          className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-red-deep)] hover:scale-105 transition-transform shadow-[0_0_30px_rgba(153,27,27,0.4)]"
          title="Próxima"
        >
          <Check className="w-8 h-8 text-white" />
        </button>
      </div>

      <AudioPlayer enabled={session.music_enabled} />
    </div>
  );
}
