export function ensureExcerpt(input?: string, fallback?: string, opts?: { min?: number; max?: number }) {
  const MIN = opts?.min ?? 40;   // chars
  const MAX = opts?.max ?? 260;  // chars
  const clean = (input ?? fallback ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Quick take: details inside.';
  if (clean.length <= MAX && clean.length >= MIN) return clean;
  if (clean.length < MIN) return (clean + ' Read the full summary for context.').trim();
  return clean.slice(0, MAX).trim() + '…';
}

export function sentencesToBullets(text?: string, count = 3) {
  const s = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!s) return [];
  const parts = s.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, count);
}
