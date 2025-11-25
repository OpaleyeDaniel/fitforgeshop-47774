import { Star, Calendar, Shield } from 'lucide-react';
import { Review } from '@/types/reviews';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', review.user_id)
        .single();
      
      if (data) setProfile(data);
    };
    
    fetchProfile();
  }, [review.user_id]);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shouldTruncate = review.review_text.length > 200;
  const displayText = shouldTruncate && !isExpanded 
    ? `${review.review_text.substring(0, 200)}...` 
    : review.review_text;

  return (
    <div className="bg-background border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {profile?.username || 'Loading...'}
                </span>
                {review.is_verified_purchase && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(review.created_at)}
              </div>
            </div>
          </div>
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <p className="text-foreground leading-relaxed">{displayText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {review.photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className="w-16 h-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
              >
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Review photo enlarged"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;