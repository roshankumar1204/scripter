import { AlertTriangle } from 'lucide-react';

export function FlaggedClaims({ claimsJson }: { claimsJson: string }) {
  let claims: string[] = [];
  try {
    claims = JSON.parse(claimsJson);
  } catch {
    claims = [];
  }

  if (claims.length === 0) return null;

  return (
    <div
      className="mt-3 p-3 rounded-md"
      style={{ background: 'var(--warn-soft)', border: '1px solid #f0ddc0' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <AlertTriangle size={14} style={{ color: 'var(--warn)' }} />
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--warn)' }}>
          Unsupported claims
        </p>
      </div>
      <ul className="text-sm space-y-1" style={{ color: '#7a4306' }}>
        {claims.map((c, i) => (
          <li key={i} className="flex gap-2">
            <span>—</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}