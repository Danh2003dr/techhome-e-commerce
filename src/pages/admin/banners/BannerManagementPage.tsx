import React, { useEffect, useMemo, useState } from 'react';
import type { Banner } from '@/types';
import { getAdminBanners, saveAdminBanners, newEntityId } from '@/services/adminMockStore';

type BannerLayout = 'left' | 'center' | 'split';
type BannerAnimation = 'fade-in' | 'fade-slide' | 'fade-zoom';
type BannerListFilter = 'all' | 'active' | 'hidden' | 'scheduled';

type ManagedBanner = Banner & {
  description?: string;
  layout?: BannerLayout;
  animation?: BannerAnimation;
  visible?: boolean;
  startAt?: string | null;
  endAt?: string | null;
};

const inputCls =
  'mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';

function normalizeBanner(raw: Banner): ManagedBanner {
  const x = raw as ManagedBanner;
  return {
    ...raw,
    description: x.description ?? '',
    layout: x.layout ?? 'left',
    animation: x.animation ?? 'fade-in',
    visible: x.visible ?? true,
    startAt: x.startAt ?? null,
    endAt: x.endAt ?? null,
  };
}

function createDefaultBanner(): ManagedBanner {
  return {
    id: newEntityId('ban'),
    title: 'New Banner',
    subtitle: 'Campaign',
    description: 'Mota ngan cho banner nay.',
    image: 'https://picsum.photos/seed/banner/1200/420',
    link: '/',
    linkText: 'Shop now',
    theme: 'primary',
    layout: 'left',
    animation: 'fade-in',
    visible: true,
    startAt: null,
    endAt: null,
  };
}

function isBannerActiveNow(b: ManagedBanner): boolean {
  if (!b.visible) return false;
  const now = Date.now();
  const start = b.startAt ? new Date(b.startAt).getTime() : null;
  const end = b.endAt ? new Date(b.endAt).getTime() : null;
  if (start != null && now < start) return false;
  if (end != null && now > end) return false;
  return true;
}

function getBannerLifecycleStatus(b: ManagedBanner): 'active' | 'hidden' | 'scheduled' | 'expired' {
  if (!b.visible) return 'hidden';
  const now = Date.now();
  const start = b.startAt ? new Date(b.startAt).getTime() : null;
  const end = b.endAt ? new Date(b.endAt).getTime() : null;
  if (start != null && now < start) return 'scheduled';
  if (end != null && now > end) return 'expired';
  return 'active';
}

export default function BannerManagementPage() {
  const [rows, setRows] = useState<ManagedBanner[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ManagedBanner | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [managerOpen, setManagerOpen] = useState(false);
  const [managerRows, setManagerRows] = useState<ManagedBanner[]>([]);
  const [listSearch, setListSearch] = useState('');
  const [listFilter, setListFilter] = useState<BannerListFilter>('all');

  useEffect(() => {
    const list = getAdminBanners().map(normalizeBanner);
    setRows(list);
    if (list.length > 0) {
      setSelectedId(list[0].id);
      setDraft(list[0]);
    }
  }, []);

  const persist = (next: ManagedBanner[], nextSelectedId?: string | null) => {
    saveAdminBanners(next as Banner[]);
    setRows(next);
    const sid = nextSelectedId ?? selectedId;
    if (!sid) {
      setSelectedId(null);
      setDraft(null);
      setDirty(false);
      return;
    }
    const selected = next.find((x) => x.id === sid) ?? null;
    setSelectedId(selected?.id ?? null);
    setDraft(selected);
    setDirty(false);
  };

  const selected = useMemo(
    () => rows.find((x) => x.id === selectedId) ?? null,
    [rows, selectedId]
  );

  const filteredRows = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return rows.filter((b) => {
      const lifecycle = getBannerLifecycleStatus(b);
      const byFilter =
        listFilter === 'all' ||
        (listFilter === 'active' && lifecycle === 'active') ||
        (listFilter === 'hidden' && lifecycle === 'hidden') ||
        (listFilter === 'scheduled' && lifecycle === 'scheduled');
      if (!byFilter) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.link.toLowerCase().includes(q) ||
        (b.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [rows, listSearch, listFilter]);

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setDirty(false);
      return;
    }
    setDraft(selected);
    setDirty(false);
  }, [selected?.id]);

  const previewSlides = useMemo(() => {
    const active = rows.filter(isBannerActiveNow);
    if (active.length > 0) return active;
    return rows;
  }, [rows]);

  useEffect(() => {
    if (previewSlides.length === 0) {
      setPreviewIndex(0);
      return;
    }
    setPreviewIndex((i) => Math.min(i, previewSlides.length - 1));
  }, [previewSlides.length]);

  const addRow = () => {
    const next = [...rows, createDefaultBanner()];
    persist(next, next[next.length - 1].id);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const copy: ManagedBanner = {
      ...selected,
      id: newEntityId('ban'),
      title: `${selected.title} (copy)`,
    };
    const idx = rows.findIndex((x) => x.id === selected.id);
    if (idx < 0) return;
    const next = [...rows.slice(0, idx + 1), copy, ...rows.slice(idx + 1)];
    persist(next, copy.id);
  };

  const moveSelected = (dir: -1 | 1) => {
    if (!selected) return;
    const idx = rows.findIndex((x) => x.id === selected.id);
    const to = idx + dir;
    if (idx < 0 || to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(idx, 1);
    next.splice(to, 0, item);
    persist(next, selected.id);
  };

  const removeSelected = () => {
    if (!selected) return;
    const ok = window.confirm(`Xoa slide "${selected.title}"?`);
    if (!ok) return;
    const idx = rows.findIndex((x) => x.id === selected.id);
    const next = rows.filter((x) => x.id !== selected.id);
    if (next.length === 0) {
      persist(next, null);
      return;
    }
    const fallback = next[Math.min(idx, next.length - 1)];
    persist(next, fallback.id);
  };

  const saveDraft = () => {
    if (!draft || !selected) return;
    const normalized: ManagedBanner = {
      ...draft,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      description: (draft.description ?? '').trim(),
      image: draft.image.trim(),
      link: draft.link.trim(),
      linkText: draft.linkText.trim(),
    };
    if (!normalized.title || !normalized.image || !normalized.link || !normalized.linkText) {
      window.alert('Vui long nhap day du tieu de, anh, link va text nut.');
      return;
    }
    const next = rows.map((x) => (x.id === selected.id ? normalized : x));
    persist(next, selected.id);
  };

  const resetDraft = () => {
    if (!selected) return;
    setDraft(selected);
    setDirty(false);
  };

  const selectSlide = (id: string) => {
    if (dirty) {
      const ok = window.confirm('Ban co thay doi chua luu. Chuyen slide se mat thay doi, tiep tuc?');
      if (!ok) return;
    }
    setSelectedId(id);
  };

  const setDraftField = <K extends keyof ManagedBanner>(key: K, value: ManagedBanner[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  };

  const currentPreview = previewSlides[previewIndex] ?? null;
  const contentAnimClass = (() => {
    if (!currentPreview) return '';
    if (currentPreview.animation === 'fade-slide') return 'animate-banner-fade-slide';
    if (currentPreview.animation === 'fade-zoom') return 'animate-banner-fade-zoom';
    return 'animate-banner-fade-in';
  })();

  const openManager = () => {
    if (dirty) {
      const ok = window.confirm('Ban co thay doi chua luu. Mo slide manager se bo qua draft hien tai, tiep tuc?');
      if (!ok) return;
    }
    setManagerRows(rows);
    setManagerOpen(true);
  };

  const applyManager = () => {
    persist(managerRows, managerRows[0]?.id ?? null);
    setManagerOpen(false);
  };

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes bannerFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bannerFadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bannerFadeZoom { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .animate-banner-fade-in { animation: bannerFadeIn 320ms ease; }
        .animate-banner-fade-slide { animation: bannerFadeSlide 360ms ease; }
        .animate-banner-fade-zoom { animation: bannerFadeZoom 360ms ease; }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Banner trang chu</h1>
          <p className="text-xs text-slate-500">Contentbox Banner: layout, animation, schedule, visibility, slide manager.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={addRow} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold">
            + Them slide
          </button>
          <button type="button" onClick={duplicateSelected} disabled={!selected} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold disabled:opacity-40">
            Nhan ban
          </button>
          <button type="button" onClick={openManager} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold">
            Slide manager
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
          <p className="text-xs font-bold text-slate-500 px-1">Danh sach slide ({filteredRows.length}/{rows.length})</p>
          <input
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            placeholder="Tim slide..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-4 gap-1">
            {([
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'scheduled', label: 'Scheduled' },
              { id: 'hidden', label: 'Hidden' },
            ] as const).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setListFilter(f.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold border ${
                  listFilter === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {filteredRows.length === 0 && <p className="text-sm text-slate-500 px-1 py-2">Khong co slide phu hop.</p>}
          {filteredRows.map((b, idx) => {
            const active = b.id === selectedId;
            const lifecycle = getBannerLifecycleStatus(b);
            const status = lifecycle === 'active' ? 'Active' : lifecycle === 'hidden' ? 'Hidden' : lifecycle === 'scheduled' ? 'Scheduled' : 'Expired';
            return (
              <button key={b.id} type="button" onClick={() => selectSlide(b.id)} className={`w-full text-left rounded-xl border p-3 transition ${active ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-white dark:bg-slate-900'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-500 font-semibold">Slide {idx + 1}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : status === 'Scheduled'
                        ? 'bg-amber-100 text-amber-700'
                        : status === 'Hidden'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-rose-100 text-rose-700'
                  }`}>{status}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <img src={b.image} alt="" className="w-10 h-10 rounded-md object-cover border border-slate-200" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{b.title || '(No title)'}</p>
                    <p className="text-xs text-slate-500 truncate">{b.layout} · {b.animation}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-5">
          {!draft ? (
            <p className="text-sm text-slate-500">Chon mot slide de chinh sua.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500">Banner content</p>
                    {dirty && <span className="text-[11px] font-bold text-amber-600">Chua luu</span>}
                  </div>
                  <label className="block text-xs font-bold text-slate-600">Image URL *</label>
                  <input className={inputCls} value={draft.image} onChange={(e) => setDraftField('image', e.target.value)} />
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setDraftField('image', url);
                      }}
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-600">Title *</label>
                  <input className={inputCls} value={draft.title} onChange={(e) => setDraftField('title', e.target.value)} />
                  <label className="block text-xs font-bold text-slate-600">Description</label>
                  <textarea className={inputCls} rows={3} value={draft.description ?? ''} onChange={(e) => setDraftField('description', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600">Button text *</label>
                      <input className={inputCls} value={draft.linkText} onChange={(e) => setDraftField('linkText', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600">Button link *</label>
                      <input className={inputCls} value={draft.link} onChange={(e) => setDraftField('link', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500">Layout & animation</p>
                  <label className="block text-xs font-bold text-slate-600">Layout type</label>
                  <select className={inputCls} value={draft.layout ?? 'left'} onChange={(e) => setDraftField('layout', e.target.value as BannerLayout)}>
                    <option value="left">Left text</option>
                    <option value="center">Center text</option>
                    <option value="split">Split layout</option>
                  </select>
                  <label className="block text-xs font-bold text-slate-600">Fade animation</label>
                  <select className={inputCls} value={draft.animation ?? 'fade-in'} onChange={(e) => setDraftField('animation', e.target.value as BannerAnimation)}>
                    <option value="fade-in">fade-in</option>
                    <option value="fade-slide">fade-slide</option>
                    <option value="fade-zoom">fade-zoom</option>
                  </select>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 mt-2">
                    <input
                      type="checkbox"
                      checked={draft.visible ?? true}
                      onChange={(e) => setDraftField('visible', e.target.checked)}
                    />
                    Hien thi slide
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600">Start date</label>
                      <input
                        type="datetime-local"
                        className={inputCls}
                        value={draft.startAt ?? ''}
                        onChange={(e) => setDraftField('startAt', e.target.value || null)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600">End date</label>
                      <input
                        type="datetime-local"
                        className={inputCls}
                        value={draft.endAt ?? ''}
                        onChange={(e) => setDraftField('endAt', e.target.value || null)}
                      />
                    </div>
                  </div>
                  <label className="block text-xs font-bold text-slate-600">Theme</label>
                  <select className={inputCls} value={draft.theme} onChange={(e) => setDraftField('theme', e.target.value as Banner['theme'])}>
                    <option value="primary">primary</option>
                    <option value="indigo">indigo</option>
                    <option value="emerald">emerald</option>
                  </select>
                  <div className="flex flex-wrap gap-2 pt-3">
                    <button type="button" onClick={saveDraft} disabled={!dirty} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40">Luu</button>
                    <button
                      type="button"
                      onClick={() => {
                        saveDraft();
                        if (!selected) return;
                        const idx = rows.findIndex((x) => x.id === selected.id);
                        const next = rows[idx + 1];
                        if (next) setSelectedId(next.id);
                      }}
                      disabled={!dirty}
                      className="px-4 py-2 rounded-xl border border-primary/30 text-primary text-sm font-bold disabled:opacity-40"
                    >
                      Luu & tiep
                    </button>
                    <button type="button" onClick={resetDraft} disabled={!dirty} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold disabled:opacity-40">Hoan tac</button>
                    <button type="button" onClick={() => moveSelected(-1)} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold">Len</button>
                    <button type="button" onClick={() => moveSelected(1)} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold">Xuong</button>
                    <button type="button" onClick={removeSelected} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-bold">Xoa</button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Banner preview</p>
                  <p className="text-[11px] text-slate-500">{previewSlides.length} slide(s)</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 min-h-[280px]">
                  {currentPreview ? (
                    <>
                      <img src={currentPreview.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/35" />
                      <div className={`absolute inset-0 p-6 md:p-8 ${contentAnimClass}`}>
                        {(currentPreview.layout ?? 'left') === 'center' && (
                          <div className="h-full flex flex-col items-center justify-center text-center text-white max-w-xl mx-auto">
                            <p className="text-xs uppercase tracking-widest mb-2">{currentPreview.subtitle}</p>
                            <h3 className="text-3xl font-black">{currentPreview.title}</h3>
                            <p className="mt-2 text-sm text-slate-100">{currentPreview.description}</p>
                            <a href={currentPreview.link} className="mt-4 inline-flex px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm">{currentPreview.linkText}</a>
                          </div>
                        )}
                        {(currentPreview.layout ?? 'left') === 'left' && (
                          <div className="h-full flex items-center text-white">
                            <div className="max-w-md">
                              <p className="text-xs uppercase tracking-widest mb-2">{currentPreview.subtitle}</p>
                              <h3 className="text-3xl font-black">{currentPreview.title}</h3>
                              <p className="mt-2 text-sm text-slate-100">{currentPreview.description}</p>
                              <a href={currentPreview.link} className="mt-4 inline-flex px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm">{currentPreview.linkText}</a>
                            </div>
                          </div>
                        )}
                        {(currentPreview.layout ?? 'left') === 'split' && (
                          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="text-white">
                              <p className="text-xs uppercase tracking-widest mb-2">{currentPreview.subtitle}</p>
                              <h3 className="text-3xl font-black">{currentPreview.title}</h3>
                              <p className="mt-2 text-sm text-slate-100">{currentPreview.description}</p>
                              <a href={currentPreview.link} className="mt-4 inline-flex px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm">{currentPreview.linkText}</a>
                            </div>
                            <div className="hidden md:flex justify-end">
                              <div className="w-40 h-40 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm" />
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((i) => (i - 1 + previewSlides.length) % previewSlides.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white"
                      >
                        <span className="material-icons text-lg">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((i) => (i + 1) % previewSlides.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white"
                      >
                        <span className="material-icons text-lg">chevron_right</span>
                      </button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {previewSlides.map((_, i) => (
                          <button
                            key={`dot-${i}`}
                            type="button"
                            onClick={() => setPreviewIndex(i)}
                            className={`h-2 rounded-full transition-all ${i === previewIndex ? 'w-7 bg-white' : 'w-2 bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full min-h-[220px] flex items-center justify-center text-slate-500 bg-slate-50">
                      Chua co slide de preview.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {managerOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setManagerOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Slide manager</h3>
                <p className="text-xs text-slate-500">Cau hinh nhanh content, reorder, animation, visibility.</p>
              </div>
              <button type="button" onClick={() => setManagerOpen(false)} className="text-slate-500 hover:text-slate-800">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="max-h-[62vh] overflow-auto p-4 space-y-3">
              {managerRows.map((b, idx) => (
                <div key={b.id} className="grid grid-cols-1 lg:grid-cols-[70px_minmax(0,1fr)_150px_140px_90px] gap-2 items-center border border-slate-200 rounded-xl p-3">
                  <img src={b.image} alt="" className="w-full h-12 object-cover rounded-md border border-slate-200" />
                  <div className="space-y-1">
                    <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm" value={b.title} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x)))} />
                    <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" value={b.link} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, link: e.target.value } : x)))} />
                  </div>
                  <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm" value={b.layout ?? 'left'} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, layout: e.target.value as BannerLayout } : x)))}>
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="split">split</option>
                  </select>
                  <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm" value={b.animation ?? 'fade-in'} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, animation: e.target.value as BannerAnimation } : x)))}>
                    <option value="fade-in">fade-in</option>
                    <option value="fade-slide">fade-slide</option>
                    <option value="fade-zoom">fade-zoom</option>
                  </select>
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setManagerRows((prev) => {
                      const i = prev.findIndex((x) => x.id === b.id);
                      if (i <= 0) return prev;
                      const next = [...prev];
                      const [it] = next.splice(i, 1);
                      next.splice(i - 1, 0, it);
                      return next;
                    })} className="w-8 h-8 rounded-lg border border-slate-200">↑</button>
                    <button type="button" onClick={() => setManagerRows((prev) => {
                      const i = prev.findIndex((x) => x.id === b.id);
                      if (i < 0 || i >= prev.length - 1) return prev;
                      const next = [...prev];
                      const [it] = next.splice(i, 1);
                      next.splice(i + 1, 0, it);
                      return next;
                    })} className="w-8 h-8 rounded-lg border border-slate-200">↓</button>
                    <label className="inline-flex items-center gap-1 text-xs font-semibold ml-1">
                      <input type="checkbox" checked={b.visible ?? true} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, visible: e.target.checked } : x)))} />
                      Show
                    </label>
                    <button type="button" onClick={() => setManagerRows((prev) => prev.filter((x) => x.id !== b.id))} className="w-8 h-8 rounded-lg border border-red-200 text-red-600 ml-1">×</button>
                  </div>
                  <div className="lg:col-start-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="datetime-local" className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs" value={b.startAt ?? ''} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, startAt: e.target.value || null } : x)))} />
                    <input type="datetime-local" className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs" value={b.endAt ?? ''} onChange={(e) => setManagerRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, endAt: e.target.value || null } : x)))} />
                  </div>
                  <p className="text-[10px] text-slate-500">Slide #{idx + 1}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button type="button" onClick={() => setManagerRows((prev) => [...prev, createDefaultBanner()])} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold">
                + Add row
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setManagerOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold">Cancel</button>
                <button type="button" onClick={applyManager} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold">Apply changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
