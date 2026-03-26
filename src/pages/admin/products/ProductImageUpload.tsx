import React, { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isApiConfigured, ApiError } from '@/services/api';
import { uploadImageFileToR2 } from '@/services/backend';
import type { AssetUploadScope } from '@/types/api';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

type PreviewImage = {
  id: string;
  url: string;
};

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
  /** Prefix object trên R2: products/ hoặc categories/ */
  assetScope?: AssetUploadScope;
};

export default function ProductImageUpload({ images, onChange, assetScope = 'product' }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canUseR2 =
    isApiConfigured() && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

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

  const handleFiles = async (files: File[]) => {
    setUploadError(null);
    if (files.length === 0) return;

    if (canUseR2) {
      setUploading(true);
      const added: string[] = [];
      try {
        for (const f of files) {
          if (!ALLOWED_TYPES.includes(f.type)) {
            setUploadError('Chỉ chấp nhận JPG, PNG hoặc GIF (khớp backend).');
            continue;
          }
          if (f.size > MAX_BYTES) {
            setUploadError('Mỗi ảnh tối đa 2MB.');
            continue;
          }
          try {
            const url = await uploadImageFileToR2(f, assetScope);
            added.push(url);
          } catch (e: unknown) {
            const msg =
              e instanceof ApiError && e.body?.message
                ? String(e.body.message)
                : e instanceof Error
                  ? e.message
                  : 'Upload thất bại.';
            setUploadError(msg);
          }
        }
        if (added.length > 0) {
          onChange([...images, ...added]);
        }
      } finally {
        setUploading(false);
      }
      return;
    }

    const blobUrls = files.map((f) => URL.createObjectURL(f));
    onChange([...images, ...blobUrls]);
  };

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-600 min-h-[120px] flex flex-col items-center justify-center px-4 py-6"
        role="group"
        aria-label="Upload ảnh sản phẩm"
      >
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Kéo thả hoặc chọn ảnh</span>
        <span className="text-[11px] text-slate-500 mb-3">
          Ảnh đầu tiên dùng làm ảnh đại diện trên storefront. JPG/PNG/GIF, tối đa 2MB.
          {canUseR2 ? ' Đang lưu lên R2.' : ' Chưa đăng nhập admin hoặc chưa cấu API — dùng ảnh tạm trên trình duyệt.'}
        </span>
        {uploadError && <p className="text-xs text-red-600 mb-2 text-center px-2">{uploadError}</p>}
        <label className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:pointer-events-none">
          <span className="material-icons text-[18px]">upload</span>
          {uploading ? 'Đang tải…' : 'Chọn file'}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              void handleFiles(files);
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
