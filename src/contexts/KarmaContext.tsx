import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { KarmaWallet, TradingMode } from '@/types/karma';
import { toast } from 'sonner';

interface KarmaContextType {
  wallet: KarmaWallet | null;
  loading: boolean;
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  refreshWallet: () => Promise<void>;
  deductKarma: (amount: number, description?: string) => Promise<boolean>;
  addKarma: (amount: number, description?: string) => Promise<boolean>;
  giftKarma: (toUserId: string, amount: number) => Promise<boolean>;
}

const KarmaContext = createContext<KarmaContextType | undefined>(undefined);

export const KarmaProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<KarmaWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradingMode, setTradingMode] = useState<TradingMode>('cash');

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('karma_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching wallet:', error);
      setWallet(null);
    } else {
      setWallet(data);
    }
    setLoading(false);
  };

  const refreshWallet = async () => {
    await fetchWallet();
  };

  const deductKarma = async (amount: number, description?: string): Promise<boolean> => {
    if (!user || !wallet) return false;

    if (wallet.balance < amount) {
      toast.error('Insufficient Karma balance');
      return false;
    }

    const { error } = await supabase
      .from('karma_wallets')
      .update({
        balance: wallet.balance - amount,
        spent_total: wallet.spent_total + amount,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deducting karma:', error);
      toast.error('Failed to deduct Karma');
      return false;
    }

    await refreshWallet();
    return true;
  };

  const addKarma = async (amount: number, description?: string): Promise<boolean> => {
    if (!user || !wallet) return false;

    const { error } = await supabase
      .from('karma_wallets')
      .update({
        balance: wallet.balance + amount,
        earned_total: wallet.earned_total + amount,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error adding karma:', error);
      toast.error('Failed to add Karma');
      return false;
    }

    await refreshWallet();
    return true;
  };

  const giftKarma = async (toUserId: string, amount: number): Promise<boolean> => {
    if (!user || !wallet) return false;

    if (wallet.balance < amount) {
      toast.error('Insufficient Karma balance');
      return false;
    }

    // Deduct from sender
    const { error: deductError } = await supabase
      .from('karma_wallets')
      .update({
        balance: wallet.balance - amount,
        gifted_total: wallet.gifted_total + amount,
      })
      .eq('user_id', user.id);

    if (deductError) {
      console.error('Error deducting karma:', deductError);
      toast.error('Failed to gift Karma');
      return false;
    }

    // Add to recipient
    const { data: recipientWallet } = await supabase
      .from('karma_wallets')
      .select('*')
      .eq('user_id', toUserId)
      .single();

    if (recipientWallet) {
      await supabase
        .from('karma_wallets')
        .update({
          balance: recipientWallet.balance + amount,
          earned_total: recipientWallet.earned_total + amount,
        })
        .eq('user_id', toUserId);
    }

    // Create transaction record
    await supabase.from('karma_transactions').insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      amount,
      transaction_type: 'gift',
      status: 'completed',
    });

    await refreshWallet();
    toast.success('Karma gifted successfully!');
    return true;
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  return (
    <KarmaContext.Provider
      value={{
        wallet,
        loading,
        tradingMode,
        setTradingMode,
        refreshWallet,
        deductKarma,
        addKarma,
        giftKarma,
      }}
    >
      {children}
    </KarmaContext.Provider>
  );
};

export const useKarma = () => {
  const context = useContext(KarmaContext);
  if (context === undefined) {
    throw new Error('useKarma must be used within a KarmaProvider');
  }
  return context;
};
