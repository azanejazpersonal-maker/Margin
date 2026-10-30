import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Product } from '../types';
import { ExplainButton } from '../components/ExplainButton';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  X,
  Check
} from 'lucide-react';
import { calculateProduct, formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

export const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, sellMore, settings } = useBusiness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'profit' | 'margin' | 'units' | 'name' | 'price'>('profit');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formSellingPrice, setFormSellingPrice] = useState('10.00');
  const [formUnitCost, setFormUnitCost] = useState('3.00');
  const [formUnitsSold, setFormUnitsSold] = useState('50');
  const [formNotes, setFormNotes] = useState('');

  // Extract unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filter & sort
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const calcA = calculateProduct(a);
    const calcB = calculateProduct(b);
    if (sortBy === 'profit') return calcB.moneyLeft - calcA.moneyLeft;
    if (sortBy === 'margin') return calcB.marginPercent - calcA.marginPercent;
    if (sortBy === 'units') return b.unitsSold - a.unitsSold;
    if (sortBy === 'price') return b.sellingPrice - a.sellingPrice;
    return a.name.localeCompare(b.name);
  });

  const openAddModal = (presetName?: string, presetPrice?: number, presetCost?: number, presetCat?: string) => {
    setFormName(presetName || '');
    setFormCategory(presetCat || 'Products');
    setFormSellingPrice(presetPrice ? presetPrice.toString() : '10.00');
    setFormUnitCost(presetCost ? presetCost.toString() : '3.00');
    setFormUnitsSold('50');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSellingPrice(p.sellingPrice.toString());
    setFormUnitCost(p.unitCost.toString());
    setFormUnitsSold(p.unitsSold.toString());
    setFormNotes(p.notes || '');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sellingPrice = Math.max(0, parseFloat(formSellingPrice) || 0);
    const unitCost = Math.max(0, parseFloat(formUnitCost) || 0);
    const unitsSold = Math.max(0, parseInt(formUnitsSold, 10) || 0);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim() || 'Item',
        category: formCategory.trim() || 'General',
        sellingPrice,
        unitCost,
        unitsSold,
        notes: formNotes,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formName.trim() || 'New Item',
        category: formCategory.trim() || 'General',
        sellingPrice,
        unitCost,
        unitsSold,
        notes: formNotes,
      });
      setIsAddModalOpen(false);
    }
  };

  const losingProducts = products.filter(p => p.unitCost > p.sellingPrice && p.unitsSold > 0);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What You Sell
            </h1>
            <ExplainButton termKey="grossMargin" label="What is Profit?" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Add any items or services you sell. See exactly how much cash stays in your pocket each time!
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Any Item</span>
        </button>
      </div>

      {/* QUICK INSPIRATION PRESETS IF EMPTY OR ADDING */}
      <div className="bg-[#151515] border border-neutral-800 p-4 rounded-xl space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Quick-Add Anything You Sell:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => openAddModal('Cup of Coffee / Drink', 4.50, 1.20, 'Drinks')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Drink ($4.50)
          </button>
          <button
            onClick={() => openAddModal('Meal / Sandwich', 11.00, 4.00, 'Food')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Food ($11.00)
          </button>
          <button
            onClick={() => openAddModal('Handmade Shirt / Craft', 28.00, 9.00, 'Retail')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + Retail Item ($28.00)
          </button>
          <button
            onClick={() => openAddModal('Hour of Service / Job', 50.00, 15.00, 'Services')}
            className="px-2.5 py-1 bg-[#101010] border border-neutral-800 hover:border-white rounded text-neutral-300"
          >
            + 1 Hour Work ($50.00)
          </button>
        </div>
      </div>

      {/* Loss Warning Banner */}
      {losingProducts.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 text-xs text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300">
              Money Leak Alert: You are losing money on {losingProducts.map(p => `"${p.name}"`).join(', ')}!
            </span>
            <p className="leading-relaxed">
              Every single time a customer buys this item, money leaves your pocket. Raise the selling price or find cheaper ingredients to stop the leak!
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151515] border border-neutral-800 rounded-xl p-3">
        <div className="flex flex-1 items-center gap-2 bg-[#101010] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#101010] border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 focus:outline-none font-mono"
          >
            <option value="profit">Sort: Most Cash Kept</option>
            <option value="margin">Sort: Profit %</option>
            <option value="units">Sort: Units Sold</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#151515] border border-neutral-800 rounded-2xl text-neutral-400 text-xs space-y-3">
            <p>No products yet! Tap the button above to add what you sell.</p>
          </div>
        ) : (
          sortedProducts.map(product => {
            const calc = calculateProduct(product);

            return (
              <div 
                key={product.id}
                className={`border rounded-2xl p-5 space-y-4 transition-all ${
                  calc.isLosingMoney 
                    ? 'bg-rose-950/20 border-rose-900/60' 
                    : 'bg-[#151515] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{product.name}</h3>
                    <span className="text-[11px] text-neutral-400">{product.category}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Plain English Verdict Badge */}
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  calc.isLosingMoney 
                    ? 'bg-rose-950/50 border-rose-800 text-rose-300' 
                    : 'bg-[#101010] border-neutral-800/80 text-neutral-200'
                }`}>
                  <div className="font-semibold flex items-center justify-between">
                    <span>{calc.isLosingMoney ? '⚠️ Losing Money!' : '💰 Cash In Pocket:'}</span>
                    <strong className={`font-mono text-sm ${calc.isLosingMoney ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {calc.isLosingMoney ? '-' : '+'}{formatCurrency(Math.abs(calc.unitProfit), settings.currency)} / sale
                    </strong>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Customer pays {formatCurrency(product.sellingPrice, settings.currency)} · Costs you {formatCurrency(product.unitCost, settings.currency)}
                  </p>
                </div>

                {/* Sales & Quick Tap Counters */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-mono">Total Sold:</span>
                    <div className="font-bold font-mono text-white text-sm">
                      {formatNumber(product.unitsSold)} units
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => sellMore(product.id, 1)}
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-mono text-xs"
                      title="Record +1 sale"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => sellMore(product.id, 10)}
                      className="px-2 py-1 bg-white text-black font-bold hover:bg-neutral-200 rounded font-mono text-xs"
                      title="Record +10 sales"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Total Cash Kept */}
                <div className="bg-[#101010] p-2.5 rounded-lg border border-neutral-800/80 flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 text-[11px] font-sans">Total Profit Kept:</span>
                  <span className={`font-bold ${calc.isLosingMoney ? 'text-rose-400' : 'text-white'}`}>
                    {formatCurrency(calc.moneyLeft, settings.currency)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        >
          <div 
            className="w-full max-w-md bg-[#151515] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold">
                {editingProduct ? 'Edit Item' : 'Add What You Sell'}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">What is it called?</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chocolate Cookie, Car Wash, T-Shirt, Coffee..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Food, Retail, Services..."
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Price Customers Pay ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formSellingPrice}
                    onChange={e => setFormSellingPrice(e.target.value)}
                    className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white font-mono focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    What It Costs You ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formUnitCost}
                    onChange={e => setFormUnitCost(e.target.value)}
                    className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white font-mono focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  How many did you sell?
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={formUnitsSold}
                  onChange={e => setFormUnitsSold(e.target.value)}
                  className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-2.5 text-white font-mono focus:outline-none text-sm"
                />
              </div>

              <div className="bg-[#101010] p-3 rounded-lg border border-neutral-800 font-mono text-xs space-y-1">
                <div className="text-neutral-400 text-[11px] font-sans">Money you keep on each sale:</div>
                <div className="text-white font-bold text-sm">
                  {formatCurrency((parseFloat(formSellingPrice) || 0) - (parseFloat(formUnitCost) || 0), settings.currency)}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2 bg-neutral-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
