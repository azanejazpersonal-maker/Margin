import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Expense, ExpenseCategory } from '../types';
import { ExplainButton } from '../components/ExplainButton';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingDown, 
  X,
  Search
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculations';

const CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Electricity',
  'Staff',
  'Supplies',
  'Delivery',
  'Marketing',
  'Other'
];

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, settings, summary } = useBusiness();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'category'>('amount');

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Rent');
  const [formAmount, setFormAmount] = useState('200');
  const [formDescription, setFormDescription] = useState('');

  // Filtered & sorted
  const filteredExpenses = expenses.filter(exp => {
    const matchesCat = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    return a.category.localeCompare(b.category);
  });

  // Category totals
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }
  const sortedCategoryList = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategoryList[0] || null;

  const openAddModal = (presetCat?: ExpenseCategory, presetAmt?: number, presetDesc?: string) => {
    setFormCategory(presetCat || 'Rent');
    setFormAmount(presetAmt ? presetAmt.toString() : '200');
    setFormDescription(presetDesc || '');
    setIsAddModalOpen(true);
  };

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setFormCategory(exp.category);
    setFormAmount(exp.amount.toString());
    setFormDescription(exp.description);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Math.max(0, parseFloat(formAmount) || 0);

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        category: formCategory,
        amount,
        description: formDescription.trim() || `${formCategory} bill`,
      });
      setEditingExpense(null);
    } else {
      addExpense({
        category: formCategory,
        amount,
        description: formDescription.trim() || `${formCategory} bill`,
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Where Your Money Goes (Bills)
            </h1>
            <ExplainButton termKey="operatingExpenses" label="What are Bills?" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Store rent, power bills, helpers, and everything you pay to keep your doors open.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add a Bill</span>
        </button>
      </div>

      {/* QUICK PRESETS */}
      <div className="bg-[#151515] border border-neutral-800 p-4 rounded-xl space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Quick-Add Common Bills:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => openAddModal('Rent', 1200, 'Monthly store / room rent')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Store Rent
          </button>
          <button
            onClick={() => openAddModal('Electricity', 250, 'Power and lights')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Power Bill
          </button>
          <button
            onClick={() => openAddModal('Staff', 800, 'Helper or worker wages')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Helper Wages
          </button>
          <button
            onClick={() => openAddModal('Supplies', 150, 'Boxes, bags, cleaning')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Store Supplies
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#151515] border border-neutral-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
            Total Bills Paid
          </span>
          <div className="text-3xl font-extrabold font-mono text-white">
            {formatCurrency(summary.totalOperatingExpenses, settings.currency)}
          </div>
          <p className="text-xs text-neutral-400">
            Across {expenses.length} bills recorded
          </p>
        </div>

        <div className="bg-[#151515] border border-neutral-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
            Your Biggest Bill
          </span>
          {highestCategory ? (
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">
                {highestCategory[0]} ({formatCurrency(highestCategory[1], settings.currency)})
              </div>
              <p className="text-xs text-neutral-300 font-mono">
                Takes up {formatPercent(summary.totalOperatingExpenses > 0 ? (highestCategory[1] / summary.totalOperatingExpenses) * 100 : 0)} of all your running costs.
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">No bills added yet.</p>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <span className="font-bold text-white text-xs uppercase tracking-wider">Your Recorded Bills</span>
          <span className="text-xs text-neutral-400 font-mono">
            Total: <strong className="text-white">{formatCurrency(summary.totalOperatingExpenses, settings.currency)}</strong>
          </span>
        </div>

        <div className="divide-y divide-neutral-800/80">
          {sortedExpenses.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-500">
              No bills recorded yet! Click "Add a Bill" above.
            </div>
          ) : (
            sortedExpenses.map(exp => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/40 transition-colors text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">{exp.description}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">{exp.category}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-white font-extrabold text-sm">{formatCurrency(exp.amount, settings.currency)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingExpense) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => { setIsAddModalOpen(false); setEditingExpense(null); }}
        >
          <div 
            className="w-full max-w-md bg-[#151515] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold">
                {editingExpense ? 'Edit Bill' : 'Add a Bill'}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingExpense(null); }} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">What bill is this?</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly rent, electric power, helper pay, delivery fee..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  How much did you pay? ({settings.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white font-mono focus:outline-none text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingExpense(null); }}
                  className="px-4 py-2 bg-neutral-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
