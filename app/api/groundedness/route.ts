import { NextRequest, NextResponse } from 'next/server';
import { checkGroundedness } from '@/lib/groundedness';
import { computeConfidence } from '@/lib/confidence';
import { db } from '@/lib/db';

// Standalone endpoint to re-run groundedness on an already-edited beat
export async function POST(req: NextRequest) {
  const { beatId } = await req.json();

  const beat = await db.beat.findUnique({ where: { id: beatId } });
  if (!beat) {
    return NextResponse.json({ error: 'beat not found' }, { status: 404 });
  }

  const result = await checkGroundedness(beat.sourceSnippet, beat.narration);
  const confidence = computeConfidence(result.unsupported_claim_count, beat.sourceWordCount);

  const updated = await db.beat.update({
    where: { id: beatId },
    data: {
      confidence,
      unsupportedClaims: JSON.stringify(result.unsupported_claims),
    },
  });

  return NextResponse.json({ beat: updated });
}