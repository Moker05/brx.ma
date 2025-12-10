// React default import not required with the automatic JSX runtime

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, count, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
        >
          <span className={`${star <= rating ? 'text-warning' : 'text-base-300'} ${size === 'sm' ? 'text-sm' : 'text-lg'}`}>
            ★
          </span>
        </button>
      ))}
      {count !== undefined && (
        <span className="text-sm text-base-content/60 ml-1">({count})</span>
      )}
    </div>
  );
}

export default StarRating;
