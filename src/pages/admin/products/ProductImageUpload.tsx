import React, { useMemo, useState } from 'react';

type PreviewImage = {
  id: string;
  url: string;
};

export default function ProductImageUpload() {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);

  const emptyState = useMemo(() => {
    if (previews.length > 0) return null;
    return (
      <>
        <div className="admin-upload-title">Upload Images</div>
        <div className="admin-upload-sub">Drop files here or click “Choose file”.</div>
      </>
    );
  }, [previews.length]);

  return (
    <section className="admin-upload-card">
      <div className="admin-upload-dropzone" role="group" aria-label="Product image upload">
        {emptyState}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            const next: PreviewImage[] = files.map((f) => ({
              id: `${f.name}-${f.size}-${f.lastModified}`,
              url: URL.createObjectURL(f),
            }));
            setPreviews((prev) => [...prev, ...next]);
          }}
        />
      </div>

      {previews.length > 0 && (
        <div className="admin-upload-preview-grid" aria-label="Image previews">
          {previews.map((p) => (
            <div key={p.id} className="admin-upload-preview">
              <img src={p.url} alt="Preview" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

