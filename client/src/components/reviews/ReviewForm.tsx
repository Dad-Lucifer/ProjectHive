import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../../api/reviews';
import { toast } from '../../hooks/useToast';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';

interface ReviewFormProps {
  projectId: string;
  revieweeId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ projectId, revieweeId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createReview(projectId, { revieweeId, rating, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'reviews'] });
      toast('success', 'Review submitted');
      onSuccess?.();
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (rating > 0) mutation.mutate(); }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer p-0.5"
          >
            <Star
              size={20}
              className={(hover || rating) >= star ? 'text-signal fill-signal' : 'text-line'}
            />
          </button>
        ))}
        <span className="text-xs text-slate ml-2">{rating > 0 ? `${rating}/5` : 'Select rating'}</span>
      </div>
      <Textarea
        id="review-comment"
        placeholder="Share your thoughts about this collaborator…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <Button type="submit" size="sm" disabled={rating === 0} loading={mutation.isPending}>
        Submit Review
      </Button>
    </form>
  );
}
