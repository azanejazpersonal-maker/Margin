import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { User, Sparkles, Instagram, ArrowRight, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useBusiness();

  return (
    <div className="space-y-12 p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Hero Profile Block */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-8 sm:p-12 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-2xl mx-auto shadow-xl">
          AE
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Created by Azan Ejaz
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 font-medium">
            Vibe-coded with AI. Built to make business easier.
          </p>
        </div>

        {/* Clickable Instagram link */}
        <div className="pt-2">
          <a
            href="https://www.instagram.com/azaneejaz_/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#101010] border border-neutral-700 hover:border-white text-white font-mono text-xs transition-colors group"
          >
            <Instagram className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            <span>Instagram: <strong className="underline underline-offset-2">@azaneejaz_</strong></span>
          </a>
        </div>

        {/* Required Description */}
        <div className="pt-4 border-t border-neutral-800/80 max-w-xl mx-auto">
          <p className="text-sm text-neutral-400 leading-relaxed">
            MARGIN helps small business owners understand their money, find problems, and make smarter decisions without needing to be a finance expert.
          </p>
        </div>
      </div>

      {/* Why I Built MARGIN Section (Exact Required Text) */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-8 sm:p-10 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Why I Built MARGIN
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
          I built MARGIN to make business information easier to understand. Many business owners find financial data confusing, so I wanted to create a simple tool that turns numbers into clear explanations and useful suggestions.
        </p>
      </div>

      {/* Blueprint 2026 Context & Approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-400">
        <div className="bg-[#151515] border border-neutral-800 p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-semibold text-white">The Design Philosophy</h3>
          <p className="leading-relaxed">
            Strict black-and-white minimalist design. No noise, no fake metrics, no candy-colored dashboards. Just pure numbers, simple English, and verified business arithmetic.
          </p>
        </div>

        <div className="bg-[#151515] border border-neutral-800 p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-semibold text-white">Built for the Blueprint 2026 Hackathon</h3>
          <p className="leading-relaxed">
            Designed as a complete, functioning prototype demonstrating analytical thinking, commercial viability, transparent AI co-piloting, and real-world small business utility.
          </p>
        </div>
      </div>

      {/* Navigation Return */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span>Explore the Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Required Footer Credit */}
      <div className="text-center pt-8 border-t border-neutral-800 text-xs text-neutral-500 font-mono">
        Created by Azan Ejaz | Vibe-coded with AI
      </div>
    </div>
  );
};
