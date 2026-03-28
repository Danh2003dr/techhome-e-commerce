import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getCategories } from '@/services/backend';
import type { CategoryDto } from '@/types/api';

const inputCls =
  'mt-1.5 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow';

const DEBOUNCE_MS = 280;
const LOCAL_PREVIEW_MAX = 24;

function buildLabelMap(pool: CategoryDto[]): Map<string, CategoryDto> {
  const m = new Map<string, CategoryDto>();
  for (const c of pool) {
    m.set(String(c.id), c);
  }
  return m;
}

function formatCategoryLabel(cat: CategoryDto, byId: Map<string, CategoryDto>): string {
  const pid = cat.parentId;
  if (pid == null || pid === '') return cat.name;
  const parent = byId.get(String(pid));
  if (parent) return `${parent.name} › ${cat.name}`;
  return `↳ ${cat.name}`;
}

export type CategorySearchComboboxProps = {
  /** Giữ trong props để form đồng bộ theo id + tên; hiển thị dùng `valueLabel`. */
  valueId?: string | number | null;
  valueLabel: string;
  /** Danh mục đã tải (dùng gợi ý khi chưa gõ; không gọi API list đầy đủ). */
  initialPool: CategoryDto[];
  onSelect: (cat: CategoryDto) => void;
  placeholder?: string;
  allowRoot?: boolean;
  onSelectRoot?: () => void;
  rootLabel?: string;
  className?: string;
  dropdownZClass?: string;
};

export default function CategorySearchCombobox({
  valueLabel,
  initialPool,
  onSelect,
  placeholder = 'Gõ để tìm theo tên…',
  allowRoot = false,
  onSelectRoot,
  rootLabel = '— Danh mục gốc (không có cha) —',
  className = '',
  dropdownZClass = 'z-[75]',
}: CategorySearchComboboxProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteResults, setRemoteResults] = useState<CategoryDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const localPreview = useMemo(() => {
    if (searchQuery.trim().length > 0) return null;
    return initialPool.slice(0, LOCAL_PREVIEW_MAX);
  }, [initialPool, searchQuery]);

  useEffect(() => {
    if (!open) return;
    const q = searchQuery.trim();
    if (q.length === 0) {
      setRemoteResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setRemoteResults(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      getCategories({ name: q })
        .then((rows) => setRemoteResults(rows))
        .catch(() => setRemoteResults([]))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const byId = useMemo(() => {
    const m = buildLabelMap(initialPool);
    if (remoteResults) {
      for (const c of remoteResults) {
        if (!m.has(String(c.id))) m.set(String(c.id), c);
      }
    }
    return m;
  }, [initialPool, remoteResults]);

  const searching = searchQuery.trim().length > 0;
  const displayRows = searching ? remoteResults ?? [] : localPreview ?? [];

  const inputDisplay = open ? searchQuery : valueLabel || '';

  const handleFocus = () => {
    setOpen(true);
    setSearchQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!open) setOpen(true);
  };

  const handlePick = (cat: CategoryDto) => {
    onSelect(cat);
    setOpen(false);
    setSearchQuery('');
  };

  const handlePickRoot = () => {
    onSelectRoot?.();
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        className={inputCls + ' mt-0'}
        value={inputDisplay}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
      />
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-lg ${dropdownZClass}`}
        >
          {allowRoot && onSelectRoot ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handlePickRoot}
              className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800"
            >
              {rootLabel}
            </button>
          ) : null}
          {searching && loading ? (
            <div className="px-3 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="material-icons text-base animate-pulse">hourglass_empty</span>
              Đang tìm…
            </div>
          ) : displayRows.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-500">
              {searchQuery.trim().length === 0
                ? initialPool.length === 0
                  ? 'Chưa có danh mục. Dùng nút « Danh mục mới » hoặc tải lại trang.'
                  : 'Gõ tên để lọc thêm trên server, hoặc chọn trong danh sách trên.'
                : 'Không tìm thấy danh mục phù hợp.'}
            </div>
          ) : (
            displayRows.map((cat) => (
              <button
                key={String(cat.id)}
                type="button"
                role="option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePick(cat)}
                className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-slate-100 hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                {formatCategoryLabel(cat, byId)}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
