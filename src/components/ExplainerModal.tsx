import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { GLOSSARY } from '../utils/glossary';
import { X, HelpCircle, Lightbulb } from 'lucide-react';

export const ExplainerModal: React.FC = () => {
  const { explainerKey, closeExplainer } = useBusiness();

  if (!explainerKey) return null;

  const item = GLOSSARY[explainerKey] || {
    id: explainerKey,
    simpleTitle: 'Business Term',
    formalTerm: explainerKey,
    explanation: 'This metric helps you track money flow in your company.',
    example: 'Keep more than you spend to ensure your business remains healthy.',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity"
      onClick={closeExplainer}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg bg-[#151515] border border-neutral-800 rounded-xl p-6 shadow-2xl text-white space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />
              <span>Simple Financial Guide</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {item.simpleTitle}
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Formal accounting term: <span className="text-neutral-200">{item.formalTerm}</span>
            </p>
          </div>
          <button 
            onClick={closeExplainer}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-neutral-300">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              What it means in simple English
            </h4>
            <p className="leading-relaxed text-neutral-200">
              {item.explanation}
            </p>
          </div>

          <div className="bg-[#101010] border border-neutral-800 rounded-lg p-3.5 space-y-1.5">
            <div className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
              <span>Simple Example</span>
            </div>
            <p className="text-xs text-neutral-300 font-mono leading-relaxed">
              {item.example}
            </p>
          </div>

          {item.tips && (
            <div className="flex items-start gap-2.5 text-xs text-neutral-300 bg-neutral-900/60 border border-neutral-800/80 rounded-lg p-3">
              <Lightbulb className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
              <p>{item.tips}</p>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={closeExplainer}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
