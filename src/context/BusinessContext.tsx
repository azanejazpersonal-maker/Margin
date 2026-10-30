import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Expense, BusinessSettings, Scenario, BusinessSummary } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_PRODUCTS, DEFAULT_EXPENSES } from '../data/initialData';
import { calculateBusinessSummary, formatCurrency } from '../utils/calculations';

interface BusinessContextType {
  products: Product[];
  expenses: Expense[];
  settings: BusinessSettings;
  savedScenarios: Scenario[];
  summary: BusinessSummary;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  explainerKey: string | null;
  openExplainer: (key: string) => void;
  closeExplainer: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sellMore: (id: string, count?: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateSettings: (updates: Partial<BusinessSettings>) => void;
  clearAllData: () => void;
  loadStarterIdeas: () => void;
  saveScenario: (scenario: Scenario) => void;
  deleteScenario: (id: string) => void;
  exportToCsv: (type: 'products' | 'expenses' | 'summary') => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'margin_user_products_v2',
  EXPENSES: 'margin_user_expenses_v2',
  SETTINGS: 'margin_user_settings_v2',
  SCENARIOS: 'margin_user_scenarios_v2',
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [explainerKey, setExplainerKey] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return stored ? JSON.parse(stored) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  // Saved scenarios
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed for settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage save failed for products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.warn('LocalStorage save failed for expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(savedScenarios));
    } catch (e) {
      console.warn('LocalStorage save failed for scenarios', e);
    }
  }, [savedScenarios]);

  // Real-time summary
  const summary = useMemo(() => {
    return calculateBusinessSummary(products, expenses);
  }, [products, expenses]);

  // Product actions
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Immersive interactive "+1 or +10 sales" trigger
  const sellMore = (id: string, count: number = 1) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, unitsSold: Math.max(0, p.unitsSold + count) };
      }
      return p;
    }));
  };

  // Expense actions
  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...e,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Clear all data for clean slate
  const clearAllData = () => {
    setProducts([]);
    setExpenses([]);
    setSettings(prev => ({ ...prev, businessName: 'My Business' }));
  };

  // Load starter ideas if user wants inspiration
  const loadStarterIdeas = () => {
    setProducts(DEFAULT_PRODUCTS);
    setExpenses(DEFAULT_EXPENSES);
  };

  // Scenarios
  const saveScenario = (scenario: Scenario) => {
    setSavedScenarios(prev => {
      const existingIdx = prev.findIndex(s => s.id === scenario.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = scenario;
        return copy;
      }
      return [scenario, ...prev];
    });
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  // CSV export
  const exportToCsv = (type: 'products' | 'expenses' | 'summary') => {
    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (type === 'products') {
      const headers = ['Product Name', 'Category', 'Selling Price', 'Unit Cost', 'Units Sold', 'Money In', 'Money You Keep', 'Margin %'];
      const rows = products.map(p => {
        const earned = p.sellingPrice * p.unitsSold;
        const kept = (p.sellingPrice - p.unitCost) * p.unitsSold;
        const margin = p.sellingPrice > 0 ? (((p.sellingPrice - p.unitCost) / p.sellingPrice) * 100).toFixed(1) : '0.0';
        return [
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.category.replace(/"/g, '""')}"`,
          p.sellingPrice.toFixed(2),
          p.unitCost.toFixed(2),
          p.unitsSold,
          earned.toFixed(2),
          kept.toFixed(2),
          `${margin}%`
        ];
      });
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'expenses') {
      const headers = ['Category', 'Description', 'Amount', 'Period'];
      const rows = expenses.map(e => [
        `"${e.category}"`,
        `"${e.description.replace(/"/g, '""')}"`,
        e.amount.toFixed(2),
        `"${e.period || 'This Month'}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      csvContent = [
        'Metric (Toddler English),Standard Financial Name,Amount',
        `"Money In From Customers","Sales Revenue","${formatCurrency(summary.totalRevenue, settings.currency)}"`,
        `"Money Spent Making Products","Cost of Goods","${formatCurrency(summary.totalProductCosts, settings.currency)}"`,
        `"Money Left From Products","Gross Profit","${formatCurrency(summary.grossProfit, settings.currency)}"`,
        `"Money Spent On Bills & Rent","Operating Expenses","${formatCurrency(summary.totalOperatingExpenses, settings.currency)}"`,
        `"Money In Your Pocket!","Net Profit","${formatCurrency(summary.netProfit, settings.currency)}"`,
      ].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${settings.businessName.replace(/\s+/g, '_')}_${type}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openExplainer = (key: string) => setExplainerKey(key);
  const closeExplainer = () => setExplainerKey(null);

  return (
    <BusinessContext.Provider
      value={{
        products,
        expenses,
        settings,
        savedScenarios,
        summary,
        activeTab,
        setActiveTab,
        explainerKey,
        openExplainer,
        closeExplainer,
        addProduct,
        updateProduct,
        deleteProduct,
        sellMore,
        addExpense,
        updateExpense,
        deleteExpense,
        updateSettings,
        clearAllData,
        loadStarterIdeas,
        saveScenario,
        deleteScenario,
        exportToCsv,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
