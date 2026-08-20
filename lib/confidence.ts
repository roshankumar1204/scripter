import { ConfidenceLevel } from '@/types/beat';

const MIN_WORD_COUNT = 50;

export function computeConfidence(
  unsupportedClaimCount: number,
  sourceWordCount: number
): ConfidenceLevel {
  if (unsupportedClaimCount >= 2 || sourceWordCount < MIN_WORD_COUNT) {
    return 'low';
  }
  if (unsupportedClaimCount === 1) {
    return 'medium';
  }
  return 'high';
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}