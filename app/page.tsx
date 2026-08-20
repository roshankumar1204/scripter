'use client';

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleScrape() {
    setLoading(true);
    setStatus('Scraping…');
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, limit }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(`Error: ${data.error}`);
      setLoading(false);
      return;
    }
    setStatus(`Scraped ${data.pages.length} pages. Generating beats…`);

    for (const page of data.pages) {
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: page.id }),
      });
    }

    setStatus(`Done. Generated beats for ${data.pages.length} pages.`);
    setLoading(false);
  }

  return (
    <div style={{ colorScheme: 'light', background: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--ink-muted)' }}>
          Demo Script Builder
        </p>
        <h1 className="font-display text-3xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>
          Start from a doc site
        </h1>

        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-muted)' }}>
          Documentation URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://docs.example.com"
          className="w-full mt-1.5 mb-4 rounded-md p-2.5 text-sm"
          style={{ border: '1px solid var(--border)', color: 'var(--ink)' }}
        />

        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-muted)' }}>
          Page limit
        </label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full mt-1.5 mb-6 rounded-md p-2.5 text-sm"
          style={{ border: '1px solid var(--border)', color: 'var(--ink)' }}
        />

        <button
          onClick={handleScrape}
          disabled={loading || !url}
          className="px-4 py-2.5 text-sm rounded-md font-medium disabled:opacity-50"
          style={{ background: 'var(--ink)', color: '#fff' }}
        >
          {loading ? 'Working…' : 'Scrape & generate beats'}
        </button>

        {status && (
          <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
            {status}
          </p>
        )}

        {!loading && status?.startsWith('Done') && (
          <a href="/review" className="block mt-3 text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Go to review →
          </a>
        )}
      </div>
    </div>
  );
}