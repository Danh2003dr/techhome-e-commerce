import React, { useMemo, useState } from 'react';

type SpecRow = {
  id: string;
  key: string;
  value: string;
};

function makeId() {
  return Math.random().toString(16).slice(2);
}

export default function ProductSpecsManager() {
  const initialRows = useMemo<SpecRow[]>(
    () => [
      { id: makeId(), key: 'Weight', value: '250g' },
      { id: makeId(), key: 'Battery', value: '3000mAh' },
      { id: makeId(), key: 'Warranty', value: '12 months' },
    ],
    []
  );

  const [rows, setRows] = useState<SpecRow[]>(initialRows);

  return (
    <section className="admin-specs-card">
      <div className="admin-specs-header">
        <div className="admin-specs-title">Product Specs</div>
        <button
          type="button"
          className="admin-btn secondary"
          onClick={() =>
            setRows((prev) => [
              ...prev,
              {
                id: makeId(),
                key: '',
                value: '',
              },
            ])
          }
        >
          Add Spec
        </button>
      </div>

      <table className="admin-table admin-specs-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th style={{ width: 72 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <input
                  value={r.key}
                  placeholder="e.g. Battery Capacity"
                  onChange={(e) => {
                    const next = e.target.value;
                    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, key: next } : x)));
                  }}
                />
              </td>
              <td>
                <input
                  value={r.value}
                  placeholder="e.g. 3000mAh"
                  onChange={(e) => {
                    const next = e.target.value;
                    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, value: next } : x)));
                  }}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Remove spec"
                  onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

