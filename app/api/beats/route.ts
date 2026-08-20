import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all beats, ordered
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('pageId');

  const beats = await db.beat.findMany({
    where: pageId ? { pageId } : undefined,
    orderBy: { order: 'asc' },
    include: { page: true },
  });

  return NextResponse.json({ beats });
}

// PATCH a single beat — status change, inline edit, or both
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, narration, title, uiActionTarget, uiActionType } = body;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data: Record<string, any> = {};
  if (status !== undefined) data.status = status;
  if (narration !== undefined) {
    data.narration = narration;
    data.editedByHuman = true;
  }
  if (title !== undefined) data.title = title;
  if (uiActionTarget !== undefined) data.uiActionTarget = uiActionTarget;
  if (uiActionType !== undefined) data.uiActionType = uiActionType;

  const updated = await db.beat.update({
    where: { id },
    data,
  });

  return NextResponse.json({ beat: updated });
}