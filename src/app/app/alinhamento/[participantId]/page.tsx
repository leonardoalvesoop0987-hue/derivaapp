"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { womanQuestions, manQuestions, darkWomanQuestions, darkManQuestions, Question } from "@/lib/deriva/alignment-questions";

export default function AlinhamentoFormPage({ params }: { params: Promise<{ participantId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "standard";
  const formType = typeParam === "dark" ? "DARK_ALIGNMENT" : "STANDARD_ALIGNMENT";

  const { participantId } = use(params);

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"WOMAN" | "MAN" | null>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, number>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("/api/alignment/status")
      .then(res => res.json())
      .then(data => {
        if (data.participants) {
          const p = data.participants.find((p: { id: string; role: "WOMAN" | "MAN" }) => p.id === participantId);
          if (p) setRole(p.role);
          else router.push("/app/configuracoes");
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [participantId, router]);

  if (loading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</div>;
  if (!role) return null;

  let questions: Question[] = [];
  if (role === "WOMAN") {
    questions = formType === "DARK_ALIGNMENT" ? darkWomanQuestions : womanQuestions;
  } else {
    questions = formType === "DARK_ALIGNMENT" ? darkManQuestions : manQuestions;
  }

  const q = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep(s => s + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const answersPayload = questions.map(q => ({
      questionId: q.id,
      question: q.text,
      type: q.type,
      answer: answers[q.id]
    }));

    try {
      const res = await fetch("/api/alignment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, answers: answersPayload, formType }),
      });
      if (res.ok) setFinished(true);
      else alert("Erro ao salvar respostas.");
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-8 pb-20 mt-12">
        <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl border border-[var(--color-border)] text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-medium mb-4 text-white">Respostas salvas.</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
            Seu parceiro ou parceira não terá acesso ao que você respondeu.
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
            Agora você pode fechar esta tela ou entregar o aparelho para a outra pessoa responder o formulário dela.
          </p>
          <button
            onClick={() => router.push("/app/configuracoes")}
            className="w-full py-4 bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors rounded-xl font-medium"
          >
            Concluir
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = answers[q.id] !== undefined && 
                     (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : String(answers[q.id]).trim() !== "");

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-32">
      <div className="text-center mt-6">
        <div className="text-xs text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">
          Pergunta {currentStep + 1} de {questions.length}
        </div>
        <div className="w-full bg-[var(--color-background-secondary)] h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-copper)] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {currentStep === 0 && (
        <div className="bg-[var(--color-wine)]/20 border border-[var(--color-wine)] p-4 rounded-xl mb-4 text-center">
          <p className="text-sm text-white/90">
            Responda pensando em você, não no que imagina que seu parceiro gostaria de ouvir. Ele(a) não verá suas respostas.
          </p>
        </div>
      )}

      <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-lg">
        <h2 className="text-xl font-light leading-relaxed mb-4 text-white">{q.text}</h2>
        {q.note && (
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 italic border-l-2 border-[var(--color-copper)] pl-3">
            {q.note}
          </p>
        )}

        <div className="space-y-3 mt-6">
          {q.type === "single_choice" && q.options?.map(opt => (
            <label key={opt.value} className={`block p-4 rounded-xl border cursor-pointer transition-colors ${answers[q.id] === opt.label ? 'border-[var(--color-copper)] bg-[var(--color-copper)]/10' : 'border-[var(--color-border)] bg-[var(--color-background-secondary)] hover:border-[var(--color-text-secondary)]'}`}>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name={q.id} 
                  value={opt.label} 
                  checked={answers[q.id] === opt.label}
                  onChange={() => {
                    setAnswers(prev => ({ ...prev, [q.id]: opt.label }));
                    if (currentStep < questions.length - 1) {
                      setTimeout(() => handleNext(), 350);
                    }
                  }}
                  className="mr-3"
                />
                <span className="text-sm text-white">{opt.label}</span>
              </div>
            </label>
          ))}

          {q.type === "multi_choice" && q.options?.map(opt => {
            const currentAnswers = (answers[q.id] as string[]) || [];
            const isChecked = currentAnswers.includes(opt.label);
            return (
              <label key={opt.value} className={`block p-4 rounded-xl border cursor-pointer transition-colors ${isChecked ? 'border-[var(--color-copper)] bg-[var(--color-copper)]/10' : 'border-[var(--color-border)] bg-[var(--color-background-secondary)] hover:border-[var(--color-text-secondary)]'}`}>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => {
                      const newArr = isChecked 
                        ? currentAnswers.filter(a => a !== opt.label)
                        : [...currentAnswers, opt.label];
                      setAnswers(prev => ({ ...prev, [q.id]: newArr }));
                    }}
                    className="mr-3"
                  />
                  <span className="text-sm text-white">{opt.label}</span>
                </div>
              </label>
            );
          })}

          {q.type === "scale_0_10" && q.options?.map(opt => {
            const currentObj = (answers[q.id] as Record<string, number>) || {};
            return (
              <div key={opt.value} className="mb-4">
                <label className="block text-sm text-[var(--color-text-secondary)] mb-2">{opt.label}</label>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">0</span>
                  <input 
                    type="range" 
                    min="0" max="10" 
                    value={currentObj[opt.label] || 0}
                    onChange={(e) => {
                      setAnswers(prev => ({ 
                        ...prev, 
                        [q.id]: { ...currentObj, [opt.label]: parseInt(e.target.value) } 
                      }));
                    }}
                    className="w-full accent-[var(--color-copper)]"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">10</span>
                </div>
                <div className="text-center text-sm font-medium mt-1">{currentObj[opt.label] || 0}</div>
              </div>
            );
          })}

          {q.type === "text" && (
            <textarea
              rows={4}
              value={(answers[q.id] as string) || ""}
              onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Sua resposta..."
              className="w-full p-4 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-white focus:outline-none focus:border-[var(--color-copper)] transition-colors"
            />
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || submitting}
          className="flex-1 py-4 border border-[var(--color-border)] rounded-xl font-medium text-[var(--color-text-secondary)] hover:text-white disabled:opacity-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={!isAnswered || submitting}
          className="flex-[2] py-4 bg-[var(--color-wine)] rounded-xl font-medium hover:bg-[var(--color-red-deep)] disabled:opacity-50 transition-colors shadow-lg"
        >
          {submitting ? "Enviando..." : currentStep === questions.length - 1 ? "Finalizar" : "Avançar"}
        </button>
      </div>
    </div>
  );
}
