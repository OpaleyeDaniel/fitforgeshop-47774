export interface KarmaWallet {
  id: string;
  user_id: string;
  balance: number;
  earned_total: number;
  spent_total: number;
  gifted_total: number;
  created_at: string;
  updated_at: string;
}

export interface KarmaItem {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  brand?: string;
  karma_value: number;
  valuation_breakdown?: ValuationBreakdown;
  images: string[];
  status: 'available' | 'pending' | 'sold' | 'removed';
  location?: string;
  created_at: string;
  updated_at: string;
  seller?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface ValuationBreakdown {
  condition_score: number;
  brand_score: number;
  category_baseline: number;
  demand_adjustment: number;
  total: number;
  explanation: string;
}

export interface KarmaTransaction {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  item_id?: string;
  amount: number;
  transaction_type: 'trade' | 'gift' | 'reward' | 'refund';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description?: string;
  created_at: string;
  from_user?: {
    username: string;
    avatar_url: string | null;
  };
  to_user?: {
    username: string;
    avatar_url: string | null;
  };
  item?: {
    title: string;
    images: string[];
  };
}

export interface KarmaEscrow {
  id: string;
  transaction_id: string;
  buyer_id: string;
  seller_id: string;
  item_id: string;
  amount: number;
  status: 'held' | 'released' | 'disputed' | 'refunded';
  created_at: string;
  released_at?: string;
  dispute_reason?: string;
}

export interface KarmaChat {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  item?: KarmaItem;
  buyer?: {
    username: string;
    avatar_url: string | null;
  };
  seller?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface KarmaMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

export type TradingMode = 'cash' | 'karma';
