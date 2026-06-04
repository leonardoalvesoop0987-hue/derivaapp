import type { Metadata } from "next";
import { LpContent } from "./LpContent";

export const metadata: Metadata = {
  title: "Deriva — Deck sensual para casais",
  description:
    "Um deck físico para casais adultos que querem sair da rotina com uma experiência guiada, progressiva e mais íntima.",
  openGraph: {
    title: "Deriva — Deck sensual para casais",
    description:
      "Um deck físico para casais adultos que querem sair da rotina com uma experiência guiada, progressiva e mais íntima.",
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
