import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ExplainButton } from '../components/ExplainButton';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Minus, 
  Layers, 
  Sliders, 
  CheckCircle, 
  ArrowRight,
  Info,
  X,
  Loader2,
  Trash2,
  Key
} from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber, calculateProduct } from '../utils/calculations';

export const DashboardPage: React.FC = () => {
  const { 
    products, 
    expenses, 
    settings, 
    summary, 
    setActiveTab, 
    sellMore, 
    clearAllData, 
    loadStarterIdeas 
  } = useBusiness();

  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [explanationSource, setExplanationSource] = useState<'ai' | 'rule' | null>(null);

  // Compute products
  const productMetrics = products.map(calculateProduct);
  const sortedByProfit = [...productMetrics].sort((a, b) => b.moneyLeft - a.moneyLeft);
  const topProduct = sortedByProfit[0] || null;
  const losingProducts = productMetrics.filter(p => p.isLosingMoney && p.product.unitsSold > 0);
  const leakProduct = losingProducts[0] || summary.lowestMarginProduct;

  const isPiggyBankGrowing = summary.netProfit > 0;
  const isPiggyBankEmpty = summary.netProfit === 0;

  // Explain My Business in super simple toddler English
  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanationText(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.geminiApiKey) {
        headers['x-gemini-api-key'] = settings.geminiApiKey;
      }

      const response = await fetch('/api/gemini/explain-business', {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          businessName: settings.businessName,
          currency: settings.currency,
          totalRevenue: summary.totalRevenue,
          totalExpenses: summary.totalMoneySpent,
          netProfit: summary.netProfit,
          topProduct: topProduct ? {
            name: topProduct.product.name,
            earned: topProduct.moneyEarned,
            left: topProduct.moneyLeft,
          } : null,
          leakProduct: leakProduct ? {
            name: leakProduct.product.name,
            margin: leakProduct.marginPercent.toFixed(1),
            left: leakProduct.moneyLeft,
          } : null,
          topExpense: summary.highestCostExpense,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.explanation) {
        setExplanationText(data.explanation);
        setExplanationSource(data.source?.startsWith('gemini') ? 'ai' : 'rule');
      } else {
        fallbackToddlerExplain();
      }
    } catch {
      fallbackToddlerExplain();
    } finally {
      setIsExplaining(false);
    }
  };

  const fallbackToddlerExplain = () => {
    setExplanationSource('rule');
    const text = isPiggyBankGrowing
      ? `Good news! Your business is making money.\n\nCustomers gave you ${formatCurrency(summary.totalRevenue, settings.currency)}. You spent ${formatCurrency(summary.totalMoneySpent, settings.currency)} on making things and paying store rent. That leaves ${formatCurrency(summary.netProfit, settings.currency)} in your pocket!\n\nYour star item is "${topProduct?.product.name || 'your items'}", which made you ${formatCurrency(topProduct?.moneyLeft || 0, settings.currency)} in pure cash. Keep selling more of it!`
      : `Warning: You are currently losing money.\n\nCustomers gave you ${formatCurrency(summary.totalRevenue, settings.currency)}, but you had to pay ${formatCurrency(summary.totalMoneySpent, settings.currency)}. That means ${formatCurrency(Math.abs(summary.netProfit), settings.currency)} left your pocket this month!\n\nTo fix this: raise prices slightly on your most popular items or reduce your largest bill (${summary.highestCostExpense?.category || 'store expenses'}).`;
    setExplanationText(text);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header: Business name with fast action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {settings.businessName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Simple money tracker: Know where your cash comes from and where it goes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExplain}
            disabled={isExplaining}
            className="px-4 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isExplaining ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reading Your Numbers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                <span>Explain in Simple Words</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className="px-3.5 py-2.5 rounded-lg bg-[#151515] text-white border border-neutral-800 text-xs hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add What You Sell</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className="px-3.5 py-2.5 rounded-lg bg-[#151515] text-neutral-300 border border-neutral-800 text-xs hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a Bill</span>
          </button>
        </div>
      </div>

      {/* AI ENGINE STATUS */}
      <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neutral-300">
          <Sparkles className="w-4 h-4 text-white shrink-0" />
          <span>
            <strong className="text-white">Gemini 3.8 AI Co-Pilot:</strong> Fast, free, and active right out of the box with zero setup required.
          </span>
        </div>
        <button
          onClick={() => setActiveTab('suggestions')}
          className="text-white font-medium hover:underline text-[11px] self-start sm:self-auto shrink-0"
        >
          Open AI Suggestions &rarr;
        </button>
      </div>

      {/* PIGGY BANK VERDICT BANNER (Toddler-simple business health) */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isPiggyBankGrowing 
          ? 'bg-emerald-950/20 border-emerald-900/60' 
          : isPiggyBankEmpty
          ? 'bg-[#151515] border-neutral-800'
          : 'bg-rose-950/20 border-rose-900/60'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-neutral-400">
              Your Piggy Bank Status
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              {isPiggyBankGrowing ? (
                <span>🎉 Good job! You are keeping <strong className="text-emerald-400">{formatCurrency(summary.netProfit, settings.currency)}</strong> in your pocket!</span>
              ) : isPiggyBankEmpty ? (
                <span>⚖️ You are breaking even. Exactly $0 is left over.</span>
              ) : (
                <span>⚠️ Ouch! You are losing <strong className="text-rose-400">{formatCurrency(Math.abs(summary.netProfit), settings.currency)}</strong> this month!</span>
              )}
            </div>
            <p className="text-xs text-neutral-400 max-w-2xl">
              {isPiggyBankGrowing
                ? 'Every time you make sales, more money enters your bank than leaves for bills.'
                : 'Your costs are bigger than what customers are paying you. Let\'s fix your prices or cut a bill.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('whatif')}
            className="px-4 py-2.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shrink-0"
          >
            Fix Numbers in Simulator &rarr;
          </button>
        </div>
      </div>

      {/* THREE GIANT MONEY BOXES (Toddler simple: In, Out, Kept) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. MONEY IN */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-3 hover:border-neutral-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              1. Money In (Sales)
            </span>
            <ExplainButton termKey="revenue" label="Explain" />
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(summary.totalRevenue, settings.currency)}
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Customers gave you this cash for buying your {formatNumber(summary.totalUnitsSold)} items.
          </p>
        </div>

        {/* 2. MONEY OUT */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-3 hover:border-neutral-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              2. Money Out (Costs)
            </span>
            <ExplainButton termKey="operatingExpenses" label="Explain" />
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(summary.totalMoneySpent, settings.currency)}
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-mono">
            {formatCurrency(summary.totalProductCosts, settings.currency)} ingredients + {formatCurrency(summary.totalOperatingExpenses, settings.currency)} store bills
          </p>
        </div>

        {/* 3. MONEY YOU KEEP */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-3 hover:border-neutral-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              3. Money in Pocket!
            </span>
            <ExplainButton termKey="netProfit" label="Explain" />
          </div>

          <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
            summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {formatCurrency(summary.netProfit, settings.currency)}
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            {summary.netProfit >= 0
              ? `You keep ${formatPercent(summary.netMarginPercent)} of every single dollar customers give you.`
              : 'You are losing money on each dollar. Action needed.'}
          </p>
        </div>
      </div>

      {/* IMMERSIVE MONEY FLOW VISUALIZER PIPELINE */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
            How Money Flows Through Your Business
          </span>
          <span className="text-xs text-neutral-500 font-mono">Real-time Stream</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Step 1: Sales */}
          <div className="bg-[#151515] border border-neutral-800 p-4 rounded-xl space-y-1 text-center">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Step 1: Customers Buy</span>
            <div className="text-lg font-bold font-mono text-white">
              +{formatCurrency(summary.totalRevenue, settings.currency)}
            </div>
            <p className="text-[11px] text-neutral-400">All money paid to you</p>
          </div>

          {/* Step 2: Product Costs */}
          <div className="bg-[#151515] border border-neutral-800 p-4 rounded-xl space-y-1 text-center">
            <span className="text-[10px] text-rose-400 font-mono uppercase">Step 2: Pay for Goods</span>
            <div className="text-lg font-bold font-mono text-neutral-300">
              -{formatCurrency(summary.totalProductCosts, settings.currency)}
            </div>
            <p className="text-[11px] text-neutral-400">Ingredients & supplies</p>
          </div>

          {/* Step 3: Running Bills */}
          <div className="bg-[#151515] border border-neutral-800 p-4 rounded-xl space-y-1 text-center">
            <span className="text-[10px] text-rose-400 font-mono uppercase">Step 3: Pay Store Bills</span>
            <div className="text-lg font-bold font-mono text-neutral-300">
              -{formatCurrency(summary.totalOperatingExpenses, settings.currency)}
            </div>
            <p className="text-[11px] text-neutral-400">Rent, power, helpers</p>
          </div>

          {/* Step 4: Your Piggy Bank */}
          <div className={`p-4 rounded-xl space-y-1 text-center border-2 ${
            summary.netProfit >= 0 ? 'bg-emerald-950/30 border-emerald-500' : 'bg-rose-950/30 border-rose-500'
          }`}>
            <span className="text-[10px] font-mono uppercase font-bold text-white">Step 4: Your Pocket!</span>
            <div className={`text-xl font-extrabold font-mono ${
              summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {formatCurrency(summary.netProfit, settings.currency)}
            </div>
            <p className="text-[11px] text-neutral-300">What stays with you</p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TAP-TO-SELL: IMMERSIVE QUICK SALE STRIP */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Interactive Register: Tap to Record a Sale!
            </h2>
            <p className="text-xs text-neutral-400">
              Click "+1" or "+10" to record customer orders and watch your piggy bank grow live.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs text-white hover:underline font-medium self-start sm:self-auto"
          >
            Manage Products &rarr;
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-6 text-xs text-neutral-400">
            No products yet! Click "Add What You Sell" above to add whatever items or services you offer.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {products.slice(0, 4).map(p => {
              const calc = calculateProduct(p);

              return (
                <div key={p.id} className="bg-[#101010] border border-neutral-800 p-4 rounded-xl space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs truncate max-w-[130px]">{p.name}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        calc.isLosingMoney ? 'text-rose-400 bg-rose-950' : 'text-white'
                      }`}>
                        {formatCurrency(p.sellingPrice, settings.currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      You keep: <strong className={calc.isLosingMoney ? 'text-rose-400' : 'text-emerald-400'}>
                        {formatCurrency(calc.unitProfit, settings.currency)}
                      </strong> / sale
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                    <span className="font-mono text-neutral-400 text-[11px]">
                      Sold: <strong className="text-white">{p.unitsSold}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => sellMore(p.id, 1)}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs transition-colors"
                        title="Record 1 more sale"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => sellMore(p.id, 10)}
                        className="px-2 py-1 rounded bg-white text-black hover:bg-neutral-200 font-mono font-bold text-xs transition-colors"
                        title="Record 10 more sales"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TWO BIG WINNERS & LEAKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Star Item */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Your #1 Cash Winner</span>
          </div>
          {topProduct ? (
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">{topProduct.product.name}</div>
              <p className="text-xs text-neutral-300">
                Brought in <strong className="text-white font-mono">{formatCurrency(topProduct.moneyLeft, settings.currency)}</strong> of pure profit into your pocket ({formatPercent(topProduct.marginPercent)} margin).
              </p>
              <p className="text-[11px] text-neutral-400 pt-1">
                Tip: Sell more of this item! It pays your rent the fastest.
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">Add products to see your top winner.</p>
          )}
        </div>

        {/* Leaking Item or Biggest Bill */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Money Leak Watchlist</span>
          </div>
          {leakProduct && leakProduct.isLosingMoney ? (
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">{leakProduct.product.name}</div>
              <p className="text-xs text-rose-300 leading-relaxed">
                You lose <strong className="text-rose-400 font-mono">{formatCurrency(Math.abs(leakProduct.unitProfit), settings.currency)}</strong> every time you sell this!
                It costs {formatCurrency(leakProduct.product.unitCost, settings.currency)}, but you sell it for {formatCurrency(leakProduct.product.sellingPrice, settings.currency)}.
              </p>
              <button
                onClick={() => setActiveTab('whatif')}
                className="text-xs text-white underline underline-offset-2 hover:text-neutral-300 pt-1 block"
              >
                Raise its price in the simulator &rarr;
              </button>
            </div>
          ) : summary.highestCostExpense ? (
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">{summary.highestCostExpense.category}</div>
              <p className="text-xs text-neutral-300">
                This is your biggest bill at <strong className="text-white font-mono">{formatCurrency(summary.highestCostExpense.amount, settings.currency)}</strong>. Trimming even 5% saves you {formatCurrency(summary.highestCostExpense.amount * 0.05, settings.currency)} each month.
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">No leaks detected!</p>
          )}
        </div>
      </div>

      {/* EXPLANATION MODAL */}
      {explanationText && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setExplanationText(null)}
        >
          <div 
            className="w-full max-w-xl bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400">
                  {explanationSource === 'ai' ? 'Gemini 3.8 Intelligence' : 'Automatic Calculator'}
                </span>
                <h3 className="text-lg font-bold text-white">Your Business in Plain Words</h3>
              </div>
              <button onClick={() => setExplanationText(null)} className="p-1 rounded text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line space-y-3">
              {explanationText}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setExplanationText(null)}
                className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
