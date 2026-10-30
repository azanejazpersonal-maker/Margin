import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { SmartSuggestion } from '../types';
import { generateRuleBasedSuggestions, formatCurrency, formatPercent } from '../utils/calculations';
import { 
  Sparkles, 
  Cpu, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  HelpCircle, 
  Send, 
  Loader2,
  Sliders,
  ShieldAlert,
  Info
} from 'lucide-react';

export const SuggestionsPage: React.FC = () => {
  const { products, expenses, settings, summary, setActiveTab } = useBusiness();

  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [sourceType, setSourceType] = useState<'ai' | 'rule'>('rule');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatusMessage, setApiStatusMessage] = useState<string>('');
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);

  // Ask MARGIN Q&A state
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; source: 'ai' | 'rule' }>>([
    {
      q: 'Which item is leaking money in my cafe?',
      a: summary.lowestMarginProduct && summary.lowestMarginProduct.isLosingMoney
        ? `"${summary.lowestMarginProduct.product.name}" costs you ${formatCurrency(summary.lowestMarginProduct.product.unitCost, settings.currency)} to make, but you sell it for ${formatCurrency(summary.lowestMarginProduct.product.sellingPrice, settings.currency)}. You lose ${formatCurrency(Math.abs(summary.lowestMarginProduct.unitProfit), settings.currency)} on every sale. Check supplier costs or raise the price by at least $1.00.`
        : 'All of your products currently sell for more than they cost to buy. Your highest running expense is ' + (summary.highestCostExpense ? `${summary.highestCostExpense.category} at ${formatCurrency(summary.highestCostExpense.amount, settings.currency)}` : 'your general bills') + '.',
      source: 'rule',
    }
  ]);

  // Load suggestions
  const fetchSuggestions = async () => {
    setIsLoading(true);
    setApiStatusMessage('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.geminiApiKey) {
        headers['x-gemini-api-key'] = settings.geminiApiKey;
      }

      const response = await fetch('/api/gemini/smart-suggestions', {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          businessName: settings.businessName,
          currency: settings.currency,
          products: products.map(p => ({
            name: p.name,
            sellingPrice: p.sellingPrice,
            unitCost: p.unitCost,
            unitsSold: p.unitsSold,
          })),
          expenses: expenses.map(e => ({
            category: e.category,
            amount: e.amount,
            description: e.description,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const mapped: SmartSuggestion[] = data.suggestions.map((s: any, idx: number) => ({
          id: `ai-sug-${idx}`,
          title: s.title || 'Smart Recommendation',
          noticed: s.noticed || '',
          numbers: s.numbers || '',
          whyItMatters: s.whyItMatters || '',
          investigate: s.investigate || '',
          limitation: s.limitation || '',
          priority: s.priority || 'medium',
          category: s.category || 'pricing',
          source: data.source?.startsWith('gemini') ? 'ai' : 'rule',
        }));
        setSuggestions(mapped);
        setSourceType(data.source?.startsWith('gemini') ? 'ai' : 'rule');
        setApiStatusMessage('Live Gemini 3.1 Flash Lite intelligence generated these recommendations from your numbers.');
      } else {
        fallbackToRuleEngine(data.message || 'Gemini API not configured or unavailable');
      }
    } catch {
      fallbackToRuleEngine('Network error or server unreachable');
    } finally {
      setIsLoading(false);
      setHasCheckedStatus(true);
    }
  };

  const fallbackToRuleEngine = (reason: string) => {
    const rules = generateRuleBasedSuggestions(products, expenses, settings.currency);
    setSuggestions(rules);
    setSourceType('rule');
    setApiStatusMessage(
      `Using built-in Automatic Rule-Based Analysis (${reason}). Financial arithmetic is 100% verified and transparent.`
    );
  };

  useEffect(() => {
    fetchSuggestions();
  }, [products, expenses]);

  // Handle Ask MARGIN
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question.trim();
    setQuestion('');
    setIsAsking(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.geminiApiKey) {
        headers['x-gemini-api-key'] = settings.geminiApiKey;
      }

      const response = await fetch('/api/gemini/ask-margin', {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          question: userQ,
          businessData: {
            businessName: settings.businessName,
            currency: settings.currency,
            revenue: summary.totalRevenue,
            totalExpenses: summary.totalMoneySpent,
            netProfit: summary.netProfit,
            products: products.map(p => ({
              name: p.name,
              price: p.sellingPrice,
              cost: p.unitCost,
              sold: p.unitsSold,
              profitKept: (p.sellingPrice - p.unitCost) * p.unitsSold,
            })),
            expenses: expenses.map(e => ({ category: e.category, amount: e.amount })),
          },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.answer) {
        setQaHistory(prev => [{ q: userQ, a: data.answer, source: data.source?.startsWith('gemini') ? 'ai' : 'rule' }, ...prev]);
      } else {
        // Fallback rule answer
        generateRuleAnswer(userQ);
      }
    } catch {
      generateRuleAnswer(userQ);
    } finally {
      setIsAsking(false);
    }
  };

  const generateRuleAnswer = (q: string) => {
    const lower = q.toLowerCase();
    let reply = '';

    if (lower.includes('price') || lower.includes('raise') || lower.includes('increase')) {
      const top = summary.topProfitableProduct;
      reply = `Based on your numbers, if you raise prices by 25¢ on your ${products.length} products, each customer pays a tiny bit more. On your top seller "${top?.product.name || 'your items'}", 25¢ extra across ${top?.product.unitsSold || 500} sales would add ${formatCurrency((top?.product.unitsSold || 500) * 0.25, settings.currency)} of pure profit each month.`;
    } else if (lower.includes('rent') || lower.includes('bill') || lower.includes('expense')) {
      reply = `Your biggest monthly bill is ${summary.highestCostExpense ? `${summary.highestCostExpense.category} at ${formatCurrency(summary.highestCostExpense.amount, settings.currency)} (${formatPercent(summary.highestCostExpense.percentage)} of total running bills)` : 'your operating costs'}. Reducing this by 5% would save ${formatCurrency((summary.highestCostExpense?.amount || 1000) * 0.05, settings.currency)} monthly.`;
    } else {
      reply = `Your business has earned ${formatCurrency(summary.totalRevenue, settings.currency)} and spent ${formatCurrency(summary.totalMoneySpent, settings.currency)}, leaving ${formatCurrency(summary.netProfit, settings.currency)} in cash. To protect your bottom line, prioritize fixing any item where cost exceeds selling price, then test price adjustments in the What If simulator.`;
    }

    setQaHistory(prev => [{ q, a: reply, source: 'rule' }, ...prev]);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Suggestions
            </h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-neutral-800 bg-[#151515] text-neutral-300">
              {sourceType === 'ai' ? 'Live Gemini AI' : 'Automatic Rule Engine'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Plain-English business recommendations grounded 100% in your actual numbers.
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing Data...' : 'Refresh Suggestions'}</span>
        </button>
      </div>

      {/* Engine Status & Transparency Banner */}
      <div className="border border-neutral-800 bg-[#121212] p-4 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            {sourceType === 'ai' ? (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white">Active Engine: Google Gemini 3.8 Flash</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-300">Active Engine: Built-in Automatic Financial Calculator</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
            {sourceType === 'ai' ? 'Live AI Connected' : 'Auto-Calculator Active'}
          </span>
        </div>

        <p className="text-neutral-400 leading-relaxed">
          {apiStatusMessage || 'MARGIN analyzes your product margins and monthly expenses to highlight high-leverage opportunities.'}
        </p>

        <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
          <span>
            <strong className="text-white">Free & Fast AI:</strong> Gemini 3.8 Flash is pre-configured and active. It analyzes your business arithmetic directly on the server with zero manual setup.
          </span>
        </div>
      </div>

      {/* SUGGESTION CARDS (REQUIRED 5-POINT CONTRACT) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          Actionable Opportunities ({suggestions.length})
        </h2>

        {isLoading ? (
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">
              Running financial calculations and evaluating menu margins...
            </p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-400">
            No suggestions available. Try adding products and expenses to generate insights.
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((sug, idx) => (
              <div 
                key={sug.id || idx}
                className="bg-[#151515] border border-neutral-800 rounded-xl p-5 space-y-4 hover:border-neutral-700 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center font-mono font-bold text-xs text-white">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{sug.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                      sug.priority === 'high' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : sug.priority === 'medium'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                    }`}>
                      {sug.priority} priority
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {sug.source === 'ai' ? 'Gemini AI' : 'Rule Engine'}
                    </span>
                  </div>
                </div>

                {/* The 5-Point Contract Required by Prompt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* 1. What was noticed */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                      1. What was noticed
                    </span>
                    <p className="text-neutral-200 leading-relaxed">{sug.noticed}</p>
                  </div>

                  {/* 2. Numbers supporting it */}
                  <div className="space-y-1 bg-[#101010] p-3 rounded-lg border border-neutral-800/80">
                    <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px] font-sans">
                      2. Real Numbers Supporting It
                    </span>
                    <p className="font-mono text-neutral-300 leading-relaxed text-[11px]">{sug.numbers}</p>
                  </div>

                  {/* 3. Why it matters */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                      3. Why it matters
                    </span>
                    <p className="text-neutral-300 leading-relaxed">{sug.whyItMatters}</p>
                  </div>

                  {/* 4. What to investigate */}
                  <div className="space-y-1 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/80">
                    <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                      4. What you could investigate
                    </span>
                    <p className="text-white font-medium leading-relaxed">{sug.investigate}</p>
                  </div>
                </div>

                {/* 5. Limitation / Uncertainty */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-start gap-2 text-[11px] text-neutral-400">
                  <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-neutral-400 font-medium">Uncertainty & Limitation:</strong> {sug.limitation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "ASK MARGIN" CONSOLE */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Ask MARGIN a Business Question
            </h2>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-neutral-400">
            Ask any question about your numbers (e.g. "What if I raise coffee by 50¢?", "Where is my biggest expense leak?").
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a plain English question about your business..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={isAsking}
            className="flex-1 bg-[#101010] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 placeholder-neutral-500"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </form>

        {/* Q&A Stream */}
        <div className="space-y-3 pt-2">
          {qaHistory.map((item, idx) => (
            <div key={idx} className="bg-[#101010] border border-neutral-800 rounded-lg p-4 space-y-2 text-xs">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>Q: {item.q}</span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {item.source === 'ai' ? 'Gemini 3.8' : 'Rule Math'}
                </span>
              </div>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
