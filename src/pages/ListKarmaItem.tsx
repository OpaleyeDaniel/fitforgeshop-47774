import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateKarmaValue } from '@/lib/karmaEngine';
import { toast } from 'sonner';
import { ValuationBreakdown } from '@/types/karma';

const ListKarmaItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    brand: '',
    location: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [valuation, setValuation] = useState<ValuationBreakdown | null>(null);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleCalculateValue = async () => {
    if (!formData.category || !formData.condition) {
      toast.error('Please select category and condition first');
      return;
    }

    setCalculating(true);
    try {
      const result = await calculateKarmaValue({
        condition: formData.condition as any,
        category: formData.category,
        brand: formData.brand,
        images: [], // TODO: Add image analysis
      });
      setValuation(result);
      toast.success('Karma value calculated!');
    } catch (error) {
      toast.error('Failed to calculate karma value');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valuation) {
      toast.error('Please calculate karma value first');
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create item
      const { error } = await supabase.from('karma_items').insert({
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        brand: formData.brand || null,
        location: formData.location || null,
        karma_value: valuation.total,
        valuation_breakdown: valuation as any,
        images: imageUrls,
        status: 'available',
      });

      if (error) throw error;

      toast.success('Item listed successfully!');
      navigate('/karma-market');
    } catch (error) {
      console.error('Error listing item:', error);
      toast.error('Failed to list item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">List an Item for Karma</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., iPhone 13 Pro 256GB"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your item..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Apple"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Photos</Label>
                <div className="mt-2">
                  <label
                    htmlFor="images"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    <span>{images.length > 0 ? `${images.length} images selected` : 'Upload photos'}</span>
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                AI Karma Valuation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                onClick={handleCalculateValue}
                disabled={calculating || !formData.category || !formData.condition}
                variant="outline"
                className="w-full"
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate Karma Value'
                )}
              </Button>

              {valuation && (
                <div className="p-4 rounded-lg bg-accent space-y-3">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{valuation.total}</div>
                    <div className="text-sm text-muted-foreground">Karma Points</div>
                  </div>
                  <div className="text-sm space-y-1 border-t pt-3">
                    <div className="flex justify-between">
                      <span>Condition Score:</span>
                      <span className="font-semibold">{valuation.condition_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand Score:</span>
                      <span className="font-semibold">{valuation.brand_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category Baseline:</span>
                      <span className="font-semibold">{valuation.category_baseline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Adjustment:</span>
                      <span className="font-semibold">{valuation.demand_adjustment >= 0 ? '+' : ''}{valuation.demand_adjustment}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground border-t pt-3 whitespace-pre-line">
                    {valuation.explanation}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading || !valuation} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Listing Item...
              </>
            ) : (
              'List Item'
            )}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ListKarmaItem;
