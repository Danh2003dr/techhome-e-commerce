type StarRatingProps =
  | { variant: 'home'; rating: number }
  | { variant: 'category'; rating: number }
  | { variant: 'wishlist'; rating: number; reviews: number };

/**
 * Đánh giá sao — ba biến thể giữ nguyên class/markup từng trang (Home, Mobile category, Wishlist).
 */
export function StarRating(props: StarRatingProps) {
  if (props.variant === 'wishlist') {
    const { rating, reviews } = props;
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    return (
      <div className="flex items-center gap-1 text-amber-400 mb-2">
        {Array.from({ length: full }, (_, i) => (
          <span key={`f-${i}`} className="material-icons text-sm">
            star
          </span>
        ))}
        {hasHalf && <span className="material-icons text-sm">star_half</span>}
        {Array.from({ length: empty }, (_, i) => (
          <span key={`e-${i}`} className="material-icons text-sm text-slate-200">
            star
          </span>
        ))}
        <span className="text-xs text-slate-400 font-bold ml-1">({reviews})</span>
      </div>
    );
  }

  const { rating } = props;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  if (props.variant === 'home') {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => {
          if (i < full) return <span key={i} className="material-icons text-sm">star</span>;
          if (i === full && half) return <span key={i} className="material-icons text-sm">star_half</span>;
          return <span key={i} className="material-icons text-sm">star_border</span>;
        })}
      </div>
    );
  }

  return (
    <>
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-yellow-400 text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-yellow-400 text-sm">star_half</span>;
        return <span key={i} className="material-icons text-slate-300 text-sm">star</span>;
      })}
    </>
  );
}
