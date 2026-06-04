"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Heart, RotateCcw, Clock, X, ArrowRight } from "lucide-react";

interface CardInfo {
  id: string;
  title: string;
  category: string;
}

interface SessionCardInfo {
  card_id: string;
  status: string;
  card: CardInfo;
}

type FeedbackType = "FAVORITE" | "REPEAT" | "LATER" | "NEVER_AGAIN";

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
    sublabel: "Quero sempre esta carta",
    color: "text-pink-400 border-pink-400/30 hover:bg-pink-400/10",
  },
  {
    type: "REPEAT",
    icon: RotateCcw,
    label: "Repetir em breve",
    sublabel: "Aparece mais nas próximas sessões",
    color: "text-[var(--color-copper)] border-[var(--color-copper)]/30 hover:bg-[var(--color-copper)]/10",
  },
  {
    type: "LATER",
    icon: Clock,
    label: "Deixar para depois",
    sublabel: "Pode aparecer depois",
    color: "text-gray-300 border-gray-300/30 hover:bg-gray-300/10",
  },
  {
    type: "NEVER_AGAIN",
    icon: X,
    label: "Nunca mais",
    sublabel: "Remove esta carta do seu deck",
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

  const currentCard = sessionCards[currentIndex];
  const isLastCard = currentIndex >= sessionCards.length;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-light">Feedback da sessão</h2>
        <button
          onClick={finish}
          className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
        >
          Pular feedback
        </button>
      </div>

      {isLastCard || sessionCards.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <p className="text-[var(--color-text-secondary)]">
            {sessionCards.length === 0
              ? "Nenhuma carta para avaliar."
              : "Avaliação concluída. Ótima sessão!"}
          </p>
          <button
            onClick={finish}
            className="bg-[var(--color-wine)] px-8 py-3 rounded-full hover:bg-[var(--color-red-deep)] transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      ) : (
        <>
          <div className="text-xs text-[var(--color-text-secondary)] text-right">
            Carta {currentIndex + 1} de {sessionCards.length}
          </div>

          <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)]">
            <div className="text-xs text-[var(--color-text-secondary)] mb-2">
              {currentCard.card?.category}
            </div>
            <h3 className="text-lg font-medium mb-1">
              {currentCard.card?.title ?? "Carta"}
            </h3>
          </div>

          {given[currentCard.card_id] ? (
            <div className="text-center text-sm text-[var(--color-copper)] py-2">
              ✓{" "}
              {
                FEEDBACK_OPTS.find((o) => o.type === given[currentCard.card_id])
                  ?.label
              }
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {FEEDBACK_OPTS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() =>
                    submitFeedback(currentCard.card_id, opt.type)
                  }
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors ${opt.color}`}
                >
                  <opt.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs opacity-70 text-center">
                    {opt.sublabel}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={next}
            className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-card)] transition-colors"
          >
            {currentIndex < sessionCards.length - 1 ? (
              <>
                <ArrowRight className="w-4 h-4" /> Próxima carta
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
