import type { Metadata } from "next";
import { LpContent } from "./LpContent";

export const metadata: Metadata = {
  title: "Deriva — App e deck sensual para casais",
  description:
    "Uma experiência guiada para casais adultos, idealizada com olhar de Psicologia e Sexologia Clínica, com cartas, sorteios inteligentes, música, progressão e versão física em casa.",
  openGraph: {
    title: "Deriva — App e deck sensual para casais",
    description:
      "Uma experiência guiada para casais adultos, idealizada com olhar de Psicologia e Sexologia Clínica, com cartas, sorteios inteligentes, música, progressão e versão física em casa.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary font-sans selection:bg-red-deep/30">
      <LpContent />
    </main>
  );
}
