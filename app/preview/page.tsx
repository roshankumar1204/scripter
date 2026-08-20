'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface ScriptBeat {
  beat_id: string;
  order: number;
  title: string;
  narration: string;
  ui_action: { type: string; target: string; fallback: string };
  anticipated_questions: { q: string; a: string }[];
}

export default function PreviewPage() {
  const [beats, setBeats] = useState<ScriptBeat[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch('/api/export');
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to load script.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBeats(data.beats);
      setLoading(false);
    }
    load();
  }, []);

  // Auto-advance every 6s while "playing"
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setCurrent((c) => (c + 1 < beats.length ? c + 1 : c));
      if (current + 1 >= beats.length) setPlaying(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [playing, current, beats.length]);

  if (loading) {
    return (
      <div style={{ colorScheme: 'light', background: 'var(--bg)' }} className="min-h-screen p-10">
        <p style={{ color: 'var(--ink-muted)' }}>Loading script…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ colorScheme: 'light', background: 'var(--bg)' }} className="min-h-screen p-10">
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <p className="text-sm mt-2" style={{ color: 'var(--ink-muted)' }}>
          Approve at least one beat in the review screen first.
        </p>
      </div>
    );
  }

  const beat = beats[current];

  return (
    <div style={{ colorScheme: 'light', background: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--ink-muted)' }}>
          Presenting as the demo agent · Beat {current + 1} of {beats.length}
        </p>

        {/* Progress rail */}
        <div className="flex gap-1 mb-8">
          {beats.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ background: i <= current ? 'var(--accent)' : 'var(--border)' }}
            />
          ))}
        </div>

        {/* Beat card */}
        <div className="rounded-lg p-8 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="font-display text-2xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>
            {beat.title}
          </h2>

          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
            Narration
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--ink)' }}>
            {beat.narration}
          </p>

          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
            Agent action
          </p>
          <p className="text-sm font-mono mb-6" style={{ color: 'var(--accent)' }}>
            {beat.ui_action.type} → {beat.ui_action.target}
          </p>

          {beat.anticipated_questions?.length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-muted)' }}>
                Ready for
              </p>
              {beat.anticipated_questions.map((qa, i) => (
                <div key={i} className="text-sm mb-2">
                  <p className="font-medium" style={{ color: 'var(--ink)' }}>{qa.q}</p>
                  <p style={{ color: 'var(--ink-muted)' }}>{qa.a}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-3 py-2 text-sm rounded-md font-medium flex items-center gap-1.5 disabled:opacity-40"
            style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-4 py-2 text-sm rounded-md font-medium flex items-center gap-1.5"
            style={{ background: 'var(--ink)', color: '#fff' }}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : 'Step through'}
          </button>

          <button
            onClick={() => setCurrent((c) => Math.min(beats.length - 1, c + 1))}
            disabled={current === beats.length - 1}
            className="px-3 py-2 text-sm rounded-md font-medium flex items-center gap-1.5 disabled:opacity-40"
            style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}