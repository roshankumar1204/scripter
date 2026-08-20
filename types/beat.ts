export interface AnticipatedQuestion {
  q: string;
  a: string;
}

export interface UIAction {
  type: 'click' | 'navigate' | 'describe_only';
  target: string;
  fallback: string;
}

export interface GeneratedBeat {
  title: string;
  narration: string;
  ui_action: UIAction;
  anticipated_questions: AnticipatedQuestion[];
}

export interface GroundednessResult {
  unsupported_claims: string[];
  supported_claim_count: number;
  unsupported_claim_count: number;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';