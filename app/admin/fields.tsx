"use client";

// Small reusable form controls for the admin panel. Everything is
// controlled: value in, onChange out. No validation here — the content
// API validates the document shape on save.

import { useRef, useState } from 'react';
import styles from './admin.module.css';

export function Text({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <em className={styles.hint}>{hint}</em>}
    </label>
  );
}

export function LongText({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <em className={styles.hint}>{hint}</em>}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
      {hint && <em className={styles.hint}>{hint}</em>}
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// One entry per line — used for skills, marquee, scope lists.
export function Lines({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea
        rows={Math.max(4, value.length + 1)}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        onBlur={(e) =>
          onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
        }
      />
      <em className={styles.hint}>{hint ?? 'One entry per line.'}</em>
    </label>
  );
}

// Upload button + editable path field for images/videos.
export function MediaField({
  label,
  value,
  onChange,
  accept,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setBusy(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.path) {
      onChange(data.path);
    } else {
      setError(data.error ?? 'Upload failed.');
    }
    setBusy(false);
  }

  const isVideo = /\.(mp4|webm)$/i.test(value);
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <div className={styles.mediaRow}>
        <input
          type="text"
          value={value}
          placeholder="/uploads/… or external URL"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className={styles.smallBtn}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Uploading…' : 'Upload'}
        </button>
        {value && (
          <button type="button" className={styles.smallBtn} onClick={() => onChange('')}>
            Clear
          </button>
        )}
      </div>
      {value && !isVideo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.mediaPreview} src={value} alt="" />
      )}
      {value && isVideo && (
        <video className={styles.mediaPreview} src={value} muted loop autoPlay playsInline />
      )}
      {error && <em className={styles.errorText}>{error}</em>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// Generic list editor: renders each item via children callback and adds
// add / remove / move-up / move-down controls.
export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  title,
  renderItem,
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  title: string;
  renderItem: (item: T, update: (item: T) => void, index: number) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (open === i) setOpen(j);
    else if (open === j) setOpen(i);
  }

  return (
    <div className={styles.list}>
      {items.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHead}>
            <button
              type="button"
              className={styles.listItemToggle}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className={styles.listItemChevron}>{open === i ? '▾' : '▸'}</span>
              {itemLabel(item, i)}
            </button>
            <div className={styles.listItemActions}>
              <button type="button" className={styles.smallBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className={styles.smallBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button
                type="button"
                className={`${styles.smallBtn} ${styles.dangerBtn}`}
                onClick={() => {
                  if (confirm(`Remove “${itemLabel(item, i)}”?`)) {
                    onChange(items.filter((_, k) => k !== i));
                    setOpen(null);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
          {open === i && (
            <div className={styles.listItemBody}>
              {renderItem(item, (updated) => onChange(items.map((it, k) => (k === i ? updated : it))), i)}
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className={styles.smallBtn}
        onClick={() => {
          onChange([...items, makeNew()]);
          setOpen(items.length);
        }}
      >
        + Add {title}
      </button>
    </div>
  );
}
