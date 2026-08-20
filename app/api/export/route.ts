import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('pageId'); // optional: scope export to one doc site's pages

  const approvedBeats = await db.beat.findMany({
    where: {
      status: 'approved',
      ...(pageId ? { page: { id: pageId } } : {}),
    },
    orderBy: { order: 'asc' },
    include: { page: true },
  });

  if (approvedBeats.length === 0) {
    return NextResponse.json(
      { error: 'No approved beats to export yet.' },
      { status: 400 }
    );
  }

  const script = {
    version: 1,
    generated_at: new Date().toISOString(),
    beat_count: approvedBeats.length,
    beats: approvedBeats.map((b, i) => ({
      beat_id: b.id,
      order: i,
      title: b.title,
      narration: b.narration,
      ui_action: {
        type: b.uiActionType,
        target: b.uiActionTarget,
        fallback: b.uiActionFallback,
      },
      anticipated_questions: JSON.parse(b.anticipatedQuestions),
      source_url: b.page.sourceUrl,
      edited_by_human: b.editedByHuman,
    })),
  };

  return NextResponse.json(script);
}