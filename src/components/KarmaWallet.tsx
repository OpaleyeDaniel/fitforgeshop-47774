import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Coins, TrendingUp, TrendingDown, Gift, History } from 'lucide-react';
import { useKarma } from '@/contexts/KarmaContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KarmaTransaction } from '@/types/karma';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const KarmaWallet = () => {
  const { wallet, loading, giftKarma, refreshWallet } = useKarma();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<KarmaTransaction[]>([]);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftAmount, setGiftAmount] = useState('');

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('karma_transactions')
      .select(`
        *,
        from_user:profiles!karma_transactions_from_user_id_fkey(username, avatar_url),
        to_user:profiles!karma_transactions_to_user_id_fkey(username, avatar_url),
        item:karma_items(title, images)
      `)
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setTransactions(data as any);
    }
  };

  const handleGiftKarma = async () => {
    const amount = parseInt(giftAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Find user by username
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', giftRecipient)
      .single();

    if (!recipient) {
      toast.error('User not found');
      return;
    }

    const success = await giftKarma(recipient.id, amount);
    if (success) {
      setShowGiftDialog(false);
      setGiftRecipient('');
      setGiftAmount('');
      fetchTransactions();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading wallet...</div>;
  }

  if (!wallet) {
    return <div className="text-center py-8">Please sign in to view your wallet</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Karma Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-primary">{wallet.balance}</div>
            <div className="text-sm text-muted-foreground mt-2">Available Karma Points</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-accent">
              <TrendingUp className="h-5 w-5 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-semibold">{wallet.earned_total}</div>
              <div className="text-xs text-muted-foreground">Earned</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <TrendingDown className="h-5 w-5 mx-auto text-orange-500 mb-2" />
              <div className="text-2xl font-semibold">{wallet.spent_total}</div>
              <div className="text-xs text-muted-foreground">Spent</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <Gift className="h-5 w-5 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-semibold">{wallet.gifted_total}</div>
              <div className="text-xs text-muted-foreground">Gifted</div>
            </div>
          </div>

          <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Gift className="mr-2 h-4 w-4" />
                Gift Karma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gift Karma Points</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Username</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter username"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter karma amount"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleGiftKarma} className="w-full">
                  Send Gift
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No transactions yet
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {tx.transaction_type === 'gift' && tx.from_user_id === user?.id
                        ? `Gifted to ${tx.to_user?.username || 'Unknown'}`
                        : tx.transaction_type === 'gift'
                        ? `Gift from ${tx.from_user?.username || 'Unknown'}`
                        : tx.transaction_type === 'trade'
                        ? `Trade: ${tx.item?.title || 'Item'}`
                        : tx.transaction_type}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      tx.to_user_id === user?.id ? 'text-green-500' : 'text-orange-500'
                    }`}
                  >
                    {tx.to_user_id === user?.id ? '+' : '-'}
                    {tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KarmaWallet;
