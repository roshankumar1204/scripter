'use client';

import { useState } from 'react';
import { ChevronDown, Check, X, Eye, Pencil } from 'lucide-react';
import { StatusBadge, ConfidenceBadge, confidenceStripeColor } from './StatusBadge';
import { SourceCompare } from './SourceCompare';
import { FlaggedClaims } from './FlaggedClaims';

interface Beat {
  id: string;
  title: string;
  narration: string;
  sourceSnippet: string;
  status: string;
  confidence: string;
  unsupportedClaims: string;
  uiActionType: string;
  uiActionTarget: string;
  anticipatedQuestions: string;
  editedByHuman: boolean;
}

export function BeatCard({ beat, onUpdate }: { beat: Beat; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [narration, setNarration] = useState(beat.narration);
  const [saving, setSaving] = useState(false);

  let questions: { q: string; a: string }[] = [];
  try {
    questions = JSON.parse(beat.anticipatedQuestions);
  } catch {}

  async function patchBeat(data: Record<string, any>) {
    setSaving(true);
    await fetch('/api/beats', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: beat.id, ...data }),
    });
    setSaving(false);
    onUpdate();
  }

  async function handleSaveEdit() {
    await patchBeat({ narration });
  }

  return (
    <div
      className="rounded-lg overflow-hidden flex"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Signature: confidence stripe */}
      <div style={{ width: '4px', background: confidenceStripeColor(beat.confidence), flexShrink: 0 }} />

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 min-w-0">
            <ChevronDown
              size={16}
              style={{
                color: 'var(--ink-muted)',
                transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.15s ease',
                flexShrink: 0,
              }}
            />
            <h3 className="font-display text-base font-semibold truncate" style={{ color: 'var(--ink)' }}>
              {beat.title}
            </h3>
            {beat.editedByHuman && (
              <span className="text-xs flex items-center gap-1 shrink-0" style={{ color: 'var(--ink-muted)' }}>
                <Pencil size={11} /> edited
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ConfidenceBadge confidence={beat.confidence} />
            <StatusBadge status={beat.status} />
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pl-6">
            <SourceCompare sourceSnippet={beat.sourceSnippet} narration={narration} />
            <FlaggedClaims claimsJson={beat.unsupportedClaims} />

            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--ink-muted)' }}>
                UI action
              </p>
              <p className="text-sm font-mono" style={{ color: 'var(--ink)' }}>
                {beat.uiActionType} → {beat.uiActionTarget}
              </p>
            </div>

            {questions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
                  Anticipated Q&A
                </p>
                {questions.map((qa, i) => (
                  <div key={i} className="text-sm mb-2">
                    <p className="font-medium" style={{ color: 'var(--ink)' }}>{qa.q}</p>
                    <p style={{ color: 'var(--ink-muted)' }}>{qa.a}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
                Edit narration
              </p>
              <textarea
                className="w-full rounded-md p-2.5 text-sm"
                style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: '#fff' }}
                rows={3}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="mt-2 px-3 py-1.5 text-sm rounded-md font-medium disabled:opacity-50"
                style={{ background: 'var(--ink)', color: '#fff' }}
              >
                Save edit
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <ActionButton
                onClick={() => patchBeat({ status: 'approved' })}
                disabled={saving}
                icon={<Check size={14} />}
                label="Approve"
                tone="accent"
              />
              <ActionButton
                onClick={() => patchBeat({ status: 'rejected' })}
                disabled={saving}
                icon={<X size={14} />}
                label="Reject"
                tone="danger"
              />
              <ActionButton
                onClick={() => patchBeat({ status: 'reviewed' })}
                disabled={saving}
                icon={<Eye size={14} />}
                label="Mark reviewed"
                tone="neutral"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  icon,
  label,
  tone,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  tone: 'accent' | 'danger' | 'neutral';
}) {
  const styles = {
    accent: { background: 'var(--accent)', color: '#fff' },
    danger: { background: 'var(--danger)', color: '#fff' },
    neutral: { background: '#fff', color: 'var(--ink)', border: '1px solid var(--border)' },
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-sm rounded-md font-medium disabled:opacity-50 flex items-center gap-1.5"
      style={styles}
    >
      {icon}
      {label}
    </button>
  );
}