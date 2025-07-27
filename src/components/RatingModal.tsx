import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  title: string;
  currentRating?: number;
}

export function RatingModal({ isOpen, onClose, onRate, title, currentRating }: RatingModalProps) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = () => {
    onRate(rating);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Rate "{title}"</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                className="transition-colors duration-200"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? 'text-accent fill-accent'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {(hoverRating || rating) > 0 ? (hoverRating || rating) : '?'}/10
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {(hoverRating || rating) === 0 && 'Select a rating'}
              {(hoverRating || rating) >= 1 && (hoverRating || rating) <= 3 && 'Poor'}
              {(hoverRating || rating) >= 4 && (hoverRating || rating) <= 6 && 'Average'}
              {(hoverRating || rating) >= 7 && (hoverRating || rating) <= 8 && 'Good'}
              {(hoverRating || rating) >= 9 && (hoverRating || rating) <= 10 && 'Excellent'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRate}
              disabled={rating === 0}
              className="flex-1 bg-gradient-to-r from-accent to-cinema-gold"
            >
              Rate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}