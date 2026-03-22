import React from 'react';

type ColorDotsProps = {
  colors: string[];
};

const ColorDots: React.FC<ColorDotsProps> = ({ colors }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {colors.map((hex, i) => (
      <span
        key={`${hex}-${i}`}
        className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
        style={{ backgroundColor: hex }}
        title={hex}
      />
    ))}
  </div>
);

export default ColorDots;
