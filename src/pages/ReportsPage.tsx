import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ExplainButton } from '../components/ExplainButton';
import { 
  Download, 
  Upload, 
  Printer, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  RotateCcw,
  Eye,
  X
} from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber, calculateProduct } from '../utils/calculations';

export const ReportsPage: React.FC = () => {
  const { 
    products, 
    expenses, 
    settings, 
    summary, 
    savedScenarios, 
    exportToCsv, 
    addProduct 
  } = useBusiness();

  // CSV Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importType, setImportType] = useState<'products' | 'expenses'>('products');
  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // Print report trigger
  const handlePrint = () => {
    window.print();
  };

  // CSV Parsing & Validation
  const handleParseCsv = () => {
    setImportError(null);
    setImportPreview(null);
    setImportSuccessMessage(null);

    if (!csvText.trim()) {
      setImportError('Please paste CSV text or select a file to parse.');
      return;
    }

    const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setImportError('CSV must contain a header row and at least one data row.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

    if (importType === 'products') {
      // Expected headers: name, category, price/selling price, cost/unit cost, units/units sold
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('product'));
      const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('selling'));
      const costIdx = headers.findIndex(h => h.includes('cost'));
      const unitsIdx = headers.findIndex(h => h.includes('unit') || h.includes('sold') || h.includes('qty'));

      if (nameIdx === -1 || priceIdx === -1 || costIdx === -1) {
        setImportError(
          'Could not find required columns in your CSV. Please ensure you have "Product Name", "Selling Price", and "Unit Cost" headers.'
        );
        return;
      }

      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^["']|["']$/g, '').trim());
        const name = parts[nameIdx] || `Imported Item ${i}`;
        const price = parseFloat(parts[priceIdx]) || 0;
        const cost = parseFloat(parts[costIdx]) || 0;
        const units = unitsIdx !== -1 ? parseInt(parts[unitsIdx], 10) || 0 : 50;

        parsed.push({
          name,
          category: 'Imported',
          sellingPrice: price,
          unitCost: cost,
          unitsSold: units,
        });
      }

      setImportPreview(parsed);
    }
  };

  const handleApplyImport = () => {
    if (!importPreview || importPreview.length === 0) return;

    if (importType === 'products') {
      for (const item of importPreview) {
        addProduct(item);
      }
      setImportSuccessMessage(`Successfully added ${importPreview.length} products to your business!`);
      setImportPreview(null);
      setCsvText('');
      setTimeout(() => {
        setImportModalOpen(false);
        setImportSuccessMessage(null);
      }, 1500);
    }
  };

  const productMetrics = products.map(calculateProduct);
  const sortedByProfit = [...productMetrics].sort((a, b) => b.moneyLeft - a.moneyLeft);
  const sortedByMargin = [...productMetrics].sort((a, b) => a.marginPercent - b.marginPercent);

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Business Reports & Data
            </h1>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
              {settings.periodLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Complete executive summaries, data exports, and audit reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CSV Export Dropdown / Buttons */}
          <div className="flex items-center bg-[#151515] border border-neutral-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => exportToCsv('summary')}
              className="px-2.5 py-1 text-neutral-300 hover:text-white rounded hover:bg-neutral-800 flex items-center gap-1.5"
              title="Download executive summary CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Summary CSV</span>
            </button>
            <button
              onClick={() => exportToCsv('products')}
              className="px-2.5 py-1 text-neutral-300 hover:text-white rounded hover:bg-neutral-800 flex items-center gap-1.5"
              title="Download products CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Products CSV</span>
            </button>
          </div>

          {/* CSV Import */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-[#151515] border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print-only space-y-2 border-b border-black pb-4 text-black">
        <h1 className="text-2xl font-bold">MARGIN Business Financial Report</h1>
        <div className="text-xs text-neutral-600 font-mono">
          Business: {settings.businessName} ({settings.businessType}) · Date: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* EXECUTIVE FINANCIAL SUMMARY CARD */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6 print-card">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Executive Brief
            </span>
            <h2 className="text-xl font-bold text-white print-text-dark">
              Financial Performance Summary
            </h2>
          </div>
          <ExplainButton termKey="netProfit" label="Explain Bottom Line" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 print-card">
            <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider">Money Earned</span>
            <div className="text-xl font-bold text-white mt-1 print-text-dark">
              {formatCurrency(summary.totalRevenue, settings.currency)}
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Total customer sales</p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 print-card">
            <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider">Product Costs</span>
            <div className="text-xl font-bold text-neutral-300 mt-1 print-text-dark">
              {formatCurrency(summary.totalProductCosts, settings.currency)}
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Direct goods buy-in</p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 print-card">
            <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider">Running Bills</span>
            <div className="text-xl font-bold text-neutral-300 mt-1 print-text-dark">
              {formatCurrency(summary.totalOperatingExpenses, settings.currency)}
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Rent, staff, utilities</p>
          </div>

          <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 print-card">
            <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider">Money Kept</span>
            <div className={`text-xl font-bold mt-1 ${summary.netProfit >= 0 ? 'text-emerald-400 print-text-dark' : 'text-rose-400 print-text-dark'}`}>
              {formatCurrency(summary.netProfit, settings.currency)}
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Margin: {formatPercent(summary.netMarginPercent)}</p>
          </div>
        </div>

        {/* Narrative Plain English Report Paragraph */}
        <div className="bg-[#101010] border border-neutral-800 p-4 rounded-xl text-xs text-neutral-300 leading-relaxed space-y-2 print-card print-text-dark">
          <p className="font-semibold text-white print-text-dark">
            In Plain English:
          </p>
          <p>
            During {settings.periodLabel}, <strong>{settings.businessName}</strong> took in <strong>{formatCurrency(summary.totalRevenue, settings.currency)}</strong> across {formatNumber(summary.totalUnitsSold)} sales. The business paid <strong>{formatCurrency(summary.totalProductCosts, settings.currency)}</strong> to prepare those products, and <strong>{formatCurrency(summary.totalOperatingExpenses, settings.currency)}</strong> to pay rent, power, and workers.
          </p>
          <p>
            This left a net bottom-line cash amount of <strong>{formatCurrency(summary.netProfit, settings.currency)}</strong> ({formatPercent(summary.netMarginPercent)} of sales).
          </p>
        </div>
      </div>

      {/* TOP PERFORMERS VS LOWEST MARGINS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Products */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-4 print-card">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Top Profit Generating Items</span>
          </div>

          <div className="space-y-3 pt-1">
            {sortedByProfit.slice(0, 4).map(item => (
              <div key={item.product.id} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-800/80">
                <div>
                  <div className="font-semibold text-white print-text-dark">{item.product.name}</div>
                  <div className="text-[10px] text-neutral-400">{item.product.unitsSold} units sold</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-white font-bold print-text-dark">{formatCurrency(item.moneyLeft, settings.currency)}</div>
                  <div className="text-[10px] text-neutral-400">{formatPercent(item.marginPercent)} margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lowest Margin / Watchlist Products */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-4 print-card">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-amber-400">
            <TrendingDown className="w-4 h-4" />
            <span>Lowest Margin / Watchlist Items</span>
          </div>

          <div className="space-y-3 pt-1">
            {sortedByMargin.slice(0, 4).map(item => (
              <div key={item.product.id} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-800/80">
                <div>
                  <div className="font-semibold text-white print-text-dark">{item.product.name}</div>
                  <div className="text-[10px] text-neutral-400">Costs {formatCurrency(item.product.unitCost, settings.currency)} · Sells {formatCurrency(item.product.sellingPrice, settings.currency)}</div>
                </div>
                <div className="text-right font-mono">
                  <div className={`font-bold ${item.isLosingMoney ? 'text-rose-400 print-text-dark' : 'text-neutral-300 print-text-dark'}`}>
                    {formatPercent(item.marginPercent)}
                  </div>
                  <div className="text-[10px] text-neutral-400">{formatCurrency(item.unitProfit, settings.currency)} kept / unit</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAVED SCENARIOS SUMMARY */}
      {savedScenarios.length > 0 && (
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 space-y-4 print-card">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-neutral-300">
            <Sliders className="w-4 h-4 text-white" />
            <span>Modeled Scenarios On Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {savedScenarios.map(scen => (
              <div key={scen.id} className="bg-[#101010] p-4 rounded-lg border border-neutral-800 text-xs space-y-1 print-card">
                <div className="font-semibold text-white print-text-dark">{scen.name}</div>
                <p className="text-[11px] text-neutral-400">{scen.description}</p>
                <div className="text-[10px] font-mono text-neutral-500 pt-1">
                  Saved {new Date(scen.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setImportModalOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-[#151515] border border-neutral-800 rounded-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Import Products via CSV</span>
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Paste CSV data with columns for <code>Product Name, Selling Price, Unit Cost, Units Sold</code>.
            </p>

            {/* CSV Template Shortcut */}
            <div className="bg-[#101010] p-3 rounded border border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 text-[11px]">Example CSV format:</span>
              <button
                onClick={() => setCsvText('Product Name,Selling Price,Unit Cost,Units Sold\nVanilla Latte,5.50,1.40,200\nButter Croissant,4.25,1.80,140\nCold Brew,4.75,0.90,180')}
                className="text-white hover:underline text-[11px]"
              >
                Insert Example
              </button>
            </div>

            <textarea
              rows={6}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="Product Name,Selling Price,Unit Cost,Units Sold&#10;Matcha Latte,5.75,1.60,120&#10;Banana Bread,4.00,1.20,95"
              className="w-full bg-[#101010] border border-neutral-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-neutral-600"
            />

            {importError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            {importPreview && (
              <div className="space-y-2 border border-neutral-800 rounded-lg p-3 bg-[#101010]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Preview Validated Rows ({importPreview.length}):</span>
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-neutral-800 font-mono text-[11px]">
                  {importPreview.map((item, idx) => (
                    <div key={idx} className="py-1 flex justify-between text-neutral-300">
                      <span>{item.name}</span>
                      <span>Price: {formatCurrency(item.sellingPrice, settings.currency)} · Cost: {formatCurrency(item.unitCost, settings.currency)} · Qty: {item.unitsSold}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 bg-neutral-900 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              {!importPreview ? (
                <button
                  type="button"
                  onClick={handleParseCsv}
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
                >
                  Verify & Preview
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyImport}
                  className="px-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400"
                >
                  Import All {importPreview.length} Products
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
