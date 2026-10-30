import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ExplainButton } from '../components/ExplainButton';
import { 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  Sliders, 
  ShieldAlert, 
  FileSpreadsheet
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActiveTab } = useBusiness();

  return (
    <div className="space-y-12 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto border-b border-neutral-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-xs text-neutral-400">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>Simple Financial Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How MARGIN Works
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed text-balance">
          We built MARGIN so that any small business owner can understand their numbers in minutes without reading a textbook.
        </p>
      </div>

      {/* THE THREE MANDATORY STEPS */}
      <div className="space-y-6">
        {/* STEP 1 */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
              01
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">Step 1</span>
              <h2 className="text-xl font-bold text-white">Add Your Numbers</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-300 italic border-l-2 border-neutral-700 pl-3">
            "Enter what you sell, how much it costs, and what you spend."
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            You don't need complicated balance sheets. You only need basic information: what you charge customers for each item, what ingredients or wholesale costs you paid, and your monthly store bills (like rent, electricity, and staff wages).
          </p>
          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800/80 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500 font-sans text-[11px] block mb-1">Simple Cafe Example:</span>
            Oat Milk Latte: Sells for $5.50 · Ingredients cost $1.40 · Sold 850 cups this month.
          </div>
        </div>

        {/* STEP 2 */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
              02
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">Step 2</span>
              <h2 className="text-xl font-bold text-white">Understand Your Business</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-300 italic border-l-2 border-neutral-700 pl-3">
            "See where your money comes from and where it goes."
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            MARGIN immediately answers three simple questions: How much money came in? How much money went out? How much money was left? It flags products where you might be losing money on every sale, and pinpoints your biggest monthly bill.
          </p>
          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800/80 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500 font-sans text-[11px] block mb-1">Calculations Explained:</span>
            Money Left After Products = (Selling Price − Product Cost) × Number Sold
            <br />
            Example: ($5.50 − $1.40) × 850 = $3,485 left over to help pay your cafe rent!
          </div>
        </div>

        {/* STEP 3 */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
              03
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">Step 3</span>
              <h2 className="text-xl font-bold text-white">Explore Better Choices</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-300 italic border-l-2 border-neutral-700 pl-3">
            "Try different prices and costs to understand how they could affect your business."
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Before changing prices in your store, test them in the "What If I Change Something?" simulator. Move sliders to see how a 25¢ price increase or a 5% cheaper supplier alters your month-end bank balance.
          </p>
          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800/80 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500 font-sans text-[11px] block mb-1">Risk-Free Experiment:</span>
            Raise coffee by 25¢ across 1,000 customers = $250 extra cash each month directly into your pocket.
          </div>
        </div>
      </div>

      {/* CORE FINANCIAL FORMULAS IN SIMPLE ENGLISH */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            How The Math Works (No Secrets)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Every calculation in MARGIN is 100% open, verified, and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Money Earned (Revenue)</span>
              <ExplainButton termKey="revenue" />
            </div>
            <code className="block font-mono text-[11px] text-neutral-300">
              Selling Price × Units Sold
            </code>
            <p className="text-neutral-400 text-[11px]">
              If you sell 100 sandwiches at $10 each, you earned $1,000.
            </p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Money Left After Products</span>
              <ExplainButton termKey="grossProfit" />
            </div>
            <code className="block font-mono text-[11px] text-neutral-300">
              (Selling Price − Unit Cost) × Units Sold
            </code>
            <p className="text-neutral-400 text-[11px]">
              If bread and cheese cost $4 per sandwich, you keep $6 per sale ($600 total).
            </p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">How Much You Keep (Margin %)</span>
              <ExplainButton termKey="grossMargin" />
            </div>
            <code className="block font-mono text-[11px] text-neutral-300">
              (Selling Price − Unit Cost) / Selling Price × 100
            </code>
            <p className="text-neutral-400 text-[11px]">
              ($10 − $4) / $10 = 60%. You keep 60 cents out of every dollar.
            </p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Bottom Line (Total Money Left)</span>
              <ExplainButton termKey="netProfit" />
            </div>
            <code className="block font-mono text-[11px] text-neutral-300">
              Money Left After Products − Store Rent & Bills
            </code>
            <p className="text-neutral-400 text-[11px]">
              $600 left from sandwiches − $400 storefront rent = $200 true profit.
            </p>
          </div>
        </div>
      </div>

      {/* MANDATORY ESTIMATE DISCLAIMER */}
      <div className="border border-neutral-800 bg-[#101010] p-6 rounded-xl space-y-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2 font-bold text-neutral-300">
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>Estimates & Practical Decisions</span>
        </div>
        <p className="leading-relaxed">
          MARGIN provides estimates, calculations, and structured suggestions based on the information you provide. It is not an accounting firm or financial advisor, and does not promise guaranteed financial results. In business, customer taste, competition, and seasons will always play a role. Use MARGIN as your analytical co-pilot to test ideas before putting real dollars at risk.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span>Try the Live Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
