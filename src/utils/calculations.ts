import { Product, Expense, BusinessSummary, ProductCalculations, SmartSuggestion } from '../types';

/**
 * Format currency with user's selected symbol and sensible formatting.
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0.00`;
  const isNegative = amount < 0;
  const absFormatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-${symbol}${absFormatted}` : `${symbol}${absFormatted}`;
}

/**
 * Format integer numbers (e.g. units sold)
 */
export function formatNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  return Math.round(num).toLocaleString('en-US');
}

/**
 * Format percentage with 1 decimal place safely
 */
export function formatPercent(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '0.0%';
  return `${val.toFixed(1)}%`;
}

/**
 * Calculate financial metrics for a single product.
 * Handles zero prices, zero costs, and losing money safely.
 */
export function calculateProduct(p: Product): ProductCalculations {
  const sellingPrice = Math.max(0, Number(p.sellingPrice) || 0);
  const unitCost = Math.max(0, Number(p.unitCost) || 0);
  const unitsSold = Math.max(0, Number(p.unitsSold) || 0);

  // Money earned = Selling Price × Units Sold
  const moneyEarned = sellingPrice * unitsSold;

  // Product costs = Unit Cost × Units Sold
  const totalProductCost = unitCost * unitsSold;

  // Money left after product costs = (Selling Price − Unit Cost) × Units Sold
  const unitProfit = sellingPrice - unitCost;
  const moneyLeft = unitProfit * unitsSold;

  // Product margin percentage = (Selling Price − Unit Cost) / Selling Price × 100
  let marginPercent = 0;
  if (sellingPrice > 0) {
    marginPercent = (unitProfit / sellingPrice) * 100;
  }

  const isLosingMoney = unitCost > sellingPrice;

  return {
    product: p,
    moneyEarned,
    totalProductCost,
    moneyLeft,
    marginPercent,
    unitProfit,
    isLosingMoney,
  };
}

/**
 * Compute the complete business summary from products and expenses.
 */
export function calculateBusinessSummary(products: Product[], expenses: Expense[]): BusinessSummary {
  const productMetrics = products.map(calculateProduct);

  const totalRevenue = productMetrics.reduce((sum, item) => sum + item.moneyEarned, 0);
  const totalProductCosts = productMetrics.reduce((sum, item) => sum + item.totalProductCost, 0);
  const grossProfit = totalRevenue - totalProductCosts;
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalOperatingExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalMoneySpent = totalProductCosts + totalOperatingExpenses;
  const netProfit = grossProfit - totalOperatingExpenses;
  const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const totalUnitsSold = products.reduce((sum, p) => sum + (Number(p.unitsSold) || 0), 0);

  // Identify top profitable product (by money left)
  let topProfitableProduct: ProductCalculations | null = null;
  if (productMetrics.length > 0) {
    topProfitableProduct = [...productMetrics].sort((a, b) => b.moneyLeft - a.moneyLeft)[0];
  }

  // Identify lowest margin product (excluding products with 0 sold if others exist)
  let lowestMarginProduct: ProductCalculations | null = null;
  if (productMetrics.length > 0) {
    const activeProducts = productMetrics.filter(p => p.product.unitsSold > 0);
    const candidateList = activeProducts.length > 0 ? activeProducts : productMetrics;
    lowestMarginProduct = [...candidateList].sort((a, b) => a.marginPercent - b.marginPercent)[0];
  }

  // Group expenses by category to find highest spending category
  const expensesByCategory: Record<string, number> = {};
  for (const exp of expenses) {
    expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + (Number(exp.amount) || 0);
  }

  let highestCostExpense: { category: string; amount: number; percentage: number } | null = null;
  const expenseEntries = Object.entries(expensesByCategory);
  if (expenseEntries.length > 0) {
    expenseEntries.sort((a, b) => b[1] - a[1]);
    const [topCat, topAmount] = expenseEntries[0];
    const percentage = totalOperatingExpenses > 0 ? (topAmount / totalOperatingExpenses) * 100 : 0;
    highestCostExpense = {
      category: topCat,
      amount: topAmount,
      percentage,
    };
  }

  return {
    totalRevenue,
    totalProductCosts,
    grossProfit,
    grossMarginPercent,
    totalOperatingExpenses,
    totalMoneySpent,
    netProfit,
    netMarginPercent,
    topProfitableProduct,
    lowestMarginProduct,
    highestCostExpense,
    totalUnitsSold,
  };
}

/**
 * Transparent, deterministic rule-based analysis engine.
 * Generates verified, actionable suggestions in plain English when AI is unavailable.
 */
export function generateRuleBasedSuggestions(
  products: Product[],
  expenses: Expense[],
  currency: string = '$'
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const summary = calculateBusinessSummary(products, expenses);
  const productMetrics = products.map(calculateProduct);

  // Rule 1: Check for products where cost exceeds selling price (losing money on every sale)
  const losingProducts = productMetrics.filter(p => p.isLosingMoney && p.product.unitsSold > 0);
  if (losingProducts.length > 0) {
    const worst = losingProducts[0];
    suggestions.push({
      id: 'rule-losing-product',
      title: `Fix Product Selling at a Loss: ${worst.product.name}`,
      noticed: `You are spending more to make "${worst.product.name}" than you charge customers for it.`,
      numbers: `Selling price is ${formatCurrency(worst.product.sellingPrice, currency)}, but each one costs ${formatCurrency(worst.product.unitCost, currency)}. You lose ${formatCurrency(Math.abs(worst.unitProfit), currency)} on every unit sold (${formatCurrency(Math.abs(worst.moneyLeft), currency)} total lost this period across ${worst.product.unitsSold} sales).`,
      whyItMatters: `Every time a customer orders this item, money leaves your bank account instead of staying in it. High sales of a losing product makes your business lose money faster.`,
      investigate: `Check if you can raise the selling price to at least ${formatCurrency(worst.product.unitCost * 1.5, currency)}, or negotiate cheaper ingredients with your suppliers.`,
      limitation: `If customers only visit your store because of this specific item (a "loss leader"), raising the price might slightly reduce store foot traffic.`,
      priority: 'high',
      category: 'pricing',
      source: 'rule',
    });
  }

  // Rule 2: Low margin on high volume item
  const lowMarginHighVolume = productMetrics.filter(
    p => p.marginPercent > 0 && p.marginPercent < 40 && p.product.unitsSold >= 100
  );
  if (lowMarginHighVolume.length > 0) {
    const item = lowMarginHighVolume[0];
    const proposedPrice = item.product.sellingPrice * 1.08; // 8% test increase
    const additionalGain = (proposedPrice - item.product.sellingPrice) * item.product.unitsSold;
    suggestions.push({
      id: 'rule-low-margin-high-vol',
      title: `Small Price Change on Popular Item: ${item.product.name}`,
      noticed: `"${item.product.name}" is very popular, but you only keep ${formatPercent(item.marginPercent)} of each sale.`,
      numbers: `You sold ${item.product.unitsSold} units at ${formatCurrency(item.product.sellingPrice, currency)}, keeping ${formatCurrency(item.unitProfit, currency)} per sale. A modest 8% increase to ${formatCurrency(proposedPrice, currency)} would generate an extra ${formatCurrency(additionalGain, currency)} in pocket if sales remain steady.`,
      whyItMatters: `High-volume items have the greatest leverage. A tiny price adjustment creates substantial cash without having to find new customers.`,
      investigate: `Test a small price increase of 25 to 50 cents, or offer bundle deals with high-margin side items.`,
      limitation: `Competitor prices in your immediate area could cause some customers to notice, though small adjustments under 10% are often tolerated.`,
      priority: 'medium',
      category: 'pricing',
      source: 'rule',
    });
  }

  // Rule 3: Single expense dominating total spending
  if (summary.highestCostExpense && summary.highestCostExpense.percentage > 35) {
    suggestions.push({
      id: 'rule-dominant-expense',
      title: `Review Your Largest Bill: ${summary.highestCostExpense.category}`,
      noticed: `${summary.highestCostExpense.category} represents your single biggest operational spending category.`,
      numbers: `You spent ${formatCurrency(summary.highestCostExpense.amount, currency)} on ${summary.highestCostExpense.category}, which is ${formatPercent(summary.highestCostExpense.percentage)} of all running costs this period.`,
      whyItMatters: `Because this is your largest bucket of expenses, saving even 5% here (${formatCurrency(summary.highestCostExpense.amount * 0.05, currency)}) goes straight to your bottom line.`,
      investigate: `Review the detailed vendor invoices for ${summary.highestCostExpense.category} to see if rates changed, or compare competitive service quotes.`,
      limitation: `Fixed costs like base rent cannot always be changed immediately, but utility timing or contract terms may be negotiable upon renewal.`,
      priority: 'medium',
      category: 'expenses',
      source: 'rule',
    });
  }

  // Rule 4: Overall bottom line check (Net Profit negative vs healthy)
  if (summary.netProfit < 0) {
    suggestions.push({
      id: 'rule-negative-bottom-line',
      title: `Business is Currently Spending More Than It Brings In`,
      noticed: `Total money going out exceeds total money coming in this period.`,
      numbers: `Money earned from sales: ${formatCurrency(summary.totalRevenue, currency)}. Total money spent (goods + bills): ${formatCurrency(summary.totalMoneySpent, currency)}. Cash shortfall: ${formatCurrency(Math.abs(summary.netProfit), currency)}.`,
      whyItMatters: `Without changes, you will need to dip into savings or loans to cover the gap each month.`,
      investigate: `Use the "What If I Change Something?" simulator tab to test lowering your highest expense category and adjusting prices on your top 2 items.`,
      limitation: `A single slow month or seasonal lull is normal, but several consecutive months requires swift intervention.`,
      priority: 'high',
      category: 'volume',
      source: 'rule',
    });
  } else if (summary.topProfitableProduct) {
    suggestions.push({
      id: 'rule-top-profit-driver',
      title: `Promote Your Star Product: ${summary.topProfitableProduct.product.name}`,
      noticed: `"${summary.topProfitableProduct.product.name}" produces the most cash for your business.`,
      numbers: `This single item brought in ${formatCurrency(summary.topProfitableProduct.moneyLeft, currency)} in profit (${formatPercent(summary.grossProfit > 0 ? (summary.topProfitableProduct.moneyLeft / summary.grossProfit) * 100 : 0)} of all product profit) with a strong ${formatPercent(summary.topProfitableProduct.marginPercent)} margin.`,
      whyItMatters: `Every additional unit of this product sold has high profitability and pays down your rent and staff bills rapidly.`,
      investigate: `Position this item at the top of your menu board, train staff to suggest it, or feature it in social posts.`,
      limitation: `Be careful not to ignore other menu items that customer companions might prefer.`,
      priority: 'low',
      category: 'products',
      source: 'rule',
    });
  }

  return suggestions;
}
