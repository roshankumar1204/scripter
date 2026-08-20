import { NextRequest, NextResponse } from 'next/server';
import { crawlDocSite } from '@/lib/firecrawl';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { url, limit } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  const pages = await crawlDocSite(url, limit || 20);

  const savedPages = await Promise.all(
    pages.map((p) =>
      db.page.create({
        data: {
          sourceUrl: p.sourceUrl,
          rawMarkdown: p.markdown,
        },
      })
    )
  );

  return NextResponse.json({ pages: savedPages });
}