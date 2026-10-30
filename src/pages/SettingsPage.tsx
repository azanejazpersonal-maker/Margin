import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  ShieldCheck, 
  Save, 
  Store, 
  Database,
  CheckCircle,
  Key,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';

const CURRENCIES = [
  { symbol: '$', code: 'USD', label: 'US Dollar ($)' },
  { symbol: '€', code: 'EUR', label: 'Euro (€)' },
  { symbol: '£', code: 'GBP', label: 'British Pound (£)' },
  { symbol: '¥', code: 'JPY', label: 'Japanese Yen (¥)' },
  { symbol: 'C$', code: 'CAD', label: 'Canadian Dollar (C$)' },
  { symbol: 'A$', code: 'AUD', label: 'Australian Dollar (A$)' },
  { symbol: '₹', code: 'INR', label: 'Indian Rupee (₹)' },
  { symbol: 'Rs', code: 'PKR', label: 'Pakistani Rupee (Rs)' },
  { symbol: 'R', code: 'ZAR', label: 'South African Rand (R)' },
  { symbol: 'kr', code: 'SEK', label: 'Swedish Krona (kr)' },
];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, clearAllData, loadStarterIdeas, products, expenses } = useBusiness();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessType, setBusinessType] = useState(settings.businessType);
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency);
  const [periodLabel, setPeriodLabel] = useState(settings.periodLabel);
  const [customApiKey, setCustomApiKey] = useState(settings.geminiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const currObj = CURRENCIES.find(c => c.symbol === selectedCurrency) || CURRENCIES[0];

    updateSettings({
      businessName: businessName.trim() || 'My Business',
      businessType: businessType.trim() || 'General Business',
      currency: currObj.symbol,
      currencyCode: currObj.code,
      periodLabel: periodLabel.trim() || 'This Month',
      geminiApiKey: customApiKey.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Business Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Customize your business name, currency symbol, and AI configuration.
        </p>
      </div>

      {/* AI Key Configuration Card */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="w-5 h-5 text-white" />
              <span>Gemini AI Engine (Free & Fast)</span>
            </h2>
            <p className="text-xs text-neutral-400">
              MARGIN runs on Google's high-speed <span className="text-white font-medium">Gemini 3.1 Flash Lite</span> engine.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Active & Ultra-Fast (~800ms)</span>
          </span>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Add Your Personal Gemini API Key (Optional)
          </label>
          <input
            type="password"
            value={customApiKey}
            onChange={e => setCustomApiKey(e.target.value)}
            placeholder="AIzaSy... (leave blank to use the built-in free key)"
            className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-neutral-500 font-mono"
          />
          <p className="text-[11px] text-neutral-500">
            A free, fast API key is already configured on the server. If you want to use your own personal key from Google AI Studio, simply paste it above and hit save. It is stored securely in your browser.
          </p>
        </div>
      </div>

      {/* Business Profile Settings */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-white" />
            <span>Your Business Profile</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Name your store or company and pick your currency symbol.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">What is your business called?</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Sunny Bakery, Quick Cleaners, My Store..."
                className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Type of Business</label>
              <input
                type="text"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                placeholder="e.g. Cafe, Retail Shop, Hair Salon, Lawn Care..."
                className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Currency Symbol</label>
              <select
                value={selectedCurrency}
                onChange={e => setSelectedCurrency(e.target.value)}
                className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-neutral-600 font-mono"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.symbol}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Time Period Name</label>
              <input
                type="text"
                value={periodLabel}
                onChange={e => setPeriodLabel(e.target.value)}
                placeholder="e.g. This Month, October 2026..."
                className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
            {savedSuccess ? (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Clear All / Start Fresh */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-white" />
          <span>Data Control</span>
        </h2>
        <p className="text-xs text-neutral-400">
          You currently have <strong>{products.length} products</strong> and <strong>{expenses.length} bills</strong> saved in your browser.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete all products and bills to start with a blank screen?')) {
                clearAllData();
              }
            }}
            className="px-4 py-2.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-rose-500 text-rose-300 text-xs flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data & Start Fresh</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Load starter items to play with?')) {
                loadStarterIdeas();
              }
            }}
            className="px-4 py-2.5 rounded-lg bg-[#101010] border border-neutral-800 hover:border-white text-white text-xs flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Starter Examples</span>
          </button>
        </div>
      </div>

      {/* Privacy note */}
      <div className="bg-[#101010] border border-neutral-800 rounded-2xl p-6 text-xs text-neutral-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Privacy Notice</span>
        </div>
        <p className="leading-relaxed">
          Everything you type is saved directly in your web browser. No accounts or logins are needed.
        </p>
      </div>
    </div>
  );
};
