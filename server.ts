import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to get GoogleGenAI client with custom or env key
function getAiClient(customKey?: string): GoogleGenAI | null {
  const candidate = (typeof customKey === 'string' && customKey.trim().length > 10)
    ? customKey.trim()
    : process.env.GEMINI_API_KEY;

  if (!candidate || candidate === 'MY_GEMINI_API_KEY' || candidate.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: candidate.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Timeout helper: guarantees API call never hangs indefinitely
function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// Health & AI status check
app.get('/api/status', (req, res) => {
  const customKey = req.headers['x-gemini-api-key'] as string | undefined;
  const ai = getAiClient(customKey);
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    model: 'gemini-3.1-flash-lite',
    message: ai 
      ? 'Gemini 3.1 Flash Lite AI is active, free & fast.' 
      : 'Using built-in automatic calculation engine.',
  });
});

// Explain My Business endpoint
app.post('/api/gemini/explain-business', async (req, res) => {
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body.customApiKey;
  const ai = getAiClient(customKey);

  const { businessName, currency, totalRevenue, totalExpenses, netProfit, topProduct, leakProduct, topExpense } = req.body;
  const curr = currency || '$';
  const isProfitable = Number(netProfit) >= 0;

  // Instant deterministic toddler-simple explanation fallback
  const fallbackExplanation = isProfitable
    ? `The Big Picture:
Your business is making money! You collected ${curr}${totalRevenue} from customer sales. After paying ${curr}${totalExpenses} for goods and store running costs, you have ${curr}${netProfit} left in your pocket.

The Good and The Leaks:
Your biggest winner is "${topProduct?.name || 'your top product'}", which brought in ${curr}${topProduct?.left || 0} in profit. Watch out for your biggest running bill, which is ${topExpense?.category || 'store expenses'} at ${curr}${topExpense?.amount || 0}.

What To Do Next:
1. Sell 10% more of "${topProduct?.name || 'your best seller'}" by putting it front and center.
2. Review your ${topExpense?.category || 'bills'} to see if you can lower that cost next month.`
    : `The Big Picture:
Right now your business is losing money. You took in ${curr}${totalRevenue}, but spent ${curr}${totalExpenses}. That means ${curr}${Math.abs(Number(netProfit))} came out of your own pocket.

The Good and The Leaks:
Your largest bill is ${topExpense?.category || 'store expenses'} at ${curr}${topExpense?.amount || 0}. Also, check "${leakProduct?.name || 'your lowest margin product'}"—its margin is low and needs attention.

What To Do Next:
1. Increase the price of "${topProduct?.name || 'your items'}" slightly to protect your profits.
2. Cut or pause unnecessary spending on ${topExpense?.category || 'running bills'} right away.`;

  if (!ai) {
    return res.json({
      success: true,
      explanation: fallbackExplanation,
      source: 'smart-engine',
    });
  }

  const prompt = `
You are MARGIN's plain-English business analyzer.
Explain this small business's current performance to a non-expert owner in simple, everyday English (like explaining to a beginner or child).
Do not use jargon like "operating leverage", "EBITDA", "amortization", or "COGS".
Use simple terms like:
- "Money Earned From Sales"
- "Money Spent Running the Business"
- "Money Left After Paying for Products"
- "Money Kept in Your Pocket"

Business Context:
- Name: ${businessName || 'My Business'}
- Currency: ${curr}
- Money Earned: ${curr}${totalRevenue}
- Total Money Spent: ${curr}${totalExpenses}
- Money Left Over: ${curr}${netProfit}
- Best Selling & Profit Item: ${topProduct?.name || 'N/A'} (Earned: ${curr}${topProduct?.earned}, Kept: ${curr}${topProduct?.left})
- Weakest / Watchlist Item: ${leakProduct?.name || 'N/A'} (Margin: ${leakProduct?.margin}%, Left: ${curr}${leakProduct?.left})
- Largest Expense: ${topExpense?.category || 'N/A'} (${curr}${topExpense?.amount})

Provide a structured explanation with these 3 sections in simple English:
1. The Big Picture: Tell them straight whether the business is making money or losing money, and how much is left.
2. The Good and The Leaks: Highlight what is working well and identify the exact leak or highest cost draining funds.
3. What To Do Next: Exactly 2 practical, step-by-step actions they can try this week.

Keep it encouraging, completely factual to these numbers, and under 200 words total.
`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      }),
      5000
    );

    res.json({
      success: true,
      explanation: response.text || fallbackExplanation,
      source: 'gemini-3.1-flash-lite',
    });
  } catch (err: any) {
    console.warn('Gemini 3.1 Flash Lite fallback activated for explanation:', err?.message || err);
    res.json({
      success: true,
      explanation: fallbackExplanation,
      source: 'smart-engine-fallback',
    });
  }
});

// Smart Suggestions endpoint
app.post('/api/gemini/smart-suggestions', async (req, res) => {
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body.customApiKey;
  const ai = getAiClient(customKey);

  const { products, expenses, currency, businessName } = req.body;
  const curr = currency || '$';

  // Instant deterministic rule suggestions fallback
  const fallbackSuggestions = [
    {
      title: 'Protect Your Profit on Lower-Margin Items',
      noticed: 'Some items cost almost as much to make as you sell them for.',
      numbers: `Reviewed ${Array.isArray(products) ? products.length : 0} products against current unit costs.`,
      whyItMatters: 'Every sale of a low-profit item takes your time but leaves very little cash in your piggy bank.',
      investigate: 'Consider raising price by 5% to 10% on your top-selling items to test customer response.',
      limitation: 'Price increases might slightly reduce volume if competitors charge much less.',
      priority: 'high',
      category: 'pricing',
    },
    {
      title: 'Review Your Largest Running Bill',
      noticed: 'Store bills and operating costs can quietly drain your earnings.',
      numbers: `Reviewed ${Array.isArray(expenses) ? expenses.length : 0} expense categories.`,
      whyItMatters: 'Fixed monthly bills must be paid even during slow weeks or off-peak seasons.',
      investigate: 'Call service providers or compare rates for utilities, supplies, or software subscriptions.',
      limitation: 'Essential costs like rent or electricity cannot always be reduced immediately.',
      priority: 'medium',
      category: 'expenses',
    },
    {
      title: 'Focus on What Sells Best',
      noticed: 'A small portion of your items brings in the majority of your cash.',
      numbers: 'Top items drive the highest percentage of money kept.',
      whyItMatters: 'Selling 10 more of your best item is much easier than fixing an unpopular one.',
      investigate: 'Highlight your top earner with signs, social posts, or bundle recommendations.',
      limitation: 'Requires steady inventory and ingredient supply.',
      priority: 'medium',
      category: 'products',
    },
  ];

  if (!ai) {
    return res.json({
      success: true,
      suggestions: fallbackSuggestions,
      source: 'smart-rule-engine',
    });
  }

  const prompt = `
Analyze this small business data for "${businessName || 'Business'}" using currency "${curr}".
Products list: ${JSON.stringify(products)}
Expenses list: ${JSON.stringify(expenses)}

Generate 3 to 4 actionable, practical business suggestions in simple everyday English.
Every single suggestion must follow this exact 5-point contract:
1. What was noticed (the observation)
2. Which numbers support it (exact figures from the data)
3. Why it matters (how it impacts cash in pocket)
4. What the user could investigate (specific, non-risky action to check)
5. Limitations or uncertainties (what we don't know without testing)

Return ONLY valid JSON in this format:
[
  {
    "title": "Short title in plain English",
    "noticed": "...",
    "numbers": "...",
    "whyItMatters": "...",
    "investigate": "...",
    "limitation": "...",
    "priority": "high" | "medium" | "low",
    "category": "pricing" | "expenses" | "products" | "volume"
  }
]
`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      5000
    );

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({
        success: true,
        suggestions: parsed,
        source: 'gemini-3.1-flash-lite',
      });
    }
    throw new Error('Empty suggestions from AI');
  } catch (err: any) {
    console.warn('Gemini 3.1 Flash Lite suggestions fallback activated:', err?.message || err);
    res.json({
      success: true,
      suggestions: fallbackSuggestions,
      source: 'smart-rule-engine-fallback',
    });
  }
});

// Question answering endpoint for "Ask MARGIN"
app.post('/api/gemini/ask-margin', async (req, res) => {
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body.customApiKey;
  const ai = getAiClient(customKey);

  const { question, businessData } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const curr = businessData?.currency || '$';
  const fallbackAnswer = `Based on your numbers: You took in ${curr}${businessData?.revenue || 0} and spent ${curr}${businessData?.totalExpenses || 0}, leaving ${curr}${businessData?.netProfit || 0}. 

To improve your cash: Focus on selling more of your highest-profit items and review your highest expenses. Remember to test any price changes with a small group first!`;

  if (!ai) {
    return res.json({
      success: true,
      answer: fallbackAnswer,
      source: 'smart-engine',
    });
  }

  const prompt = `
You are MARGIN's small business financial copilot.
User Question: "${question}"

Current Real Business Data:
${JSON.stringify(businessData, null, 2)}

Rules:
1. Answer in very simple, plain English (no financial jargon).
2. Ground your answer strictly in their real numbers.
3. If they ask about price changes, calculate the math directly.
4. Always clarify that this is an estimate to test, not a guarantee.
5. Keep it concise, helpful, and scannable (under 180 words).
`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      }),
      5000
    );

    res.json({
      success: true,
      answer: response.text || fallbackAnswer,
      source: 'gemini-3.1-flash-lite',
    });
  } catch (err: any) {
    console.warn('Gemini ask-margin fallback activated:', err?.message || err);
    res.json({
      success: true,
      answer: fallbackAnswer,
      source: 'smart-engine-fallback',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MARGIN server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
