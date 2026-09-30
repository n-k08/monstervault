interface Props {
  rating: number | null;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function StarRating({ rating, onChange, size = 'md', readonly = false }: Props) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
          style={{ color: star <= (rating ?? 0) ? '#39FF14' : '#374151' }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
