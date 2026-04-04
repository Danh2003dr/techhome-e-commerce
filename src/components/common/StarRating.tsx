type StarRatingProps =
  | { variant: 'home'; rating: number }
  | { variant: 'category'; rating: number };

function formatScore(rating: number): string {
  const n = Number(rating);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(1);
}

/** Đánh giá sao — thang 5 sao; kèm điểm số để dễ hiểu (ví dụ 4,5/5). */
export function StarRating(props: StarRatingProps) {
  const { rating } = props;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const scoreText = formatScore(rating);
  const ariaLabel = `Điểm đánh giá trung bình ${scoreText} trên 5 sao`;

  if (props.variant === 'home') {
    return (
      <div className="flex items-center gap-1.5" role="img" aria-label={ariaLabel}>
        <div className="flex text-amber-400" aria-hidden>
          {[...Array(5)].map((_, i) => {
            if (i < full) return <span key={i} className="material-icons text-sm">star</span>;
            if (i === full && half) return <span key={i} className="material-icons text-sm">star_half</span>;
            return <span key={i} className="material-icons text-sm">star_border</span>;
          })}
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums" aria-hidden>
          {scoreText}/5
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={ariaLabel}>
      <span className="flex" aria-hidden>
        {[...Array(5)].map((_, i) => {
          if (i < full) return <span key={i} className="material-icons text-yellow-400 text-sm">star</span>;
          if (i === full && half) return <span key={i} className="material-icons text-yellow-400 text-sm">star_half</span>;
          return <span key={i} className="material-icons text-slate-300 text-sm">star</span>;
        })}
      </span>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums" aria-hidden>
        {scoreText}/5
      </span>
    </div>
  );
}
