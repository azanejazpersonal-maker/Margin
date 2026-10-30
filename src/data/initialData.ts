import { Product, Expense, BusinessSettings } from '../types';

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'My Business',
  businessType: 'General Business & Store',
  currency: '$',
  currencyCode: 'USD',
  periodLabel: 'This Month',
};

// Clean initial starter items that the user can immediately edit, delete, or add to
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Top Seller Item',
    category: 'Products',
    sellingPrice: 5.00,
    unitCost: 1.25,
    unitsSold: 500,
    notes: 'You keep $3.75 every time someone buys this!',
  },
  {
    id: 'prod-2',
    name: 'Everyday Item',
    category: 'Products',
    sellingPrice: 12.00,
    unitCost: 4.00,
    unitsSold: 180,
    notes: 'You keep $8.00 on every sale.',
  },
  {
    id: 'prod-3',
    name: 'Special Service / Meal',
    category: 'Services',
    sellingPrice: 25.00,
    unitCost: 9.00,
    unitsSold: 75,
    notes: 'Solid earner with $16.00 profit per unit.',
  },
  {
    id: 'prod-4',
    name: 'Leaking Cost Item',
    category: 'Watchlist',
    sellingPrice: 4.00,
    unitCost: 4.80,
    unitsSold: 90,
    notes: 'UH OH: You lose 80 cents every time! You are paying customers to take it!',
  },
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Rent',
    amount: 1500,
    description: 'Monthly store or office rent',
    period: 'This Month',
  },
  {
    id: 'exp-2',
    category: 'Staff',
    amount: 1200,
    description: 'Helpers and workers wages',
    period: 'This Month',
  },
  {
    id: 'exp-3',
    category: 'Electricity',
    amount: 280,
    description: 'Lights, power, and heating/cooling bills',
    period: 'This Month',
  },
  {
    id: 'exp-4',
    category: 'Other',
    amount: 150,
    description: 'Phone, internet, and store supplies',
    period: 'This Month',
  },
];
