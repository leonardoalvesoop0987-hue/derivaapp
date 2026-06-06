"use client";

import { useState, useEffect, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SkipForward, Repeat, Check, X, Flame, Volume2, VolumeX, Loader2, Wind } from "lucide-react";
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
  
  const [audioState, setAudioState] = useState<"IDLE" | "LOADING" | "PLAYING" | "ERROR">("IDLE");
  const [voiceSettings, setVoiceSettings] = useState<{enabled: boolean, playbackMode: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    setAudioState("IDLE");
  }, [card?.id]);

  function renderCardBody(body: string) {
    return body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();
  }

  useEffect(() => {
    if (isFlipped && voiceSettings?.enabled && voiceSettings?.playbackMode === "automatic" && audioState === "IDLE") {
      const t = setTimeout(() => {
        handlePlayVoice().catch(console.error);
      }, 500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, voiceSettings, audioState, card?.id]);

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
    } catch(err) {
      console.error(err);
    }
    setIsChangingPace(false);
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
    if (audioState === "LOADING") return;

    setAudioState("LOADING");
    try {
      const textToRead = card?.session_short_text?.trim();
      
      if (!textToRead) {
        setAudioState("ERROR");
        return;
      }

      const res = await fetch("/api/session/card-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card?.id, text: textToRead }),
      });
      
      const data = await res.json();
      
      if (!data.enabled || !data.audioUrl) {
        setAudioState("ERROR");
        return;
      }

      const audio = new Audio(data.audioUrl);
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



  if (completed) {
    return (
      <div className="flex flex-col min-h-[100dvh] pt-12 pb-[calc(1.5rem+env(safe-area-inset-bottom))] px-6 items-center justify-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-[var(--color-wine)]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(153,27,27,0.3)]">
          <Flame className="w-10 h-10 text-[var(--color-copper)] animate-pulse" />
        </div>
        <h2 className="text-3xl font-serif text-[#d4a373] italic mb-4">Querem continuar?</h2>
        <p className="text-[var(--color-text-secondary)] text-base mb-10 max-w-[280px] mx-auto text-center leading-relaxed">
          O clima já está alto. Vocês decidem o que acontece a seguir.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => handleContinue("SAME")}
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] px-6 py-4 rounded-2xl text-white font-medium hover:border-[#d4a373] transition-colors text-left flex justify-between items-center"
          >
            <span>Manter a intensidade</span>
            <Flame className="w-4 h-4 text-[#d4a373]" />
          </button>
          
          <button
            onClick={() => handleContinue("LIGHTER")}
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] px-6 py-4 rounded-2xl text-white font-medium hover:border-blue-400/50 transition-colors text-left flex justify-between items-center"
          >
            <span>Diminuir o ritmo</span>
            <span className="text-sm opacity-50">Provocações suaves</span>
          </button>
          
          <button
            onClick={() => handleContinue("HEAVIER")}
            className="w-full bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-red-deep)] border border-transparent px-6 py-4 rounded-2xl text-white font-medium hover:brightness-110 transition-colors text-left flex justify-between items-center shadow-lg"
          >
            <span>Esquentar mais o jogo</span>
            <Flame className="w-5 h-5 text-white" />
          </button>
          
          <div className="h-px bg-[var(--color-border)] w-full my-3" />
          
          <button
            onClick={() => router.push(`/app/sessao/${resolvedParams.id}/feedback`)}
            className="w-full bg-transparent px-6 py-4 rounded-2xl text-[var(--color-text-secondary)] font-medium hover:text-white transition-colors text-center uppercase tracking-widest text-xs"
          >
            Encerrar o jogo
          </button>
        </div>
      </div>
    );
  }

  if (!card || !state || !session) return null;

  const bgStyle = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES["PRETO"];
  const progress = ((session.current_position + 1) / session.target_card_count) * 100;
  
  const meta = state.metadata_json ? JSON.parse(state.metadata_json) : {};

  return (
    <div className="flex flex-col min-h-[100dvh] pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      
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
        {showFullTextModal && card.session_short_text && (
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
                  {meta.rendered_body || renderCardBody(card.body)}
                </div>
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
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-black/20 px-3 py-1 rounded-full border border-white/5 shadow-inner">
            Carta {session.current_position + 1} de {session.target_card_count}
          </span>
        </div>
      </div>

      {/* Card physical container */}
      <div className="flex-1 flex flex-col justify-center max-w-sm md:max-w-md lg:max-w-xl mx-auto w-full relative perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full relative perspective-[1000px] flex-1 flex flex-col justify-center"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full min-h-[400px] md:min-h-[450px] relative cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => !isFlipped && setIsFlipped(true)}
            >
              {/* FRONT (Capa) */}
              <div 
                className={`absolute inset-0 p-8 rounded-[2rem] bg-gradient-to-br ${bgStyle} flex flex-col justify-center items-center text-center shadow-2xl shadow-black/50 border border-white/5 relative overflow-hidden`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                 <span className="text-xs text-white/50 mb-6 tracking-widest uppercase font-medium z-10">
                   {CATEGORY_NAMES[card.category] || card.category} <span className="ml-1 text-base opacity-70">{INTENSITY_FIRE[card.intensity] || "🔥"}</span>
                 </span>
                 <p className="text-4xl font-serif italic text-[#d4a373] leading-snug drop-shadow-xl z-10 px-4">
                   {meta.front_text || "A tensão sobe agora."}
                 </p>
                 <p className="absolute bottom-8 text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse z-10">Toque para revelar</p>
              </div>

              {/* BACK (Verso) */}
              <div 
                className={`absolute inset-0 p-8 rounded-[2rem] bg-gradient-to-br ${bgStyle} flex flex-col shadow-2xl shadow-black/50 border border-white/5 overflow-y-auto custom-scrollbar relative`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2rem]" />
                 
                 <div className="flex items-center justify-between mb-8 z-10">
                   <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                     {CATEGORY_NAMES[card.category] || card.category}
                   </span>
                   <span className="text-base" title={card.intensity}>
                     {INTENSITY_FIRE[card.intensity] || "🔥"}
                   </span>
                 </div>

                 <div className="flex-1 flex flex-col justify-center z-10">
                   <h2 className="text-3xl md:text-4xl font-serif italic text-[#d4a373] mb-6 leading-snug drop-shadow-md">
                     {card.title}
                   </h2>
                   
                   {card.session_quick_tip && (
                     <div className="mb-6 bg-black/20 border border-white/5 p-4 rounded-xl text-sm font-light italic text-white/70">
                       💡 {card.session_quick_tip}
                     </div>
                   )}
                   
                   <div className="text-lg md:text-xl opacity-90 leading-relaxed whitespace-pre-wrap font-light">
                     {card.session_short_text ? card.session_short_text : (meta.rendered_body || renderCardBody(card.body))}
                   </div>

                   <div className="flex items-center gap-4 mt-6">
                     {card.session_short_text && (
                       <button
                         onClick={(e) => { e.stopPropagation(); setShowFullTextModal(true); }}
                         className="text-sm border-b border-white/30 text-white/70 hover:text-white pb-0.5 transition-colors"
                       >
                         Ver detalhes
                       </button>
                     )}
                     
                     {card.session_short_text?.trim() && (
                       <button
                          onClick={handlePlayVoice}
                          disabled={audioState === "LOADING"}
                          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors ml-auto"
                          title={audioState === "ERROR" ? "Áudio indisponível" : "Ouvir narração"}
                        >
                          {audioState === "LOADING" && <Loader2 className="w-4 h-4 animate-spin" />}
                         {audioState === "PLAYING" && <Volume2 className="w-4 h-4 text-[var(--color-copper)]" />}
                         {audioState === "IDLE" && <Volume2 className="w-4 h-4" />}
                         {audioState === "ERROR" && <VolumeX className="w-4 h-4 text-red-400" />}
                         <span className={audioState === "PLAYING" ? "text-[var(--color-copper)]" : ""}>
                           {audioState === "PLAYING" ? "Parar narração" : audioState === "ERROR" ? "Não disponível" : "Ouvir carta"}
                         </span>
                       </button>
                     )}
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

      {/* Pace Dial */}
      {session && session.current_position > 3 && isFlipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xs mx-auto mb-2 flex justify-center items-center bg-[#130c0a]/80 backdrop-blur-md border border-white/5 p-1 rounded-full relative z-20 shadow-lg">
          <button disabled={isChangingPace} onClick={() => handlePaceChoice("SLOWER")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Devagar</button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button disabled={isChangingPace} onClick={() => handlePaceChoice("SAME")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Assim</button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button disabled={isChangingPace} onClick={() => handlePaceChoice("FASTER")} className="flex-1 text-[11px] font-medium tracking-wide uppercase py-2 px-3 rounded-full text-white/50 hover:bg-white/5 hover:text-[#d4a373] transition-colors disabled:opacity-50">Acelerar</button>
        </motion.div>
      )}

      {/* Actions (Floating bottom) */}
      <div className="flex justify-center items-center gap-4 md:gap-6 pt-4 pb-6 relative z-20 max-w-sm mx-auto">
        {card.is_invertible && session.inversions_used < 2 && (
          <button
            onClick={() => fetchNext("INVERT")}
            disabled={loading || !isFlipped}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all border backdrop-blur-xl ${isFlipped ? "bg-[#1a0f0d]/80 hover:bg-[#2a1815] border-white/5" : "bg-black/20 opacity-30 cursor-not-allowed border-transparent"}`}
            title={`Inverter (${2 - session.inversions_used} restantes)`}
          >
            <Repeat className="w-5 h-5 text-[#d4a373]" />
          </button>
        )}

        <button
          onClick={() => setShowAbortConfirm(true)}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-transparent hover:bg-white/5 transition-colors group"
          title="Encerrar o jogo"
        >
          <X className="w-6 h-6 text-white/40 group-hover:text-red-400 transition-colors" />
        </button>

        <button
          onClick={handleHotPause}
          disabled={loading || !isFlipped || isInsertingPause}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all border backdrop-blur-xl ${isFlipped ? "bg-[#1a0f0d]/80 hover:bg-[#2a1815] border-white/5" : "bg-black/20 opacity-30 cursor-not-allowed border-transparent"} group`}
          title="Pausa Quente"
        >
          {isInsertingPause ? <Loader2 className="w-5 h-5 text-white/60 animate-spin" /> : <Wind className="w-5 h-5 text-white/60 group-hover:text-[#d4a373] transition-colors" />}
        </button>

        {session.skips_used < 2 && (
          <button
            onClick={() => fetchNext("SKIP")}
            disabled={loading || !isFlipped}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all border backdrop-blur-xl ${isFlipped ? "bg-[#1a0f0d]/80 hover:bg-[#2a1815] border-white/5" : "bg-black/20 opacity-30 cursor-not-allowed border-transparent"}`}
            title={`Pular (${2 - session.skips_used} restantes)`}
          >
            <SkipForward className="w-5 h-5 text-white/60" />
          </button>
        )}

        <button
          onClick={() => fetchNext("NEXT")}
          disabled={loading || !isFlipped}
          className={`flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full transition-all border ${isFlipped ? "bg-[#B9825A] hover:brightness-110 border-transparent shadow-[0_0_30px_rgba(185,130,90,0.3)] hover:scale-105" : "bg-white/5 opacity-50 cursor-not-allowed border-white/5"}`}
          title="Próxima carta"
        >
          <Check className="w-7 h-7 text-white" />
        </button>
      </div>

      <AudioPlayer enabled={session.music_enabled} />
    </div>
  );
}
