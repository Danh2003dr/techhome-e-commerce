import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as backend from '@/services/backend';
import { ApiError, formatApiErrorMessage, getToken, isApiConfigured } from '@/services/api';
import type { CategoryDto } from '@/types/api';

const inputCls =
  'mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';

function parentLabel(list: CategoryDto[], parentId: number | string | null | undefined): string {
  if (parentId == null || parentId === '') return '— (gốc)';
  const p = list.find((c) => String(c.id) === String(parentId));
  return p ? p.name : `#${parentId}`;
}

export default function AdminCategoriesPage() {
  const [list, setList] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [name, setName] = useState('');
  const [parentIdRaw, setParentIdRaw] = useState<string>('');

  const reload = useCallback(async () => {
    if (!isApiConfigured() || !getToken()) {
      setList([]);
      setLoading(false);
      setError('Cầu hình API và đăng nhập ADMIN.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await backend.getCategories({ includeDeleted: true });
      setList(rows);
    } catch (e) {
      setList([]);
      setError(
        e instanceof ApiError && e.status === 403
          ? 'Không có quyền hoặc phiên hết hạn.'
          : formatApiErrorMessage(e),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setParentIdRaw('');
    setFormError(null);
  };

  const startEdit = (c: CategoryDto) => {
    setEditingId(c.id);
    setName(c.name);
    setParentIdRaw(c.parentId != null && c.parentId !== '' ? String(c.parentId) : '');
    setFormError(null);
  };

  const parentOptions = useMemo(() => {
    return list.filter((c) => !c.isDeleted && String(c.id) !== String(editingId ?? ''));
  }, [list, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!getToken()) {
      setFormError('Vui lòng đăng nhập ADMIN.');
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError('Nhập tên danh mục.');
      return;
    }
    const parentId =
      parentIdRaw === '' || parentIdRaw === '__root' ? null : Number(parentIdRaw);
    if (parentIdRaw !== '' && parentIdRaw !== '__root' && !Number.isFinite(parentId)) {
      setFormError('Danh mục cha không hợp lệ.');
      return;
    }
    if (editingId != null && parentId != null && Number(parentId) === Number(editingId)) {
      setFormError('Không chọn chính danh mục đang sửa làm cha.');
      return;
    }

    const payload = { name: trimmed, parentId };

    setSubmitting(true);
    try {
      if (editingId != null) {
        await backend.updateAdminCategory(editingId, payload);
      } else {
        await backend.createAdminCategory(payload);
      }
      resetForm();
      await reload();
    } catch (err) {
      setFormError(formatApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: CategoryDto) => {
    if (c.isDeleted) return;
    if (!getToken()) return;
    const ok = window.confirm(`Ẩn danh mục “${c.name}” khỏi cửa hàng? (Xóa mềm.)`);
    if (!ok) return;
    setError(null);
    try {
      await backend.deleteAdminCategory(c.id);
      await reload();
    } catch (err) {
      setError(formatApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-normal tracking-tight text-[#202224] dark:text-white">Danh mục</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Thêm, sửa, ẩn danh mục (ADMIN)</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"
      >
        <h2 className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          {editingId != null ? `Sửa danh mục #${editingId}` : 'Thêm danh mục mới'}
        </h2>
        {formError && (
          <p className="md:col-span-2 text-sm text-red-600 dark:text-red-400 whitespace-pre-line" role="alert">
            {formError}
          </p>
        )}
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 md:col-span-2">
          Tên *
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Điện thoại" />
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 md:col-span-2">
          Thuộc danh mục cha
          <select
            className={inputCls}
            value={parentIdRaw === '' ? '__root' : parentIdRaw}
            onChange={(e) => setParentIdRaw(e.target.value === '__root' ? '' : e.target.value)}
          >
            <option value="__root">— Danh mục gốc —</option>
            {parentOptions.map((c) => (
              <option key={String(c.id)} value={String(c.id)}>
                {c.name} (id {c.id})
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-60"
          >
            {submitting ? 'Đang lưu…' : editingId != null ? 'Cập nhật' : 'Tạo danh mục'}
          </button>
          {editingId != null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-left text-xs font-bold text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Cha</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>
                  Đang tải…
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>
                  Chưa có danh mục hoặc chưa tải được.
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={String(c.id)} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.slug}</td>
                  <td className="px-4 py-3 text-xs">{parentLabel(list, c.parentId)}</td>
                  <td className="px-4 py-3 text-xs">
                    {c.isDeleted ? (
                      <span className="text-red-600 font-semibold">Đã ẩn</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Hiển thị</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {!c.isDeleted && (
                        <>
                          <button
                            type="button"
                            className="text-primary font-semibold text-xs"
                            onClick={() => startEdit(c)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="text-red-600 font-semibold text-xs"
                            onClick={() => void handleDelete(c)}
                          >
                            Ẩn
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
