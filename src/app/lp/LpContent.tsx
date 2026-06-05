"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HeroSection } from "@/components/lp/HeroSection";
import { WhyItWorksSection } from "@/components/lp/WhyItWorksSection";
import { ForHerForHimSection } from "@/components/lp/ForHerForHimSection";
import { AppAndPhysicalSection } from "@/components/lp/AppAndPhysicalSection";
import { DeckStructureSection } from "@/components/lp/DeckStructureSection";
import { SmartRandomSection } from "@/components/lp/SmartRandomSection";
import { IdealMomentsSection } from "@/components/lp/IdealMomentsSection";
import { MediaAndMusicSection } from "@/components/lp/MediaAndMusicSection";
import { RelationshipSection } from "@/components/lp/RelationshipSection";
import { TestimonialsSection } from "@/components/lp/TestimonialsSection";
import { FaqSection } from "@/components/lp/FaqSection";
import { OfferSection } from "@/components/lp/OfferSection";
import { LpFooter } from "@/components/lp/LpFooter";

export function LpContent() {
  const [showToast, setShowToast] = useState(false);

  const handleBuyClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Global Sales Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-copper/30 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 w-[90%] max-w-md"
          >
            <div className="w-2 h-2 rounded-full bg-copper animate-pulse shrink-0" />
            <p className="text-sm font-medium text-text-primary">
              Compra online em ativação. Em breve você poderá finalizar o pedido por aqui.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection onBuyClick={handleBuyClick} />
      <WhyItWorksSection />
      <ForHerForHimSection />
      <AppAndPhysicalSection onBuyClick={handleBuyClick} />
      <DeckStructureSection />
      <SmartRandomSection />
      <IdealMomentsSection />
      <MediaAndMusicSection />
      <RelationshipSection />
      <TestimonialsSection />
      <FaqSection />
      <OfferSection onBuyClick={handleBuyClick} />
      <LpFooter />
    </div>
  );
}
