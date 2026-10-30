/**
 * Core domain types for MARGIN
 * Simple-English Business Platform
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  unitCost: number;
  unitsSold: number;
  notes?: string;
}

export type ExpenseCategory = 
  | 'Rent' 
  | 'Electricity' 
  | 'Staff' 
  | 'Supplies' 
  | 'Delivery' 
  | 'Marketing' 
  | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date?: string;
  period?: 'This Month' | 'Last Month';
}

export interface BusinessSettings {
  businessName: string;
  businessType: string;
  currency: string;
  currencyCode: string;
  periodLabel: string;
  geminiApiKey?: string;
}

export interface ProductAdjustment {
  adjustedPrice: number;
  adjustedCost: number;
  adjustedUnits: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  productAdjustments: Record<string, ProductAdjustment>;
  operatingExpenseDelta: number; // e.g. -200 for $200 expense reduction
  createdAt: string;
}

export interface SmartSuggestion {
  id: string;
  title: string;
  noticed: string;
  numbers: string;
  whyItMatters: string;
  investigate: string;
  limitation: string;
  priority: 'high' | 'medium' | 'low';
  category: 'pricing' | 'expenses' | 'products' | 'volume';
  source: 'ai' | 'rule';
}

export interface BusinessSummary {
  totalRevenue: number;
  totalProductCosts: number;
  grossProfit: number;
  grossMarginPercent: number;
  totalOperatingExpenses: number;
  totalMoneySpent: number;
  netProfit: number;
  netMarginPercent: number;
  topProfitableProduct: ProductCalculations | null;
  lowestMarginProduct: ProductCalculations | null;
  highestCostExpense: { category: string; amount: number; percentage: number } | null;
  totalUnitsSold: number;
}

export interface ProductCalculations {
  product: Product;
  moneyEarned: number;
  totalProductCost: number;
  moneyLeft: number;
  marginPercent: number;
  unitProfit: number;
  isLosingMoney: boolean;
}
