import React, { useCallback } from 'react';

type PreviewImage = {
  id: string;
  url: string;
};

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
};

export default function ProductImageUpload({ images, onChange }: Props) {
  const previews: PreviewImage[] = images.map((url, i) => ({
    id: `img-${i}-${url.slice(0, 24)}`,
    url,
  }));

  const move = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= images.length) return;
      const next = [...images];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      onChange(next);
    },
    [images, onChange]
  );

  const removeAt = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-600 min-h-[120px] flex flex-col items-center justify-center px-4 py-6"
        role="group"
        aria-label="Upload ảnh sản phẩm"
      >
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Kéo thả hoặc chọn ảnh</span>
        <span className="text-[11px] text-slate-500 mb-3">Ảnh đầu tiên dùng làm ảnh đại diện trên storefront.</span>
        <label className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors">
          <span className="material-icons text-[18px]">upload</span>
          Chọn file
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              const next = files.map((f) => ({
                url: URL.createObjectURL(f),
              }));
              onChange([...images, ...next.map((n) => n.url)]);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" aria-label="Thứ tự ảnh">
          {previews.map((p, idx) => (
            <li
              key={p.id}
              className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 group"
            >
              <div className="aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <img src={p.url} alt="" className="max-h-full max-w-full object-contain p-1" />
              </div>
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                {idx + 1}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="flex-1 text-[10px] font-bold text-white py-1 rounded bg-white/10 hover:bg-white/20"
                  onClick={() => move(idx, idx - 1)}
                  disabled={idx === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="flex-1 text-[10px] font-bold text-white py-1 rounded bg-white/10 hover:bg-white/20"
                  onClick={() => move(idx, idx + 1)}
                  disabled={idx === previews.length - 1}
                >
                  →
                </button>
                <button
                  type="button"
                  className="flex-1 text-[10px] font-bold text-red-200 py-1 rounded bg-red-500/80 hover:bg-red-600"
                  onClick={() => removeAt(idx)}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
