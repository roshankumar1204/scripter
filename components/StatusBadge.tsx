const STATUS_TOKENS: Record<string, { bg: string; fg: string }> = {
  draft: { bg: '#eceeec', fg: '#5b6168' },
  reviewed: { bg: '#e5edf9', fg: '#2255a4' },
  approved: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
  rejected: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
};

const CONFIDENCE_TOKENS: Record<string, { bg: string; fg: string }> = {
  high: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
  medium: { bg: 'var(--warn-soft)', fg: 'var(--warn)' },
  low: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
};

export function StatusBadge({ status }: { status: string }) {
  const t = STATUS_TOKENS[status] || STATUS_TOKENS.draft;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ background: t.bg, color: t.fg }}
    >
      {status}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: string }) {
  const t = CONFIDENCE_TOKENS[confidence] || CONFIDENCE_TOKENS.medium;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: t.bg, color: t.fg }}
    >
      {confidence} confidence
    </span>
  );
}

export function confidenceStripeColor(confidence: string) {
  return (
    { high: 'var(--accent)', medium: 'var(--warn)', low: 'var(--danger)' }[confidence] ||
    'var(--ink-muted)'
  );
}