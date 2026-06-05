"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, X, ArrowRight } from "lucide-react";

interface CardInfo {
  id: string;
  title: string;
  category: string;
  body: string;
  intensity: string;
}

interface SessionCardInfo {
  card_id: string;
  status: string;
  was_inverted: boolean;
  card: CardInfo;
}

type FeedbackType = "FAVORITE" | "NEUTRAL" | "NEVER_AGAIN";

const CATEGORY_NAMES: Record<string, string> = {
  AZUL: "Azul",
  DERIVA: "Deriva",
  ROSA: "Rosa",
  ROXO: "Roxa",
  VERMELHO: "Vermelha",
  PRETO: "Preta",
};

const FEEDBACK_OPTS: {
  type: FeedbackType;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  color: string;
}[] = [
  {
    type: "FAVORITE",
    icon: Heart,
    label: "Favorita",
    sublabel: "Quero sempre no meu deck",
    color: "text-pink-400 border-pink-400/30 hover:bg-pink-400/10",
  },
  {
    type: "NEUTRAL",
    icon: Minus,
    label: "Tanto faz",
    sublabel: "Sem preferência especial",
    color: "text-gray-400 border-gray-400/30 hover:bg-gray-400/10",
  },
  {
    type: "NEVER_AGAIN",
    icon: X,
    label: "Nunca mais",
    sublabel: "Remove do deck pra sempre",
    color: "text-red-400 border-red-400/30 hover:bg-red-400/10",
  },
];

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [given, setGiven] = useState<Record<string, FeedbackType>>({});
  const [loading, setLoading] = useState(false);
  const [sessionCards, setSessionCards] = useState<SessionCardInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/session/${resolvedParams.id}/cards`)
      .then((r) => r.json())
      .then((data: { cards: SessionCardInfo[] }) => {
        setSessionCards(
          (data.cards ?? []).filter((c) => c.status === "COMPLETED")
        );
      })
      .catch(() => setSessionCards([]));
  }, [resolvedParams.id]);

  async function submitFeedback(cardId: string, feedbackType: FeedbackType) {
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: resolvedParams.id,
          cardId,
          feedbackType,
        }),
      });
      setGiven((prev) => ({ ...prev, [cardId]: feedbackType }));
    } catch {
      // non-blocking
    } finally {
      setLoading(false);
    }
  }

  function finish() {
    router.push("/app");
  }

  function next() {
    if (currentIndex >= sessionCards.length - 1) {
      finish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function renderCardBody(body: string) {
    if (!body) return "";
    return body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();
  }

  const currentCard = sessionCards[currentIndex];
  const isLastCard = currentIndex >= sessionCards.length;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-light">Feedback da sessão</h2>
        <button
          onClick={finish}
          className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors border border-[var(--color-border)] px-3 py-1 rounded-full"
        >
          Pular
        </button>
      </div>

      {isLastCard || sessionCards.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-12 text-center bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] p-8">
          <Heart className="w-12 h-12 text-pink-500 mb-2" />
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {sessionCards.length === 0
              ? "Nenhuma carta concluída para avaliar."
              : "Todas as cartas foram avaliadas. O Deriva ficará cada vez melhor pra vocês!"}
          </p>
          <button
            onClick={finish}
            className="bg-[var(--color-wine)] px-8 py-4 rounded-xl font-medium hover:bg-[var(--color-red-deep)] transition-colors w-full text-white"
          >
            Voltar ao início
          </button>
        </div>
      ) : (
        <>
          <div className="text-xs text-[var(--color-text-secondary)] text-center font-medium tracking-widest uppercase mb-2">
            Carta {currentIndex + 1} de {sessionCards.length}
          </div>

          <div className="bg-[var(--color-card)] p-6 rounded-3xl border border-[var(--color-border)] shadow-lg mb-6">
            <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-4 uppercase tracking-widest flex items-center justify-between">
              <span>{CATEGORY_NAMES[currentCard.card?.category] || "Carta"}</span>
              {currentCard.was_inverted && <span className="text-[var(--color-copper)]">Ação Invertida</span>}
            </div>
            <h3 className="text-xl font-medium mb-3">
              {currentCard.card?.title ?? "Título indisponível"}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap font-light mb-2">
              {renderCardBody(currentCard.card?.body)}
            </p>
          </div>

          {given[currentCard.card_id] ? (
            <div className="text-center text-sm font-medium text-[var(--color-copper)] py-6 bg-[var(--color-wine)]/10 rounded-2xl border border-[var(--color-wine)]/20 animate-in zoom-in duration-300">
              ✓ Avaliação registrada:{" "}
              {
                FEEDBACK_OPTS.find((o) => o.type === given[currentCard.card_id])
                  ?.label
              }
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-center text-sm text-[var(--color-text-secondary)] mb-2">O que achou dessa carta?</p>
              {FEEDBACK_OPTS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() =>
                    submitFeedback(currentCard.card_id, opt.type)
                  }
                  disabled={loading}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${opt.color} bg-[var(--color-background-secondary)]`}
                >
                  <div className={`p-2 rounded-full bg-white/5`}>
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs opacity-70">
                      {opt.sublabel}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={next}
            className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium hover:bg-white/10 transition-colors"
          >
            {currentIndex < sessionCards.length - 1 ? (
              <>
                Próxima carta <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Concluir"
            )}
          </button>
        </>
      )}
    </div>
  );
}
