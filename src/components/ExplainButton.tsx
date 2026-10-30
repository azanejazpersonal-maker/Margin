import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { HelpCircle } from 'lucide-react';

interface ExplainButtonProps {
  termKey: string;
  label?: string;
  size?: 'sm' | 'xs';
}

export const ExplainButton: React.FC<ExplainButtonProps> = ({ 
  termKey, 
  label = 'What does this mean?',
  size = 'xs'
}) => {
  const { openExplainer } = useBusiness();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openExplainer(termKey);
      }}
      className={`inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors group cursor-pointer ${
        size === 'xs' ? 'text-[11px]' : 'text-xs'
      }`}
      title="Click for a simple explanation"
    >
      <HelpCircle className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
      <span className="underline decoration-neutral-700 underline-offset-2 group-hover:decoration-neutral-400">
        {label}
      </span>
    </button>
  );
};
