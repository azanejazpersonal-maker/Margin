import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  ArrowRight, 
  HelpCircle, 
  Sliders, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Sparkles,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculations';

export const LandingPage: React.FC = () => {
  const { setActiveTab, summary, settings } = useBusiness();

  return (
    <div className="space-y-24 py-6 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-8 pt-6 sm:pt-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-xs text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>FUSE Society Blueprint 2026 Project</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
          Know where your business makes money.
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
          Understand your money, find costly problems, and make smarter business decisions without needing to be a finance expert.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('howitworks')}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#151515] text-white border border-neutral-800 font-medium text-sm hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <span>How It Works</span>
            <HelpCircle className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Quiet disclaimer */}
        <p className="text-xs text-neutral-400">
          No sign-up required. Completely private to your browser. Type whatever you sell and watch your money in real time.
        </p>
      </section>

      {/* Live Preview Container */}
      <section className="relative rounded-2xl border border-neutral-800 bg-[#101010] overflow-hidden shadow-2xl">
        <div className="border-b border-neutral-800 px-4 py-3 flex items-center justify-between bg-[#151515]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
            <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
            <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
            <span className="text-xs text-neutral-400 font-mono ml-2">
              margin.app / {settings.businessName}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs text-white hover:underline font-medium"
          >
            Launch Interactive View →
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top 3 simple question cards preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#151515] border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">1. Money Earned</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {formatCurrency(summary.totalRevenue, settings.currency)}
              </div>
              <p className="text-xs text-neutral-400">Total customer sales across all menu items</p>
            </div>

            <div className="bg-[#151515] border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">2. Money Spent</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {formatCurrency(summary.totalMoneySpent, settings.currency)}
              </div>
              <p className="text-xs text-neutral-400">Product ingredients plus monthly rent and bills</p>
            </div>

            <div className="bg-[#151515] border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">3. Money Left</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                {formatCurrency(summary.netProfit, settings.currency)}
              </div>
              <p className="text-xs text-neutral-400">What stays in your bank account at month end</p>
            </div>
          </div>

          {/* Photographic cafe preview and instant leak banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 rounded-xl overflow-hidden border border-neutral-800 relative group">
              <img 
                src="/src/assets/images/demo_cafe_monochrome_1793255992062.jpg" 
                alt="Minimalist monochrome artisan cafe demonstration setting" 
                className="w-full h-64 object-cover filter grayscale contrast-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Live Business View</span>
                  <div className="text-white text-base font-semibold">{settings.businessName}</div>
                  <div className="text-xs text-neutral-300">Track and optimize your products in real time</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="border border-neutral-800 bg-[#151515] p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                  <Search className="w-3.5 h-3.5" />
                  <span>Automatic Leak Detection</span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Instantly flags any item that sells at a loss
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  If an item costs you more to make than customers pay, MARGIN sounds the alarm so you don't quietly bleed money.
                </p>
                <button
                  onClick={() => setActiveTab('whatif')}
                  className="text-xs text-white font-medium underline underline-offset-4 hover:text-neutral-300"
                >
                  Simulate fixing this in What If →
                </button>
              </div>

              <div className="border border-neutral-800 bg-[#151515] p-5 rounded-xl space-y-2">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Plain-English Promise</span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every number is explained in everyday language with small "What does this mean?" buttons throughout the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">The Problem</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Financial software is built for accountants, not business owners.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Most small business owners know their craft — making coffee, crafting clothes, or serving clients. But traditional spreadsheets and accounting software bury critical answers under dense jargon like COGS, EBITDA, and amortization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="border border-neutral-800/80 bg-[#121212] p-6 rounded-xl space-y-3">
            <div className="text-xs font-mono text-neutral-400 uppercase">Typical Accounting Software</div>
            <p className="text-sm text-neutral-400 line-through">
              "Gross Profit Margin decomposed across standard Operating Expenditure amortization schedules."
            </p>
            <p className="text-xs text-neutral-400">
              Confusing, impersonal, and leaves owners guessing what actually needs fixing.
            </p>
          </div>

          <div className="border border-white/20 bg-[#151515] p-6 rounded-xl space-y-3">
            <div className="text-xs font-mono text-white uppercase font-bold">The MARGIN Way</div>
            <p className="text-sm text-white font-medium">
              "How much you keep from each sale after paying for products, and how much is left to pay your rent and wages."
            </p>
            <p className="text-xs text-neutral-300">
              Zero jargon, immediate clarity, and clear next steps anyone can understand.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Key Product Benefits */}
      <section className="space-y-8">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Benefits</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Three simple questions. Clear answers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-800 bg-[#151515] p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-semibold text-white">Find the Hidden Leaks</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Instantly see if any product is quietly losing you money on every sale, or if one bloated bill is eating all your earnings.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#151515] p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-semibold text-white">Simulate Price Changes Safely</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Test what happens to your bank account if you raise prices by 25 cents or negotiate 10% off supplier costs — with no real-world risk.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#151515] p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-semibold text-white">Plain English Guidance</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Get practical, step-by-step suggestions powered by Gemini AI when configured, backed by transparent rule-based analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="space-y-6">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Who It Is For</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for real-world small businesses
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-neutral-800 bg-[#121212] p-4 rounded-xl space-y-2 text-center">
            <Store className="w-6 h-6 text-white mx-auto" />
            <div className="text-sm font-semibold text-white">Cafes & Bakeries</div>
            <p className="text-[11px] text-neutral-400">Track high-volume coffees, food prep costs, and milk bills.</p>
          </div>

          <div className="border border-neutral-800 bg-[#121212] p-4 rounded-xl space-y-2 text-center">
            <TrendingUp className="w-6 h-6 text-white mx-auto" />
            <div className="text-sm font-semibold text-white">Independent Shops</div>
            <p className="text-[11px] text-neutral-400">Discover which retail items provide genuine cash after wholesale buy-in.</p>
          </div>

          <div className="border border-neutral-800 bg-[#121212] p-4 rounded-xl space-y-2 text-center">
            <Sparkles className="w-6 h-6 text-white mx-auto" />
            <div className="text-sm font-semibold text-white">Online Stores</div>
            <p className="text-[11px] text-neutral-400">Factor shipping, packing boxes, and merchant fees into product margins.</p>
          </div>

          <div className="border border-neutral-800 bg-[#121212] p-4 rounded-xl space-y-2 text-center">
            <FileSpreadsheet className="w-6 h-6 text-white mx-auto" />
            <div className="text-sm font-semibold text-white">Local Services</div>
            <p className="text-[11px] text-neutral-400">Understand cleaner, mechanic, or contractor hourly job profits.</p>
          </div>
        </div>
      </section>

      {/* Transparency & Freedom */}
      <section className="border border-neutral-800 bg-[#101010] p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Your Business, Your Rules</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          Full freedom to track any business or start fresh.
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          You can add whatever items or services you sell, change your currency symbol in one click, and track your actual bills. Everything stays private inside your browser. You can clear all data or load starter ideas anytime in Settings.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 space-y-6 border-t border-neutral-800">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Ready to find the leak in your business?
        </h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Explore the live dashboard, adjust sample numbers, or input your own products.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-8 py-3.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span>Open Live Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Subtle Creator Credit in Footer */}
      <footer className="pt-8 pb-12 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
        <div>
          <span>MARGIN — Find the leak. Fix the business.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Created by Azan Ejaz | Vibe-coded with AI</span>
          <span>·</span>
          <a
            href="https://www.instagram.com/azaneejaz_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            @azaneejaz_
          </a>
        </div>
      </footer>
    </div>
  );
};
