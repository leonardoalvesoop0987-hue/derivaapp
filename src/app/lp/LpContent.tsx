"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HeroSection } from "@/components/lp/HeroSection";
import { InteractiveSampleCardSection } from "@/components/lp/InteractiveSampleCardSection";
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
import { AtmosphereCarouselSection } from "@/components/lp/AtmosphereCarouselSection";
import { AtmosphericClosingSection } from "@/components/lp/AtmosphericClosingSection";
import { OfferSection } from "@/components/lp/OfferSection";
import { LpFooter } from "@/components/lp/LpFooter";
import { FounderAuthoritySection } from "@/components/lp/FounderAuthoritySection";
import { PurchaseLeadModal } from "@/components/lp/PurchaseLeadModal";

export function LpContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative overflow-x-hidden">
      <PurchaseLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <HeroSection onBuyClick={handleBuyClick} isLoading={false} />
      <InteractiveSampleCardSection />
      <WhyItWorksSection />
      <ForHerForHimSection />
      <AppAndPhysicalSection onBuyClick={handleBuyClick} isLoading={false} />
      <DeckStructureSection />
      <AtmosphereCarouselSection />
      <SmartRandomSection />
      <IdealMomentsSection />
      <MediaAndMusicSection />
      <RelationshipSection />
      <FounderAuthoritySection />
      <TestimonialsSection />
      <FaqSection />
      <AtmosphericClosingSection />
      <OfferSection onBuyClick={handleBuyClick} isLoading={false} />
      <LpFooter />
    </div>
  );
}
