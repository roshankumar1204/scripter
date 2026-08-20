import { NextRequest, NextResponse } from 'next/server';
import { generateBeat } from '@/lib/gemini';
import { checkGroundedness } from '@/lib/groundedness';
import { computeConfidence, countWords } from '@/lib/confidence';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { pageId } = await req.json();

  if (!pageId) {
    return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
  }

  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page) {
    return NextResponse.json({ error: 'page not found' }, { status: 404 });
  }

  const generated = await generateBeat(page.rawMarkdown);

  const groundedness = await checkGroundedness(page.rawMarkdown, generated.narration);
  const sourceWordCount = countWords(page.rawMarkdown);
  const confidence = computeConfidence(
    groundedness.unsupported_claim_count,
    sourceWordCount
  );

  const beatCount = await db.beat.count({ where: { pageId } });

  const beat = await db.beat.create({
    data: {
      pageId,
      sourceSnippet: page.rawMarkdown.slice(0, 1000),
      title: generated.title,
      narration: generated.narration,
      uiActionType: generated.ui_action.type,
      uiActionTarget: generated.ui_action.target,
      uiActionFallback: generated.ui_action.fallback,
      anticipatedQuestions: JSON.stringify(generated.anticipated_questions),
      status: 'draft',
      confidence,
      unsupportedClaims: JSON.stringify(groundedness.unsupported_claims),
      sourceWordCount,
      order: beatCount,
    },
  });

  return NextResponse.json({ beat });
}