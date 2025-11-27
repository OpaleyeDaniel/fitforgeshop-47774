import { ValuationBreakdown } from '@/types/karma';

interface ValuationInput {
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  category: string;
  brand?: string;
  images?: string[];
}

const CONDITION_SCORES = {
  new: 1.0,
  like_new: 0.9,
  good: 0.75,
  fair: 0.5,
  poor: 0.3,
};

const CATEGORY_BASELINES: Record<string, number> = {
  electronics: 500,
  phones: 600,
  laptops: 800,
  tablets: 400,
  watches: 300,
  shoes: 150,
  clothing: 100,
  bags: 200,
  accessories: 80,
  furniture: 400,
  books: 50,
  sports: 150,
  toys: 80,
  tools: 200,
  home: 120,
  other: 100,
};

const BRAND_MULTIPLIERS: Record<string, number> = {
  apple: 1.5,
  samsung: 1.3,
  nike: 1.2,
  adidas: 1.2,
  gucci: 1.8,
  prada: 1.7,
  sony: 1.3,
  canon: 1.3,
  nikon: 1.3,
  default: 1.0,
};

/**
 * AI-Powered Karma Valuation Engine
 * This is a placeholder implementation. Replace with actual AI model later.
 */
export const calculateKarmaValue = async (input: ValuationInput): Promise<ValuationBreakdown> => {
  // Get base values
  const conditionScore = CONDITION_SCORES[input.condition];
  const categoryBaseline = CATEGORY_BASELINES[input.category.toLowerCase()] || CATEGORY_BASELINES.other;
  const brandMultiplier = input.brand 
    ? BRAND_MULTIPLIERS[input.brand.toLowerCase()] || BRAND_MULTIPLIERS.default
    : BRAND_MULTIPLIERS.default;

  // Calculate brand score contribution
  const brandScore = Math.round(categoryBaseline * (brandMultiplier - 1));

  // Simulate demand adjustment (random for now, replace with real data)
  const demandAdjustment = Math.round((Math.random() - 0.5) * 50);

  // Calculate total karma value
  const baseValue = categoryBaseline * conditionScore * brandMultiplier;
  const total = Math.max(50, Math.round(baseValue + demandAdjustment));

  // Generate explanation
  const explanation = `
Based on AI analysis:
• Condition: ${input.condition.replace('_', ' ')} (${(conditionScore * 100).toFixed(0)}% value retention)
• Category baseline: ${categoryBaseline} karma
${input.brand ? `• Brand premium: ${input.brand} (+${(brandMultiplier * 100 - 100).toFixed(0)}%)` : ''}
• Market demand: ${demandAdjustment >= 0 ? '+' : ''}${demandAdjustment} karma
  `.trim();

  return {
    condition_score: Math.round(categoryBaseline * conditionScore),
    brand_score: brandScore,
    category_baseline: categoryBaseline,
    demand_adjustment: demandAdjustment,
    total,
    explanation,
  };
};

/**
 * Placeholder for future image-based condition analysis
 */
export const analyzeImageCondition = async (imageUrl: string): Promise<number> => {
  // TODO: Implement actual AI image analysis
  // For now, return a random score
  return Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
};

/**
 * Get supply/demand data for a category (placeholder)
 */
export const getCategoryDemand = async (category: string): Promise<number> => {
  // TODO: Fetch real supply/demand data from database
  return Math.random() * 100 - 50; // Random adjustment between -50 and +50
};
