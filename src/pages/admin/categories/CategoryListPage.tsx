import React, { useEffect, useState, useRef } from 'react';
import * as backend from '@/services/backend';
import type { CategoryDto } from '@/types/api';

/* ────────────────────────────────────────────────── */
/*  Inline-edit row                                   */
/* ────────────────────────────────────────────────── */
const EditableRow: React.FC<{
  cat: CategoryDto;
  onSaved: (updated: CategoryDto) => void;
  onDelete: (id: number) => void;
}> = ({ cat, onSaved, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(cat.name);
  const [description, setDescription] = useState(cat.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setName(cat.name);
    setDescription(cat.description ?? '');
    setError(null);
    setEditing(true);
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const cancel = () => { setEditing(false); setError(null); };

  const save = async () => {
    if (!name.trim()) { setError('Tên không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const updated = await backend.adminUpdateCategory(cat.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onSaved(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-4 py-3 text-slate-400 text-xs font-mono">{cat.id}</td>
        <td className="px-4 py-3">
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            className="w-full border border-primary rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </td>
        <td className="px-4 py-3">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            placeholder="Mô tả (tùy chọn)"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-60 transition-colors"
            >
              {saving
                ? <span className="material-icons text-[14px] animate-spin">refresh</span>
                : <span className="material-icons text-[14px]">check</span>}
              Lưu
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-4 py-3 text-slate-400 text-xs font-mono">{cat.id}</td>
      <td className="px-4 py-3">
        <span className="font-semibold text-slate-900">{cat.name}</span>
      </td>
      <td className="px-4 py-3 text-slate-500 text-sm">
        {cat.description || <span className="text-slate-300 italic">Chưa có mô tả</span>}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            aria-label="Chỉnh sửa"
          >
            <span className="material-icons text-[14px]">edit</span>
            Sửa
          </button>
          <button
            onClick={() => onDelete(cat.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
            aria-label="Xóa"
          >
            <span className="material-icons text-[14px]">delete</span>
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ────────────────────────────────────────────────── */
/*  Add form (inline at top of table)                 */
/* ────────────────────────────────────────────────── */
const AddCategoryForm: React.FC<{ onCreated: (cat: CategoryDto) => void }> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => { setOpen(true); setTimeout(() => nameRef.current?.focus(), 50); };
  const handleClose = () => { setOpen(false); setName(''); setDescription(''); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Tên không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const cat = await backend.adminCreateCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onCreated(cat);
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tạo thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors"
      >
        <span className="material-icons text-[18px]">add</span>
        Thêm danh mục
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-start sm:items-end gap-3 p-4 bg-blue-50 border border-primary/20 rounded-2xl"
    >
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Điện thoại"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons text-[12px]">error</span>{error}</p>}
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-bold text-slate-600 mb-1">Mô tả</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn (tùy chọn)"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 transition-colors"
        >
          {saving
            ? <span className="material-icons text-[16px] animate-spin">refresh</span>
            : <span className="material-icons text-[16px]">add</span>}
          Tạo
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

/* ────────────────────────────────────────────────── */
/*  Main page                                         */
/* ────────────────────────────────────────────────── */
const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CategoryDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await backend.adminGetCategories();
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreated = (cat: CategoryDto) => {
    setCategories((prev) => [cat, ...prev]);
  };

  const handleSaved = (updated: CategoryDto) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await backend.adminDeleteCategory(deleteConfirm.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-[#202224]">Danh mục</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {loading ? 'Đang tải…' : `${categories.length} danh mục`}
          </p>
        </div>
        <AddCategoryForm onCreated={handleCreated} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <span className="material-icons text-[20px]">error_outline</span>
          {error}
          <button onClick={fetchCategories} className="ml-auto text-red-600 underline font-semibold">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 w-16">ID</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Tên danh mục</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Mô tả</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-3 w-6 bg-slate-100 rounded" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                  <td className="px-4 py-4"><div className="h-3 w-48 bg-slate-100 rounded" /></td>
                  <td className="px-4 py-4"><div className="h-7 w-28 bg-slate-100 rounded-lg ml-auto" /></td>
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center text-slate-400">
                  <span className="material-icons text-4xl block mb-2">category</span>
                  <p className="font-semibold">Chưa có danh mục nào</p>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <EditableRow
                  key={cat.id}
                  cat={cat}
                  onSaved={handleSaved}
                  onDelete={(id) => setDeleteConfirm(categories.find((c) => c.id === id) ?? null)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons text-red-500 text-3xl">warning</span>
              <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa</h3>
            </div>
            <p className="text-slate-500 text-sm mb-1">
              Bạn sắp xóa danh mục:
            </p>
            <p className="font-bold text-slate-800 mb-2">"{deleteConfirm.name}"</p>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
              ⚠ Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-1"
              >
                {deleting && <span className="material-icons text-[16px] animate-spin">refresh</span>}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;
