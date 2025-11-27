import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { KarmaItem } from '@/types/karma';
import { useAuth } from '@/contexts/AuthContext';
import { useKarma } from '@/contexts/KarmaContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, MapPin, MessageCircle, Heart, User } from 'lucide-react';
import { toast } from 'sonner';

const KarmaItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallet, deductKarma, addKarma } = useKarma();
  const [item, setItem] = useState<KarmaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    const { data, error } = await supabase
      .from('karma_items')
      .select(`
        *,
        seller:profiles!karma_items_seller_id_fkey(username, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      setItem(data as any);
    }
    setLoading(false);
  };

  const handleInitiateTradeRequest = async () => {
    if (!user) {
      toast.error('Please sign in to trade');
      navigate('/auth');
      return;
    }

    if (!wallet || wallet.balance < item!.karma_value) {
      toast.error('Insufficient Karma balance');
      return;
    }

    setProcessing(true);
    try {
      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from('karma_transactions')
        .insert({
          from_user_id: user.id,
          to_user_id: item!.seller_id,
          item_id: item!.id,
          amount: item!.karma_value,
          transaction_type: 'trade',
          status: 'pending',
        })
        .select()
        .single();

      if (txError) throw txError;

      // Create escrow
      const { error: escrowError } = await supabase.from('karma_escrow').insert({
        transaction_id: transaction.id,
        buyer_id: user.id,
        seller_id: item!.seller_id,
        item_id: item!.id,
        amount: item!.karma_value,
        status: 'held',
      });

      if (escrowError) throw escrowError;

      // Deduct karma from buyer
      await deductKarma(item!.karma_value, `Purchase: ${item!.title}`);

      // Update item status
      await supabase
        .from('karma_items')
        .update({ status: 'pending' })
        .eq('id', item!.id);

      // Create or get chat
      const { data: existingChat } = await supabase
        .from('karma_chats')
        .select('id')
        .eq('item_id', item!.id)
        .eq('buyer_id', user.id)
        .single();

      if (!existingChat) {
        await supabase.from('karma_chats').insert({
          item_id: item!.id,
          buyer_id: user.id,
          seller_id: item!.seller_id,
        });
      }

      toast.success('Trade request sent! Check your messages.');
      navigate('/karma-messages');
    } catch (error) {
      console.error('Error initiating trade:', error);
      toast.error('Failed to initiate trade');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenChat = async () => {
    if (!user) {
      toast.error('Please sign in to message');
      navigate('/auth');
      return;
    }

    // Create or get chat
    const { data: existingChat } = await supabase
      .from('karma_chats')
      .select('id')
      .eq('item_id', item!.id)
      .eq('buyer_id', user.id)
      .single();

    if (existingChat) {
      navigate(`/karma-chat/${existingChat.id}`);
    } else {
      const { data: newChat } = await supabase
        .from('karma_chats')
        .insert({
          item_id: item!.id,
          buyer_id: user.id,
          seller_id: item!.seller_id,
        })
        .select()
        .single();

      if (newChat) {
        navigate(`/karma-chat/${newChat.id}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">Item not found</div>
        <Footer />
      </div>
    );
  }

  const valuation = item.valuation_breakdown as any;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={item.images[currentImage] || '/placeholder.svg'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      currentImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">{item.title}</h1>
                <Badge variant="secondary">{item.condition.replace('_', ' ')}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium">{item.category}</span>
                {item.brand && <span>• {item.brand}</span>}
                {item.location && (
                  <span className="flex items-center gap-1">
                    • <MapPin className="h-3 w-3" /> {item.location}
                  </span>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Coins className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-4xl font-bold text-primary">{item.karma_value}</div>
                      <div className="text-sm text-muted-foreground">Karma Points</div>
                    </div>
                  </div>
                  {user && wallet && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Your Balance</div>
                      <div className="text-2xl font-semibold">{wallet.balance}</div>
                    </div>
                  )}
                </div>

                {valuation && (
                  <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
                    <div className="font-semibold mb-2">AI Valuation Breakdown:</div>
                    <div className="flex justify-between">
                      <span>Condition Score:</span>
                      <span>{valuation.condition_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand Score:</span>
                      <span>{valuation.brand_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category Baseline:</span>
                      <span>{valuation.category_baseline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Adjustment:</span>
                      <span>{valuation.demand_adjustment >= 0 ? '+' : ''}{valuation.demand_adjustment}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {item.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{item.description}</p>
              </div>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller?.avatar_url || '/placeholder.svg'}
                    alt={item.seller?.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.seller?.username}</div>
                    <div className="text-sm text-muted-foreground">Seller</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              {item.status === 'available' && item.seller_id !== user?.id && (
                <>
                  <Button
                    onClick={handleInitiateTradeRequest}
                    disabled={processing || !user || (wallet && wallet.balance < item.karma_value)}
                    className="flex-1"
                    size="lg"
                  >
                    {processing ? 'Processing...' : 'Request Trade'}
                  </Button>
                  <Button onClick={handleOpenChat} variant="outline" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </>
              )}
              {item.status === 'pending' && (
                <Button disabled className="flex-1" size="lg">
                  Trade Pending
                </Button>
              )}
              {item.status === 'sold' && (
                <Button disabled className="flex-1" size="lg">
                  Sold
                </Button>
              )}
              {item.seller_id === user?.id && (
                <Button variant="outline" className="flex-1" size="lg" disabled>
                  Your Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KarmaItemDetail;
