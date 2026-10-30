import React, { useState, useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ProductAdjustment, Scenario } from '../types';
import { ExplainButton } from '../components/ExplainButton';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Bookmark, 
  Trash2, 
  Sparkles, 
  X,
  Plus
} from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

export const WhatIfPage: React.FC = () => {
  const { products, expenses, settings, summary, savedScenarios, saveScenario, deleteScenario, setActiveTab } = useBusiness();

  // Working scenario adjustments
  const [adjustments, setAdjustments] = useState<Record<string, ProductAdjustment>>(() => {
    const initial: Record<string, ProductAdjustment> = {};
    for (const p of products) {
      initial[p.id] = {
        adjustedPrice: p.sellingPrice,
        adjustedCost: p.unitCost,
        adjustedUnits: p.unitsSold,
      };
    }
    return initial;
  });

  const [operatingExpenseDelta, setOperatingExpenseDelta] = useState<number>(0);
  
  // Scenario saving / modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('My New Plan');
  const [scenarioDesc, setScenarioDesc] = useState('');
  const [comparisonScenarioId, setComparisonScenarioId] = useState<string | null>(null);

  // Sync adjustments if products change
  const currentAdjustments = useMemo(() => {
    const updated = { ...adjustments };
    for (const p of products) {
      if (!updated[p.id]) {
        updated[p.id] = {
          adjustedPrice: p.sellingPrice,
          adjustedCost: p.unitCost,
          adjustedUnits: p.unitsSold,
        };
      }
    }
    return updated;
  }, [products, adjustments]);

  const handleProductChange = (productId: string, field: keyof ProductAdjustment, value: number) => {
    const safeVal = Math.max(0, isNaN(value) ? 0 : value);
    setAdjustments(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { adjustedPrice: 0, adjustedCost: 0, adjustedUnits: 0 }),
        [field]: safeVal,
      },
    }));
  };

  const handleReset = () => {
    const reset: Record<string, ProductAdjustment> = {};
    for (const p of products) {
      reset[p.id] = {
        adjustedPrice: p.sellingPrice,
        adjustedCost: p.unitCost,
        adjustedUnits: p.unitsSold,
      };
    }
    setAdjustments(reset);
    setOperatingExpenseDelta(0);
    setComparisonScenarioId(null);
  };

  // Quick preset shortcuts
  const applyPriceChangeAll = (percentage: number) => {
    setAdjustments(prev => {
      const copy = { ...prev };
      for (const p of products) {
        const cur = copy[p.id] || { adjustedPrice: p.sellingPrice, adjustedCost: p.unitCost, adjustedUnits: p.unitsSold };
        copy[p.id] = {
          ...cur,
          adjustedPrice: parseFloat((cur.adjustedPrice * (1 + percentage / 100)).toFixed(2)),
        };
      }
      return copy;
    });
  };

  // Calculate Projected Results
  const projectedMetrics = useMemo(() => {
    let projectedRevenue = 0;
    let projectedProductCosts = 0;

    for (const p of products) {
      const adj = currentAdjustments[p.id] || {
        adjustedPrice: p.sellingPrice,
        adjustedCost: p.unitCost,
        adjustedUnits: p.unitsSold,
      };
      projectedRevenue += adj.adjustedPrice * adj.adjustedUnits;
      projectedProductCosts += adj.adjustedCost * adj.adjustedUnits;
    }

    const projectedGrossProfit = projectedRevenue - projectedProductCosts;
    const projectedOperatingExpenses = Math.max(0, summary.totalOperatingExpenses + operatingExpenseDelta);
    const projectedOperatingProfit = projectedGrossProfit - projectedOperatingExpenses;
    const projectedOperatingMargin = projectedRevenue > 0 ? (projectedOperatingProfit / projectedRevenue) * 100 : 0;

    const deltaNetProfit = projectedOperatingProfit - summary.netProfit;

    return {
      projectedRevenue,
      projectedProductCosts,
      projectedGrossProfit,
      projectedOperatingExpenses,
      projectedOperatingProfit,
      projectedOperatingMargin,
      deltaNetProfit,
    };
  }, [products, currentAdjustments, operatingExpenseDelta, summary]);

  const handleLoadScenario = (scen: Scenario) => {
    setAdjustments(scen.productAdjustments);
    setOperatingExpenseDelta(scen.operatingExpenseDelta || 0);
    setComparisonScenarioId(scen.id);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScen: Scenario = {
      id: `scen-${Date.now()}`,
      name: scenarioName.trim() || 'Custom Plan',
      description: scenarioDesc.trim() || `Gains ${formatCurrency(projectedMetrics.deltaNetProfit, settings.currency)} in pocket`,
      productAdjustments: currentAdjustments,
      operatingExpenseDelta,
      createdAt: new Date().toISOString(),
    };
    saveScenario(newScen);
    setSaveModalOpen(false);
    setComparisonScenarioId(newScen.id);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What If I Change Something?
            </h1>
            <ExplainButton termKey="whatIf" label="How this works" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Slide prices and bills to see if you get more money in your pocket. No real risk!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save This Plan</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-[#151515] border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Now</span>
          </button>
        </div>
      </div>

      {/* TODDLER SIMPLE VERDICT STRIP */}
      <div className={`p-6 rounded-2xl border-2 transition-all ${
        projectedMetrics.deltaNetProfit > 0
          ? 'bg-emerald-950/20 border-emerald-500'
          : projectedMetrics.deltaNetProfit < 0
          ? 'bg-rose-950/20 border-rose-500'
          : 'bg-[#151515] border-neutral-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-400">
              The Big Result
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {projectedMetrics.deltaNetProfit > 0 ? (
                <span>🎉 You would keep <strong className="text-emerald-400 font-mono">+{formatCurrency(projectedMetrics.deltaNetProfit, settings.currency)} MORE</strong> every month!</span>
              ) : projectedMetrics.deltaNetProfit < 0 ? (
                <span>⚠️ Be careful! You would lose <strong className="text-rose-400 font-mono">-{formatCurrency(Math.abs(projectedMetrics.deltaNetProfit), settings.currency)}</strong> with these choices.</span>
              ) : (
                <span>Same money: You keep {formatCurrency(summary.netProfit, settings.currency)}. Move the sliders below!</span>
              )}
            </div>
            <p className="text-xs text-neutral-300">
              Current money in pocket: <strong className="text-white font-mono">{formatCurrency(summary.netProfit, settings.currency)}</strong> &rarr; New money in pocket: <strong className="text-white font-mono">{formatCurrency(projectedMetrics.projectedOperatingProfit, settings.currency)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUT BUTTONS */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Try One-Tap Ideas:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPriceChangeAll(5)}
            className="px-3 py-1.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-white text-xs text-neutral-200 transition-colors"
          >
            Raise All Prices +5%
          </button>
          <button
            onClick={() => applyPriceChangeAll(10)}
            className="px-3 py-1.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-white text-xs text-neutral-200 transition-colors"
          >
            Raise All Prices +10%
          </button>
          <button
            onClick={() => setOperatingExpenseDelta(-100)}
            className="px-3 py-1.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-white text-xs text-neutral-200 transition-colors"
          >
            Cut Bills -$100
          </button>
          <button
            onClick={() => setOperatingExpenseDelta(-300)}
            className="px-3 py-1.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-white text-xs text-neutral-200 transition-colors"
          >
            Cut Bills -$300
          </button>
        </div>
      </div>

      {/* ADJUST BILLS SLIDER */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-white text-sm">Store Bills & Rent Adjustment</span>
            <p className="text-neutral-400 text-[11px]">Slide left to simulate paying cheaper rent or electricity.</p>
          </div>
          <div className="font-mono text-sm font-bold text-white">
            {operatingExpenseDelta > 0 ? `+${formatCurrency(operatingExpenseDelta, settings.currency)} bills` : operatingExpenseDelta < 0 ? `-${formatCurrency(Math.abs(operatingExpenseDelta), settings.currency)} bills` : '$0 change'}
          </div>
        </div>

        <input
          type="range"
          min="-1000"
          max="1000"
          step="50"
          value={operatingExpenseDelta}
          onChange={e => setOperatingExpenseDelta(parseFloat(e.target.value) || 0)}
          className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* ADJUST INDIVIDUAL ITEMS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Adjust What You Sell
          </h2>
          <span className="text-xs text-neutral-400">
            Slide price, cost, or how many you sell
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center bg-[#151515] border border-neutral-800 rounded-xl text-xs text-neutral-400 space-y-3">
            <p>You don't have any products yet!</p>
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs"
            >
              Add Your First Product &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => {
              const adj = currentAdjustments[p.id] || {
                adjustedPrice: p.sellingPrice,
                adjustedCost: p.unitCost,
                adjustedUnits: p.unitsSold,
              };

              const currentMoneyLeft = (p.sellingPrice - p.unitCost) * p.unitsSold;
              const newMoneyLeft = (adj.adjustedPrice - adj.adjustedCost) * adj.adjustedUnits;
              const deltaLeft = newMoneyLeft - currentMoneyLeft;

              return (
                <div key={p.id} className="bg-[#151515] border border-neutral-800 rounded-xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        Now: sells for {formatCurrency(p.sellingPrice, settings.currency)} · costs {formatCurrency(p.unitCost, settings.currency)} · sold {p.unitsSold}
                      </div>
                    </div>

                    <div className="font-mono text-xs text-right">
                      <span className="text-neutral-400 text-[10px] block">Money you keep from this:</span>
                      <span className="text-white font-bold text-sm">
                        {formatCurrency(newMoneyLeft, settings.currency)}
                      </span>
                      {deltaLeft !== 0 && (
                        <span className={`text-[10px] ml-2 ${deltaLeft > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({deltaLeft > 0 ? '+' : ''}{formatCurrency(deltaLeft, settings.currency)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                    {/* Selling price */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">Price customers pay:</span>
                        <strong className="text-white font-mono">{formatCurrency(adj.adjustedPrice, settings.currency)}</strong>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max={Math.max(30, p.sellingPrice * 3)}
                        step="0.25"
                        value={adj.adjustedPrice}
                        onChange={e => handleProductChange(p.id, 'adjustedPrice', parseFloat(e.target.value))}
                        className="w-full accent-white h-1.5 bg-neutral-800 rounded cursor-pointer"
                      />
                    </div>

                    {/* Cost to make */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">What it costs you:</span>
                        <strong className="text-white font-mono">{formatCurrency(adj.adjustedCost, settings.currency)}</strong>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max={Math.max(25, p.unitCost * 3)}
                        step="0.10"
                        value={adj.adjustedCost}
                        onChange={e => handleProductChange(p.id, 'adjustedCost', parseFloat(e.target.value))}
                        className="w-full accent-white h-1.5 bg-neutral-800 rounded cursor-pointer"
                      />
                    </div>

                    {/* Number sold */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">How many you sell:</span>
                        <strong className="text-white font-mono">{formatNumber(adj.adjustedUnits)}</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={Math.max(500, p.unitsSold * 3)}
                        step="10"
                        value={adj.adjustedUnits}
                        onChange={e => handleProductChange(p.id, 'adjustedUnits', parseInt(e.target.value, 10))}
                        className="w-full accent-white h-1.5 bg-neutral-800 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SAVED PLANS */}
      {savedScenarios.length > 0 && (
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white">Your Saved Plans</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedScenarios.map(scen => (
              <div key={scen.id} className="bg-[#101010] p-3.5 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{scen.name}</div>
                  <div className="text-[11px] text-neutral-400">{scen.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadScenario(scen)}
                    className="px-2.5 py-1 bg-white text-black font-semibold rounded text-[11px]"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteScenario(scen.id)}
                    className="p-1 text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {saveModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSaveModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#151515] border border-neutral-800 rounded-xl p-6 text-white space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold">Save This Plan</h3>
            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={scenarioName}
                  onChange={e => setScenarioName(e.target.value)}
                  placeholder="e.g. Raise Coffee by $1"
                  className="w-full bg-[#101010] border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-900 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-white text-black font-bold rounded"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
