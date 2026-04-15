"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Smartphone, ExternalLink } from "lucide-react";
import WaitlistModal from "@/components/common/WaitlistModal";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import JourneySection from "@/components/sections/JourneySection";

export default function PortalPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className="min-h-screen bg-stone-950 text-white overflow-x-hidden selection:bg-primary selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center bg-stone-950/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Compass className="text-stone-950" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">HARMONY</span>
        </div>
        <button 
          onClick={() => setIsWaitlistOpen(true)}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Smartphone size={16} /> MOBILE APP
        </button>
      </nav>

      <HeroSection />
      <AboutSection />
      <EcosystemSection />
      <BenefitsSection />
      <SocialProofSection />
      <JourneySection />

      <footer className="p-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs gap-6 bg-stone-950">
        <p>© 2026 Vutera Harmony Ecosystem. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Terms</a>
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">VUTERA.NET <ExternalLink size={10} /></a>
        </div>
      </footer>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
