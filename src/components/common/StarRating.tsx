type StarRatingProps =
  | { variant: 'home'; rating: number }
  | { variant: 'category'; rating: number };

/** Đánh giá sao — biến thể Home / category. */
export function StarRating(props: StarRatingProps) {
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
