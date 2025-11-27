-- Create karma_wallets table for user balances
CREATE TABLE public.karma_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  earned_total INTEGER NOT NULL DEFAULT 0,
  spent_total INTEGER NOT NULL DEFAULT 0,
  gifted_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create karma_items table for user-listed items
CREATE TABLE public.karma_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  brand TEXT,
  karma_value INTEGER NOT NULL CHECK (karma_value > 0),
  valuation_breakdown JSONB,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'removed')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create karma_transactions table
CREATE TABLE public.karma_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  item_id UUID REFERENCES karma_items(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('trade', 'gift', 'reward', 'refund')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create karma_escrow table
CREATE TABLE public.karma_escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES karma_transactions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES karma_items(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'released', 'disputed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE,
  dispute_reason TEXT
);

-- Create karma_wishlists table
CREATE TABLE public.karma_wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES karma_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Create user_follows table for social features
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create karma_chats table for messaging
CREATE TABLE public.karma_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES karma_items(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, buyer_id)
);

-- Create karma_messages table
CREATE TABLE public.karma_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES karma_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.karma_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for karma_wallets
CREATE POLICY "Users can view their own wallet"
  ON public.karma_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON public.karma_wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for karma_items
CREATE POLICY "Anyone can view available items"
  ON public.karma_items FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own items"
  ON public.karma_items FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own items"
  ON public.karma_items FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own items"
  ON public.karma_items FOR DELETE
  USING (auth.uid() = seller_id);

-- RLS Policies for karma_transactions
CREATE POLICY "Users can view their own transactions"
  ON public.karma_transactions FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create transactions"
  ON public.karma_transactions FOR INSERT
  WITH CHECK (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- RLS Policies for karma_escrow
CREATE POLICY "Users can view their own escrow"
  ON public.karma_escrow FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for karma_wishlists
CREATE POLICY "Users can view their own wishlist"
  ON public.karma_wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist"
  ON public.karma_wishlists FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user_follows
CREATE POLICY "Anyone can view follows"
  ON public.user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON public.user_follows FOR ALL
  USING (auth.uid() = follower_id);

-- RLS Policies for karma_chats
CREATE POLICY "Users can view their own chats"
  ON public.karma_chats FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create chats"
  ON public.karma_chats FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for karma_messages
CREATE POLICY "Users can view messages in their chats"
  ON public.karma_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.karma_chats
      WHERE karma_chats.id = karma_messages.chat_id
      AND (karma_chats.buyer_id = auth.uid() OR karma_chats.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their chats"
  ON public.karma_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.karma_chats
      WHERE karma_chats.id = karma_messages.chat_id
      AND (karma_chats.buyer_id = auth.uid() OR karma_chats.seller_id = auth.uid())
    )
  );

-- Create trigger to auto-create wallet on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.karma_wallets (user_id, balance)
  VALUES (NEW.id, 100); -- Start with 100 karma points
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_wallet();

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_karma_wallets_updated_at
  BEFORE UPDATE ON public.karma_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_karma_items_updated_at
  BEFORE UPDATE ON public.karma_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_karma_items_seller ON public.karma_items(seller_id);
CREATE INDEX idx_karma_items_status ON public.karma_items(status);
CREATE INDEX idx_karma_items_category ON public.karma_items(category);
CREATE INDEX idx_karma_transactions_from_user ON public.karma_transactions(from_user_id);
CREATE INDEX idx_karma_transactions_to_user ON public.karma_transactions(to_user_id);
CREATE INDEX idx_karma_escrow_buyer ON public.karma_escrow(buyer_id);
CREATE INDEX idx_karma_escrow_seller ON public.karma_escrow(seller_id);
CREATE INDEX idx_karma_escrow_status ON public.karma_escrow(status);
CREATE INDEX idx_karma_chats_buyer ON public.karma_chats(buyer_id);
CREATE INDEX idx_karma_chats_seller ON public.karma_chats(seller_id);
CREATE INDEX idx_karma_messages_chat ON public.karma_messages(chat_id);