"use client";

import { useState, useEffect, use, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { SkipForward, Repeat, Check, X, Flame, Volume2, VolumeX, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CardType, SessionCardType, SessionType } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import VideoDrawPanel from "@/components/VideoDrawPanel";

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
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showFullTextModal, setShowFullTextModal] = useState(false);
  const [isChangingPace, setIsChangingPace] = useState(false);
  const [isInsertingPause, setIsInsertingPause] = useState(false);
  const [showPaceMenu, setShowPaceMenu] = useState(false);
  
  const [audioState, setAudioState] = useState<"IDLE" | "LOADING" | "PLAYING" | "ERROR" | "MISSING">("MISSING");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<{enabled: boolean, playbackMode: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const meta = useMemo<Record<string, unknown>>(() => {
    if (!state?.metadata_json) return {};
    try {
      return JSON.parse(state.metadata_json) as Record<string, unknown>;
    } catch {
      return {};
    }
  }, [state?.metadata_json]);

  const resolvedShortText =
    typeof meta.rendered_short_text === "string" && meta.rendered_short_text.trim()
      ? meta.rendered_short_text.trim()
      : card?.session_short_text?.trim() ?? "";

  const resolvedBodyText =
    typeof meta.rendered_body === "string" && meta.rendered_body.trim()
      ? meta.rendered_body
      : card
        ? renderCardBody(card.body)
        : "";
  const frontText = typeof meta.front_text === "string" ? meta.front_text : "A tensão sobe agora.";
  const currentReceiver = typeof meta.current_receiver === "string" ? meta.current_receiver : null;
  const touchDeltaRef = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    fetch("/api/session/voice-settings")
      .then(res => res.json())
      .then(data => setVoiceSettings(data))
      .catch(console.error);
  }, []);

  const fetchNext = useCallback(async (action: string) => {
    setLoading(true);
    setShowVideo(false);
    setIsFlipped(false);
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAudioState("MISSING");
    setAudioUrl(null);
  }, [card?.id]);

  function renderCardBody(body: string) {
    return body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();
  }

  // Poll voice status
  useEffect(() => {
    if (!isFlipped || !card?.id || !resolvedShortText || !voiceSettings?.enabled) return;

    const cardId = card.id;
    let pollInterval: NodeJS.Timeout | null = null;
    let isPolling = true;

    async function checkStatus() {
      if (!isPolling) return;
      try {
        const res = await fetch(`/api/session/${resolvedParams.id}/voice-status?cardId=${cardId}&text=${encodeURIComponent(resolvedShortText)}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (!isPolling) return;
        
        if (data.status === "READY" && data.audioUrl) {
          setAudioState("IDLE");
          setAudioUrl(data.audioUrl);
          if (pollInterval) clearInterval(pollInterval);
        } else if (data.status === "GENERATING") {
          setAudioState("LOADING");
        } else if (data.status === "MISSING_SHORT_TEXT") {
          setAudioState("MISSING");
          if (pollInterval) clearInterval(pollInterval);
        } else {
          setAudioState("ERROR");
          if (pollInterval) clearInterval(pollInterval);
        }
      } catch {
        if (!isPolling) return;
        setAudioState("ERROR");
        if (pollInterval) clearInterval(pollInterval);
      }
    }

    void checkStatus();
    pollInterval = setInterval(checkStatus, 3000);

    return () => {
      isPolling = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isFlipped, card?.id, resolvedShortText, voiceSettings?.enabled, resolvedParams.id]);

  // Autoplay if automatic
  useEffect(() => {
    if (isFlipped && voiceSettings?.enabled && voiceSettings?.playbackMode === "automatic" && audioState === "IDLE" && audioUrl) {
      const t = setTimeout(() => {
        handlePlayVoice().catch(console.error);
      }, 500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, voiceSettings, audioState, audioUrl, card?.id]);

  if (loading && !card) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-[#B9825A] flex flex-col items-center gap-4 animate-pulse">
          <Flame className="w-8 h-8" />
          <span className="text-sm font-medium tracking-widest uppercase">Preparando a carta...</span>
        </div>
      </div>
    );
  }

  async function handleContinue(mode: "SAME" | "LIGHTER" | "HEAVIER") {
    try {
      setLoading(true);
      const res = await fetch("/api/session/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resolvedParams.id, mode }),
      });
      const data = await res.json();
      if (data.sessionId) {
        router.push(`/app/sessao/${data.sessionId}`);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  async function handlePaceChoice(choice: "SLOWER" | "SAME" | "FASTER") {
    setIsChangingPace(true);
    try {
      const res = await fetch("/api/session/pace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resolvedParams.id, choice })
      });
      if (!res.ok) throw new Error();
      setShowPaceMenu(false);
    } catch(err) {
      console.error(err);
    }
    setIsChangingPace(false);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (!isFlipped) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDeltaRef.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isFlipped || !touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    touchDeltaRef.current = { x: dx, y: dy };
  }

  function handleTouchEnd() {
    if (!isFlipped || !touchStartRef.current || !touchDeltaRef.current) return;
    const { x: dx, y: dy } = touchDeltaRef.current;
    
    // Dominant horizontal swipe check to avoid scroll conflict
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < -60) {
        // Swipe left -> Next
        fetchNext("NEXT");
      } else if (dx > 60 && session && session.skips_used < 2) {
        // Swipe right -> Skip
        fetchNext("SKIP");
      }
    }
    touchStartRef.current = null;
    touchDeltaRef.current = null;
  }

  async function handleHotPause() {
    setIsInsertingPause(true);
    try {
      const res = await fetch("/api/session/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resolvedParams.id })
      });
      if (!res.ok) throw new Error();
    } catch(err) {
      console.error(err);
    }
    setIsInsertingPause(false);
  }

  async function handlePlayVoice(e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (audioState === "PLAYING") {
      if (audioRef.current) audioRef.current.pause();
      setAudioState("IDLE");
      return;
    }
    if (audioState === "LOADING" || audioState === "ERROR" || audioState === "MISSING" || !audioUrl) return;

    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setAudioState("IDLE");
      audio.onerror = () => setAudioState("ERROR");
      
      await audio.play();
      setAudioState("PLAYING");
    } catch (err) {
      console.error("Audio playback error:", err);
      setAudioState("ERROR");
    }
  }



  // Auto-continue session when completed, instead of asking
  useEffect(() => {
    if (completed && !loading) {
      const timer = setTimeout(() => {
        handleContinue("SAME");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [completed, loading]);

  if (completed) {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-[var(--color-wine)]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(153,27,27,0.3)]">
          <Flame className="w-10 h-10 text-[var(--color-copper)] animate-pulse" />
        </div>
        <p className="text-[var(--color-text-secondary)] text-base text-center">
          Preparando próxima rodada...
        </p>
      </div>
    );
  }

  if (!card || !state || !session) return null;

  const bgStyle = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES["PRETO"];
  const progress = ((session.current_position + 1) / session.target_card_count) * 100;
  
  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-[var(--color-background-primary)]">

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
              <h3 className="text-2xl font-serif text-[#d4a373] italic mb-3">Pausar o jogo?</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                O clima será interrompido e a sessão atual encerrada.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowAbortConfirm(false)} className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-white/5 transition-colors">Voltar</button>
                <button onClick={handleAbort} className="flex-1 py-3 rounded-xl bg-[#8C5D3D] text-white text-sm font-medium hover:brightness-110 transition-colors">Encerrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Text Modal */}
      <AnimatePresence>
        {showFullTextModal && resolvedShortText && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowFullTextModal(false)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm px-4 pb-4 sm:p-6"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 md:p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              <button onClick={() => setShowFullTextModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-xl md:text-2xl font-medium mb-4 pr-8">{card.title}</h3>
              <div className="overflow-y-auto custom-scrollbar pr-2">
                <div className="text-base md:text-lg opacity-90 leading-relaxed whitespace-pre-wrap font-light">
                  {resolvedBodyText}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar: Progress + Position */}
      <div className="flex-shrink-0 bg-[var(--color-background-primary)] border-b border-white/5">
        <div className="h-1 bg-black/40 rounded-full mx-4 mt-4 mb-3 overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-copper)] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center px-4 pb-3">
          <button onClick={() => setShowPaceMenu(!showPaceMenu)} className="text-white/40 hover:text-[#d4a373] transition-colors flex items-center gap-1.5" title="Ajustar ritmo">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Ritmo</span>
          </button>
          <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-black/20 px-3 py-1 rounded-full border border-white/5 shadow-inner">
            Carta {session.current_position + 1} de {session.target_card_count}
          </span>
          <button
            onClick={() => setShowAbortConfirm(true)}
            className="text-white/40 hover:text-white/70 transition-colors"
            title="Sair da sessão"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card physical container - Main content area */}
      <div className="flex-1 flex flex-col justify-center items-center min-h-0 px-4 py-4 md:py-6 overflow-hidden">
        <div className="w-full relative perspective-[1000px] flex flex-col items-center justify-center h-full max-h-[72dvh] landscape:max-h-[75dvh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full relative perspective-[1000px] flex-1 flex flex-col justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative cursor-pointer grid w-full max-w-[420px] aspect-[1/1.2] landscape:max-w-[72vw] landscape:aspect-[16/9] mx-auto"
              style={{ transformStyle: 'preserve-3d', maxHeight: '100%' }}
              onClick={() => !isFlipped && setIsFlipped(true)}
            >
              {/* FRONT (Capa) */}
              <div
                className={`col-start-1 row-start-1 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br ${bgStyle} flex flex-col justify-center items-center text-center shadow-2xl shadow-black/50 border border-white/5 relative overflow-hidden`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                 <span className="text-xs text-white/50 mb-4 tracking-widest uppercase font-medium z-10 landscape:text-sm">
                   {CATEGORY_NAMES[card.category] || card.category} <span className="ml-1 text-base opacity-70">{INTENSITY_FIRE[card.intensity] || "🔥"}</span>
                 </span>
                 <p className="font-serif italic text-[#d4a373] leading-snug drop-shadow-xl z-10 px-2 flex-1 flex items-center justify-center text-center w-full"
                    style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}>
                   {frontText}
                 </p>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse z-10 mt-4 landscape:text-xs">Toque para revelar</p>
              </div>

              {/* BACK (Verso) */}
              <div
                className={`col-start-1 row-start-1 p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br ${bgStyle} flex flex-col shadow-2xl shadow-black/50 border border-white/5 relative overflow-y-auto custom-scrollbar`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overscrollBehavior: 'contain', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
              >
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none rounded-[2rem]" />
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2rem]" />
                 
                 <div className="flex items-center justify-between mb-6 z-10">
                   <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                     {CATEGORY_NAMES[card.category] || card.category}
                   </span>
                   <span className="text-base" title={card.intensity}>
                     {INTENSITY_FIRE[card.intensity] || "🔥"}
                   </span>
                 </div>

                 <div className="flex-1 flex flex-col justify-start z-10 min-h-0">
                   <h2 className="font-serif italic text-[#d4a373] mb-4 leading-snug drop-shadow-md"
                       style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                     {card.title}
                   </h2>

                   {card.session_quick_tip && (
                     <div className="mb-4 bg-black/20 border border-white/5 p-3 rounded-lg text-sm font-light italic text-white/70 flex-shrink-0">
                       💡 {card.session_quick_tip}
                     </div>
                   )}

                   <div className="opacity-90 leading-relaxed whitespace-pre-wrap font-light overflow-y-auto custom-scrollbar flex-1 pr-2"
                        style={{ fontSize: 'clamp(1.05rem, 4vw, 1.4rem)' }}>
                     {resolvedBodyText}
                   </div>

                   <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                   </div>
                 </div>

                 {meta.current_receiver && meta.current_receiver !== "NONE" && meta.current_receiver !== "ANY" && (
                   <div className="mt-8 pt-4 border-t border-white/10 z-10 text-center">
                     <span className="text-sm font-medium tracking-wide text-[var(--color-copper)] drop-shadow-md">
                       {meta.current_receiver === "MAN" ? "Agora é com você, gato." : "Agora é com ela."}
                     </span>
                   </div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Video panel for Roxo cards */}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl max-w-sm md:max-w-md lg:max-w-lg landscape:max-w-[65vw]"
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
      </div>

      {/* Pace Dial - Above actions */}
      {showPaceMenu && session && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0 flex justify-center px-4 mb-2">
          <div className="max-w-xs flex justify-center items-center bg-[#130c0a]/80 backdrop-blur-md border border-white/5 p-1 rounded-full relative z-20 shadow-lg">
            <button disabled={isChangingPace} onClick={() => handlePaceChoice("SLOWER")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Devagar</button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button disabled={isChangingPace} onClick={() => handlePaceChoice("SAME")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Assim</button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button disabled={isChangingPace} onClick={() => handlePaceChoice("FASTER")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-[#d4a373] transition-colors disabled:opacity-50">Acelerar</button>
          </div>
        </motion.div>
      )}

      {/* Actions Bar - Bottom */}
      <div className="flex-shrink-0 bg-[var(--color-background-primary)] border-t border-white/5 px-2 sm:px-4 py-3 safe-area-inset-bottom overflow-x-auto relative z-30" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
        <div className="flex justify-center items-end gap-2 w-full max-w-4xl mx-auto flex-nowrap md:flex-wrap overflow-x-auto custom-scrollbar pb-1 px-1">

          {card.is_invertible && session.inversions_used < 2 && (
            <button
              onClick={() => fetchNext("INVERT")}
              disabled={loading || !isFlipped}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all border text-sm font-medium ${isFlipped ? "bg-white/5 hover:bg-white/10 border-white/10 text-white/70" : "bg-white/5 opacity-30 cursor-not-allowed border-transparent text-white/30"}`}
              title="Inverter perspectiva da carta"
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Inverter</span>
            </button>
          )}

          {session.current_position >= 2 && (
            <button
              onClick={handleHotPause}
              disabled={loading || !isFlipped || isInsertingPause}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all border text-sm font-medium ${isFlipped ? "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 text-orange-400" : "bg-white/5 opacity-30 cursor-not-allowed border-transparent text-white/30"}`}
            >
              {isInsertingPause ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
              <span className="hidden sm:inline">Pausa Quente</span>
            </button>
          )}

          {resolvedShortText && audioState !== "MISSING" && (
            <button
              onClick={handlePlayVoice}
              disabled={!isFlipped || audioState === "LOADING" || audioState === "ERROR"}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg transition-all border text-sm font-medium ${isFlipped && audioState !== "ERROR" ? "bg-white/5 hover:bg-white/10 border-[var(--color-copper)]/30 text-[var(--color-copper)]" : "bg-white/5 opacity-30 cursor-not-allowed border-transparent text-white/30"}`}
              title={audioState === "ERROR" ? "Áudio indisponível" : "Ouvir narração"}
            >
              {audioState === "LOADING" && <Loader2 className="w-4 h-4 animate-spin text-white/50" />}
              {audioState === "PLAYING" && <Volume2 className="w-4 h-4 text-[#d4a373]" />}
              {audioState === "IDLE" && <Volume2 className="w-4 h-4" />}
              {audioState === "ERROR" && <VolumeX className="w-4 h-4 text-red-400" />}
              <span className="hidden sm:inline">
                {audioState === "LOADING" ? "Prep..." :
                 audioState === "PLAYING" ? "Parar" :
                 audioState === "ERROR" ? "Erro" : "Ouvir"}
              </span>
            </button>
          )}

          {session.skips_used < 2 && (
            <button
              onClick={() => fetchNext("SKIP")}
              disabled={loading || !isFlipped}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg transition-all border text-sm font-medium ${isFlipped ? "bg-white/5 hover:bg-white/10 border-white/10 text-white/70" : "bg-white/5 opacity-30 cursor-not-allowed border-transparent text-white/30"}`}
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden sm:inline">Pular</span>
            </button>
          )}

          <button
            onClick={() => fetchNext("NEXT")}
            disabled={loading || !isFlipped}
            className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-6 sm:px-8 py-3 rounded-lg transition-all border font-medium ${isFlipped ? "bg-[#B9825A] hover:brightness-110 border-transparent shadow-lg text-white" : "bg-white/5 opacity-50 cursor-not-allowed border-white/5 text-white/30"}`}
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Próxima</span>
          </button>
        </div>
      </div>

      {/* Audio Player - Integrated into bottom bar */}
      {session.music_enabled && (
        <div className="flex-shrink-0 flex justify-center px-4 py-2 border-t border-white/5">
          <AudioPlayer enabled={session.music_enabled} />
        </div>
      )}
    </div>
  );
}
