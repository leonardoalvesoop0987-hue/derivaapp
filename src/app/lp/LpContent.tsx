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
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyClick = () => {
    setIsLoading(true);
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Global Sales Toast */}
      {/* Removed Toast */}

      <HeroSection onBuyClick={handleBuyClick} isLoading={isLoading} />
      <WhyItWorksSection />
      <ForHerForHimSection />
      <AppAndPhysicalSection onBuyClick={handleBuyClick} isLoading={isLoading} />
      <DeckStructureSection />
      <SmartRandomSection />
      <IdealMomentsSection />
      <MediaAndMusicSection />
      <RelationshipSection />
      <TestimonialsSection />
      <FaqSection />
      <OfferSection onBuyClick={handleBuyClick} isLoading={isLoading} />
      <LpFooter />
    </div>
  );
}
