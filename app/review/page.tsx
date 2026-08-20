'use client';

import { useEffect, useState } from 'react';
import { BeatCard } from '@/components/BeatCard';
import { CheckCircle2, FileText, Clock, AlertTriangle } from 'lucide-react';

export default function ReviewPage() {
  const [beats, setBeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  async function loadBeats() {
    setLoading(true);
    const res = await fetch('/api/beats');
    const data = await res.json();
    setBeats(data.beats || []);
    setLoading(false);
  }

  useEffect(() => {
    loadBeats();
  }, []);

  const filtered = filter === 'all' ? beats : beats.filter((b) => b.status === filter);

  const stats = {
    total: beats.length,
    approved: beats.filter((b) => b.status === 'approved').length,
    draft: beats.filter((b) => b.status === 'draft').length,
    lowConfidence: beats.filter((b) => b.confidence === 'low').length,
  };

  const tabs = ['all', 'draft', 'reviewed', 'approved', 'rejected'];

  return (
    <div style={{ colorScheme: 'light' }} className="min-h-screen" >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--ink-muted)' }}>
            Demo Script Builder
          </p>
          <h1 className="font-display text-3xl font-semibold" style={{ color: 'var(--ink)' }}>
            Beat Review
          </h1>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <StatCard icon={<FileText size={16} />} label="Total beats" value={stats.total} />
          <StatCard icon={<CheckCircle2 size={16} />} label="Approved" value={stats.approved} tone="accent" />
          <StatCard icon={<Clock size={16} />} label="In draft" value={stats.draft} />
          <StatCard icon={<AlertTriangle size={16} />} label="Low confidence" value={stats.lowConfidence} tone="warn" />
        </div>

        {/* Segmented filter */}
        <div
          className="inline-flex p-1 rounded-lg mb-6 gap-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {tabs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3.5 py-1.5 text-sm rounded-md font-medium capitalize transition-colors"
              style={
                filter === s
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { color: 'var(--ink-muted)' }
              }
            >
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: 'var(--ink-muted)' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--ink-muted)' }}
          >
            No beats in this filter.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((beat) => (
              <BeatCard key={beat.id} beat={beat} onUpdate={loadBeats} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: 'accent' | 'warn';
}) {
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'warn' ? 'var(--warn)' : 'var(--ink)';
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--ink-muted)' }}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-mono text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}