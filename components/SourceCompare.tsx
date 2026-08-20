export function SourceCompare({
  sourceSnippet,
  narration,
}: {
  sourceSnippet: string;
  narration: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
          Source
        </p>
        <div
          className="text-sm rounded-md p-3 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono"
          style={{ background: '#fafaf9', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: '13px' }}
        >
          {sourceSnippet}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
          Generated narration
        </p>
        <div
          className="text-sm rounded-md p-3 max-h-64 overflow-y-auto whitespace-pre-wrap"
          style={{ background: '#f5f8f7', border: '1px solid #d9e6e1', color: 'var(--ink)' }}
        >
          {narration}
        </div>
      </div>
    </div>
  );
}