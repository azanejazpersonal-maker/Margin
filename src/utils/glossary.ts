export interface GlossaryItem {
  id: string;
  simpleTitle: string;
  formalTerm: string;
  explanation: string;
  example: string;
  tips?: string;
}

export const GLOSSARY: Record<string, GlossaryItem> = {
  revenue: {
    id: 'revenue',
    simpleTitle: 'Money Earned From Sales',
    formalTerm: 'Revenue / Gross Sales',
    explanation: 'The total amount of money that customers paid you for buying your products or services, before subtracting any costs or expenses.',
    example: 'If you sell 100 oat milk lattes for $5.50 each, your Money Earned From Sales is $550.',
    tips: 'High sales does not always mean high profit. If your costs are also high, little money may be left over.',
  },
  cogs: {
    id: 'cogs',
    simpleTitle: 'Cost of the Products You Sold',
    formalTerm: 'Cost of Goods Sold (COGS)',
    explanation: 'What you personally paid to purchase or prepare the actual items that were sold. This includes raw ingredients, packaging, cups, and direct supplier costs.',
    example: 'For one latte: $0.65 milk + $0.45 coffee beans + $0.30 cup and lid = $1.40 product cost.',
    tips: 'Negotiating volume discounts with suppliers lowers this number and directly increases the money you keep.',
  },
  grossProfit: {
    id: 'grossProfit',
    simpleTitle: 'Money Left After Paying for Products',
    formalTerm: 'Gross Profit',
    explanation: 'This is the money remaining after subtracting what your products cost you. You still need to pay your other business expenses (like rent and staff wages) out of this money.',
    example: '$15,000 earned from sales − $4,000 spent on coffee beans and cups = $11,000 left to pay running expenses.',
    tips: 'If this number is lower than your monthly rent and staff bills, your business cannot be profitable.',
  },
  grossMargin: {
    id: 'grossMargin',
    simpleTitle: 'How Much You Keep From Each Sale',
    formalTerm: 'Gross Margin Percentage',
    explanation: 'The percentage of every dollar that stays in your pocket after paying for the product itself. The higher this percentage, the more money stays with you.',
    example: 'A 75% margin means on a $10 meal, $7.50 stays with you, while $2.50 goes to pay for the ingredients.',
    tips: 'Most cafes aim for 70% to 80% on drinks, while food typically runs between 50% and 65%.',
  },
  operatingExpenses: {
    id: 'operatingExpenses',
    simpleTitle: 'Money Spent Running the Business',
    formalTerm: 'Operating Expenses (OPEX)',
    explanation: 'The ongoing bills you have to pay just to keep your doors open, regardless of how many individual items you sell. This includes rent, electricity, team wages, insurance, and marketing.',
    example: '$2,800 storefront rent + $840 power bill + $3,600 barista payroll = $7,240 running expenses.',
    tips: 'Reviewing utility bills and subscription software once a year can uncover quick monthly savings.',
  },
  netProfit: {
    id: 'netProfit',
    simpleTitle: 'Total Money Left Over',
    formalTerm: 'Net Profit / Net Income',
    explanation: 'The actual profit your business keeps after paying for BOTH the product ingredients and all other monthly bills. This is your true financial bottom line.',
    example: '$11,000 left after products − $7,240 rent and bills = $3,760 total money left.',
    tips: 'This money can be reinvested in new equipment, saved for slow months, or paid out to the business owners.',
  },
  lossLeader: {
    id: 'lossLeader',
    simpleTitle: 'Product Selling at a Loss',
    formalTerm: 'Negative Profit Item',
    explanation: 'When the cost to make or buy an item is higher than the price you charge customers. Every single sale of this product loses you money.',
    example: 'If an artisan brioche costs $4.50 to make and you sell it for $4.00, you lose $0.50 every time a customer orders it.',
    tips: 'Either increase the price, find a cheaper ingredient source, or bundle it with a high-margin hot coffee.',
  },
  whatIf: {
    id: 'whatIf',
    simpleTitle: 'What If I Change Something?',
    formalTerm: 'Scenario Simulation',
    explanation: 'A risk-free calculator that shows how adjustments to your prices, product costs, or monthly expenses will alter your profit before you test changes in reality.',
    example: 'If you raise coffee prices by 25 cents across 1,000 customers, you immediately keep $250 more profit each month.',
    tips: 'Try testing small, realistic changes first (like 25 cents on a beverage) rather than huge jumps.',
  },
};
