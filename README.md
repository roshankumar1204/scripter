# Demo Script Builder

A pipeline that turns a customer's public documentation into a structured,
human-reviewed demo script — the kind of script a live sales-demo agent
(like Omnisavant's) would eventually perform for a real prospect.

Built for the Omnisavant take-home (Option 1).

---

## What it does, in one flow

Doc site URL → Scrape → Draft beats (AI) → Groundedness check (AI) →
Human review (approve/edit/reject) → Export script.json → Preview mode


Nothing reaches a "live" script without a human explicitly approving it.
That's the core design decision — see `Decisions.md` for the reasoning.

---

## Tools used, and why

### Firecrawl — scraping
**What it does:** crawls a doc site and returns clean, boilerplate-stripped
markdown per page, instead of raw HTML you'd have to parse yourself.
**Why this one:** speed of setup. A custom scraper (e.g. Crawl4AI, Playwright)
would give more control over edge cases, but for a timed build, "clean
markdown out of the box" removes an entire parsing step. Free tier was
enough for a handful of test pages.
**Where it's used:** `lib/firecrawl.ts`, called from `app/api/scrape/route.ts`.

### Gemini (Google Generative AI) — beat generation + groundedness checking
**What it does:** two separate calls per beat —
1. **Generation**: reads a scraped doc page, produces a structured "beat"
   (title, narration, suggested UI action, anticipated Q&A) as strict JSON.
2. **Groundedness check**: a second, cheaper call that re-reads the
   generated narration against the source and flags any claim not actually
   supported by the source text — this is what catches hallucination.
**Why Gemini:** [fill in your actual reason — cost / free tier / familiarity]
**Where it's used:** `lib/gemini.ts` (generation), `lib/groundedness.ts`
(fact-check), both called from `app/api/generate/route.ts`.

### Prisma + SQLite — storage
**What it does:** ORM + embedded database. No server to run, no infra to
configure — just a `.db` file on disk.
**Why this one:** a take-home doesn't need Postgres. SQLite gives real
querying (filter by status, order by sequence) without any setup overhead,
and Prisma gives type-safe access instead of hand-written SQL.
**Where it's used:** `prisma/schema.prisma` defines `Page` and `Beat`
models; `lib/db.ts` exports the client every API route uses.

### Next.js (App Router) — backend + frontend, one deployable unit
**What it does:** API routes (`app/api/*/route.ts`) and the UI
(`app/review`, `app/preview`) live in the same project and deploy together.
**Why this one:** no separate backend/frontend repos or CORS setup to
manage — one `npm run dev`, one deploy target.

### Tailwind CSS — styling
**What it does:** utility-first styling directly in JSX, no separate
stylesheet-per-component to maintain.
**Why this one:** fastest path to a UI that doesn't look like an unstyled
form, which matters for a review tool a human actually has to use
repeatedly.

### lucide-react — icons
**What it does:** small, consistent icon set (check, X, chevron, etc.)
used in the review and preview UIs.
**Why this one:** lightweight, tree-shakeable, no icon-font setup.

---

## How the confidence score works (the part worth explaining)

Every beat gets a confidence label — `high`, `medium`, or `low` — from two
independent signals, not a single self-reported number from the model:

1. **Groundedness** — the second Gemini call counts how many claims in the
   narration aren't traceable to the source text.
2. **Source thinness** — if the source doc page was short/sparse, confidence
   is capped automatically, regardless of what the groundedness check says.

low = 2+ unsupported claims OR source under 50 words
medium = exactly 1 unsupported claim
high = 0 unsupported claims AND enough source to ground it


Low-confidence beats are never hidden or auto-rejected — they still reach
the reviewer, with the specific flagged claims shown next to the source
comparison. The human is always the one who approves or rejects.

---

## Project structure

app/
├── api/
│ ├── scrape/route.ts # Firecrawl crawl → saves Page records
│ ├── generate/route.ts # Gemini generate + groundedness → saves Beat
│ ├── groundedness/route.ts# re-run fact-check on an edited beat
│ ├── beats/route.ts # GET/PATCH beats (review actions)
│ └── export/route.ts # serializes approved beats to script.json
├── review/page.tsx # human review UI
├── preview/page.tsx # "step through as if presenting" mode
└── page.tsx # input form (submit a doc URL)
lib/
├── firecrawl.ts / gemini.ts / groundedness.ts / confidence.ts / db.ts
components/
├── BeatCard.tsx / SourceCompare.tsx / FlaggedClaims.tsx / StatusBadge.tsx
prompts/
├── generate-beat.txt / groundedness-check.txt
prisma/
└── schema.prisma


---

## Running it locally

1. **Install dependencies**
```bash
   npm install
```

2. **Set environment variables** — create `.env`:

GEMINI_API_KEY=your_key_here
FIRECRAWL_API_KEY=your_key_here
DATABASE_URL="file:./dev.db"


3. **Set up the database**
```bash
   npx prisma migrate dev --name init
```

4. **Start the app**
```bash
   npm run dev
```

5. **Walk the flow**
   - Go to `http://localhost:3000` — enter a doc site URL, submit
   - You'll land on `/review` once scraping + generation finishes
   - Expand a beat, compare source vs. narration, edit if needed,
     approve/reject/mark reviewed
   - Once at least one beat is approved, visit `/preview` to see the
     step-through mode
   - Hit `/api/export` directly (or `curl` it) to get the raw `script.json`

---

## What's out of scope, and what stands in for it

- **No real LiveKit wiring, live voice, or browser automation.** The
  `/preview` route is a scoped, honest stand-in — it steps through
  approved beats (narration + intended action) in sequence, the way a
  live agent eventually would, without actually speaking or navigating
  a product.
- **UI action targets are best-guess selectors**, inferred from doc text
  rather than a live product's DOM. Flagged as such — not meant to be
  taken as verified selectors.

Full reasoning for every major decision is in `Decisions.md`.

---

## Deployment note

SQLite is a local file, which doesn't persist on serverless platforms like
Vercel between cold starts. For this build, that's an acceptable tradeoff —
either re-run scrape/generate after each deploy, or use the screen
recording as the primary proof of the full flow. See `Decisions.md` for
the reasoning on this tradeoff.