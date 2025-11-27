import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { KarmaItem } from '@/types/karma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KarmaMarket = () => {
  const [items, setItems] = useState<KarmaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [categoryFilter, conditionFilter]);

  const fetchItems = async () => {
    let query = supabase
      .from('karma_items')
      .select(`
        *,
        seller:profiles!karma_items_seller_id_fkey(username, avatar_url)
      `)
      .eq('status', 'available');

    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    if (conditionFilter !== 'all') {
      query = query.eq('condition', conditionFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data as any);
    }
    setLoading(false);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Karma Market</h1>
          <p className="text-muted-foreground">Trade items using Karma Points</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="phones">Phones</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like_new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => navigate('/list-karma-item')} className="ml-auto">
              List an Item
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No items found. Be the first to list something!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/karma-item/${item.id}`)}
              >
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={item.images[0] || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <Badge variant="secondary" className="shrink-0">
                      {item.condition.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <Coins className="h-5 w-5" />
                      {item.karma_value}
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <img
                      src={item.seller?.avatar_url || '/placeholder.svg'}
                      alt={item.seller?.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.seller?.username}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default KarmaMarket;
