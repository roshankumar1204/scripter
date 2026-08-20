# Decisions

## Why beats are gated behind human approval, not auto-published
A live demo agent talks to real prospects on a customer's own site. Nothing
generated from scraped docs should reach that surface without a human
confirming it's accurate and on-brand — this mirrors Omnisavant's own
"control layer" (guardrails, approved messaging, playbooks) described in
their public positioning. This tool is a working prototype of that layer,
not a replacement for it.

## Why low-confidence beats are flagged, not hidden or auto-rejected
Confidence is computed from two independent, cheap signals:
1. A second LLM call checks the generated narration against the source
   text and lists any claims not directly supported — this targets
   hallucination directly.
2. Source snippet length — thin doc pages get an automatic confidence
   cap, since there's less to ground a beat in regardless of what the
   model reports.

These combine into a 3-bucket categorical score (high/medium/low) rather
than a synthetic float, because the bucket is what actually drives
reviewer-facing behavior (a flag, not a formula). Low-confidence beats
still reach `draft` status and are visibly flagged with their specific
unsupported claims — the human stays the only gate that can approve or
reject, never an automated filter making that call first.

## Why Firecrawl over a custom crawler
Speed of setup within a timed build. Firecrawl returns clean,
boilerplate-stripped markdown per page out of the box, which removes a
separate parsing/cleanup step. A custom crawler (e.g. Crawl4AI) would give
more control over selectors and edge cases, but that control isn't the
bottleneck here — grounding and review quality are.

## Why Gemini over Claude for generation
[Fill in your actual reason — cost and familiarity, based on your
Aug 21 message]

## What's out of scope, and what stands in for it
- **Real LiveKit wiring, live voice, browser automation** — not built.
  The "preview mode" (`/preview`) is an honest, scoped stand-in: it steps
  through approved beats in order, showing narration + intended UI action,
  as the eventual live agent would perform them. No text-to-speech, no
  actual navigation.
- **UI action targets are best-guess selectors**, inferred from doc text,
  not verified against a live product UI. This is flagged here explicitly
  so a reviewer doesn't mistake them for confirmed selectors.

## What I'd add with more time
- **Source-change detection**: re-flag an approved beat as stale when its
  source doc page changes, since scripts drift from docs over time and a
  customer's demo script shouldn't silently go out of date.
- **Per-claim grounding highlights** in the source panel (not just a list
  of unsupported claims) — visually linking each sentence of narration to
  the specific line in source it came from.
- **Script versioning** in the export format, so a live agent consumer
  knows which script version is currently "live" vs. superseded.