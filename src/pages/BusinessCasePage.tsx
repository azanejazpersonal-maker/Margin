import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Briefcase, 
  Target, 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckSquare, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const BusinessCasePage: React.FC = () => {
  const { setActiveTab } = useBusiness();

  return (
    <div className="space-y-12 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3 border-b border-neutral-800 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-xs text-neutral-400">
          <Briefcase className="w-3.5 h-3.5 text-white" />
          <span>FUSE Society Blueprint 2026 Submission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Business Analysis & Strategy
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed text-balance">
          A rigorous, honest commercial breakdown of MARGIN: problem validation, target market, proposed business model, and risk mitigation.
        </p>
      </div>

      {/* Grid of Analytical Sections */}
      <div className="space-y-8 text-xs text-neutral-300">
        {/* 1. Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 font-bold">
              01. The Problem
            </span>
            <h2 className="text-base font-bold text-white">The Financial Jargon Gap</h2>
            <p className="leading-relaxed text-neutral-400">
              Small business owners — from independent baristas to boutique shopkeepers — excel at their trade but frequently struggle with accounting jargon. Traditional accounting systems (QuickBooks, Xero) produce balance sheets with COGS, amortization, and EBITDA schedules that intimidate non-specialists.
            </p>
            <p className="leading-relaxed text-neutral-400">
              Consequently, owners often fail to identify when an individual menu item is selling at a loss or which bills quietly consume their margin.
            </p>
          </div>

          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono text-white font-bold">
              02. The Solution
            </span>
            <h2 className="text-base font-bold text-white">Plain-English Profit Intelligence</h2>
            <p className="leading-relaxed text-neutral-300">
              MARGIN translates complex ledger math into three everyday questions: <em>"How much came in? How much went out? How much was left?"</em>
            </p>
            <p className="leading-relaxed text-neutral-300">
              It automatically alerts owners to loss-making products, provides an interactive simulator to test price adjustments without risk, and pairs deterministic math with Gemini AI co-piloting.
            </p>
          </div>
        </div>

        {/* 2. Target Market & Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 font-bold">
              03. Target Market
            </span>
            <h2 className="text-base font-bold text-white">Initial Beachhead & Expansion</h2>
            <p className="leading-relaxed text-neutral-400">
              <strong>Initial Focus:</strong> Independent cafes, coffee shops, and small artisan bakeries (estimated 65,000+ establishments in the US alone). High unit volumes with volatile ingredient prices (dairy, coffee beans) make margin awareness urgent.
            </p>
            <p className="leading-relaxed text-neutral-400">
              <strong>Secondary Expansion:</strong> Independent retail boutiques, local service providers (cleaning, landscaping), and home-based craft sellers.
            </p>
          </div>

          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 font-bold">
              04. Quantifiable Value
            </span>
            <h2 className="text-base font-bold text-white">Immediate Bottom-Line Impact</h2>
            <p className="leading-relaxed text-neutral-400">
              Even a tiny 25-cent price adjustment on a cafe's top 2 beverage items across 1,500 monthly transactions yields an extra $375 per month ($4,500/yr) of pure margin.
            </p>
            <p className="leading-relaxed text-neutral-400">
              Eliminating a single loss-leader product leak protects hundreds of dollars of cash that would otherwise drain unnoticed.
            </p>
          </div>
        </div>

        {/* 3. Business Model (Proposed) */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 font-bold">
                05. Proposed Business Model
              </span>
              <h2 className="text-lg font-bold text-white">Freemium SaaS Architecture (Proposal)</h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Commercial Proposal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-white">Free Starter Tier</span>
              <div className="text-lg font-bold text-white font-mono">$0 / month</div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Full offline access, up to 15 products, 10 expenses, rule-based suggestions, manual CSV import/export, and simulator.
              </p>
            </div>

            <div className="bg-[#121212] p-4 rounded-lg border-2 border-white/20 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Pro Store Tier</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-white text-black font-bold rounded">Target</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">$19 / month (Proposed)</div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Unlimited products, automated POS sync (Square, Clover), Gemini AI smart suggestions, multi-period trend reporting.
              </p>
            </div>

            <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-white">Multi-Location Tier</span>
              <div className="text-lg font-bold text-white font-mono">$49 / month (Proposed)</div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Comparative analysis across 2 to 5 storefront branches, group ingredient bulk discount tracking, and manager permissions.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Implementation Plan: What is built vs What is next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Implemented In This Prototype</span>
            </div>
            <ul className="space-y-1.5 text-neutral-300 text-[11px] list-disc list-inside">
              <li>Three-question dashboard (Money Earned, Spent, Left)</li>
              <li>Complete product profitability & loss-leak detection</li>
              <li>Operating expense grouping & dominant cost tracker</li>
              <li>"What If I Change Something?" real-time simulator</li>
              <li>Live Google Gemini 3.8 Flash AI with rule fallback</li>
              <li>Interactive "Ask MARGIN" plain-English co-pilot</li>
              <li>Working CSV export & import with column validation</li>
              <li>Local browser persistence and demo preset management</li>
            </ul>
          </div>

          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>Future Roadmap (Post-Hackathon)</span>
            </div>
            <ul className="space-y-1.5 text-neutral-400 text-[11px] list-disc list-inside">
              <li>Direct OAuth integration with Square and Toast POS terminals</li>
              <li>Automatic invoice photo receipt parsing via Gemini Vision</li>
              <li>Multi-location comparative franchise dashboards</li>
              <li>Supplier price alert notifications via SMS / email</li>
              <li>Staff wage scheduling and hourly sales-per-labor-hour tracking</li>
            </ul>
          </div>
        </div>

        {/* 5. Costs & Operational Economics */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 font-bold">
            06. Operational Cost Breakdown (Estimates)
          </span>
          <h2 className="text-base font-bold text-white">Cost Structure & Unit Economics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#101010] p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-[11px]">Prototype & Hosting:</span>
              <div className="font-mono text-white font-semibold">~$0 - $15 / month</div>
              <p className="text-[10px] text-neutral-500">Cloud Run container scale-to-zero free tier.</p>
            </div>
            <div className="bg-[#101010] p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-[11px]">Gemini 3.8 Flash API:</span>
              <div className="font-mono text-white font-semibold">&lt; $0.001 / query</div>
              <p className="text-[10px] text-neutral-500">Highly cost-efficient token pricing; fallback engine costs $0.</p>
            </div>
            <div className="bg-[#101010] p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-[11px]">Customer Support & Ops:</span>
              <div className="font-mono text-white font-semibold">~10% of MRR</div>
              <p className="text-[10px] text-neutral-500">Self-serve interface minimizes onboarding overhead.</p>
            </div>
          </div>
        </div>

        {/* 6. Risks & Mitigation */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Risks & Honest Counter-Measures</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1 bg-[#101010] p-3 rounded border border-neutral-800">
              <div className="font-semibold text-white">Risk: Inaccurate Input Data</div>
              <p className="text-neutral-400 text-[11px]">
                If a user enters flawed cost figures, the recommendations reflect that error.
                <br />
                <strong>Mitigation:</strong> Clear disclaimers stating that all simulator outputs are estimates, paired with inline sanity checks (e.g. flagging negative unit costs or extreme margin percentages).
              </p>
            </div>

            <div className="space-y-1 bg-[#101010] p-3 rounded border border-neutral-800">
              <div className="font-semibold text-white">Risk: AI Hallucinations in Math</div>
              <p className="text-neutral-400 text-[11px]">
                LLMs can occasionally err on complex multi-variable arithmetic.
                <br />
                <strong>Mitigation:</strong> We strictly decouple math from AI. 100% of arithmetic is calculated in pure TypeScript formulas; the AI only interprets the pre-calculated numbers.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Validation Strategy */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <CheckSquare className="w-4 h-4 text-white" />
            <span>Customer Validation Plan</span>
          </div>
          <p className="leading-relaxed text-neutral-400">
            <em>Honesty Disclosure:</em> As a hackathon prototype, we have not claimed fictitious customer testimonials or fabricated market research.
          </p>
          <p className="leading-relaxed text-neutral-300">
            <strong>Proposed Validation Protocol:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px]">
            <li>Recruit 5 local independent coffee shops in our city for a 14-day beta trial.</li>
            <li>Have the owners input their top 10 items and past month utility bills.</li>
            <li>Measure comprehension using a before/after 5-question comprehension benchmark.</li>
            <li>Track whether any owner took action (e.g., adjusted a 25¢ price or changed supplier) based on the simulator.</li>
          </ol>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span>Return to Application</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
