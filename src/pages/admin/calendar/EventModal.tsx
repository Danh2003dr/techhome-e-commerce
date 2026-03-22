import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { EVENT_TYPE_LABEL } from './calendarConstants';
import { MOCK_PRODUCT_OPTIONS } from './calendarMockData';
import type { EventType, PromotionEvent } from './calendarTypes';
import { compareISODate, toISODate } from './calendarUtils';

type EventModalProps = {
  open: boolean;
  initial: PromotionEvent | null;
  onClose: () => void;
  onSave: (ev: PromotionEvent) => void;
  onDelete?: (id: string) => void;
};

const emptyDraft = (): PromotionEvent => ({
  id: '',
  name: '',
  type: 'discount',
  startDate: toISODate(new Date()),
  endDate: toISODate(new Date()),
  timeLabel: '09:00 AM',
  description: '',
  location: '',
  participantCount: 0,
  coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=120&h=120&fit=crop&auto=format',
});

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const EventModal: React.FC<EventModalProps> = ({ open, initial, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<PromotionEvent>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    if (initial) setForm({ ...initial });
    else setForm(emptyDraft());
    setErrors({});
  }, [open, initial]);

  if (!open) return null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.endDate) e.endDate = 'Required';
    if (form.startDate && form.endDate && compareISODate(form.endDate, form.startDate) < 0) {
      e.endDate = 'End date must be on or after start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload: PromotionEvent = {
      ...form,
      id: form.id || newId(),
      name: form.name.trim(),
      participantCount: Number.isFinite(form.participantCount) ? Math.max(0, form.participantCount) : 0,
    };
    onSave(payload);
    onClose();
  };

  const handleDelete = () => {
    if (!initial?.id || !onDelete) return;
    if (window.confirm('Delete this event?')) {
      onDelete(initial.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">{initial ? 'Edit event' : 'New event'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <span className="material-icons text-[22px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Input
            label="Event Name"
            value={form.name}
            onChange={(ev) => setForm((f) => ({ ...f, name: ev.target.value }))}
            error={errors.name}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Event Type</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium"
              value={form.type}
              onChange={(ev) => setForm((f) => ({ ...f, type: ev.target.value as EventType }))}
            >
              {(Object.keys(EVENT_TYPE_LABEL) as EventType[]).map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(ev) => setForm((f) => ({ ...f, startDate: ev.target.value }))}
              error={errors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(ev) => setForm((f) => ({ ...f, endDate: ev.target.value }))}
              error={errors.endDate}
            />
          </div>

          <Input
            label="Time"
            placeholder="e.g. Today 07:19 AM"
            value={form.timeLabel}
            onChange={(ev) => setForm((f) => ({ ...f, timeLabel: ev.target.value }))}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full min-h-[88px] px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              value={form.description}
              onChange={(ev) => setForm((f) => ({ ...f, description: ev.target.value }))}
            />
          </div>

          <Input
            label="Location"
            value={form.location}
            onChange={(ev) => setForm((f) => ({ ...f, location: ev.target.value }))}
          />

          <Input
            label="Participants (optional)"
            type="number"
            min={0}
            value={form.participantCount || ''}
            onChange={(ev) =>
              setForm((f) => ({ ...f, participantCount: ev.target.value === '' ? 0 : Number(ev.target.value) }))
            }
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Product (optional)</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              value={form.productId ?? ''}
              onChange={(ev) =>
                setForm((f) => ({ ...f, productId: ev.target.value === '' ? undefined : ev.target.value }))
              }
            >
              <option value="">— None —</option>
              {MOCK_PRODUCT_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-4">
          <div>
            {initial && onDelete && (
              <Button type="button" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
