# CANDOR.md Validator

A side-by-side A/B testing tool to empirically validate that the CANDOR.md instruction file reduces sycophancy and improves Claude's output directness.

## What is CANDOR.md?

CANDOR.md is a drop-in instruction file that enforces 4 rules:
1. **Steelman first** - Construct the strongest argument against before agreeing
2. **Cut the filler** - Open with the answer, never with flattery
3. **Surface assumptions** - Ask before assuming; clarify before proceeding
4. **Calibrated uncertainty** - Mark confidence explicitly; never fabricate

See `content/CANDOR.md` for the full specification.

## How the Validator Works

The validator makes two parallel API calls to Claude Sonnet 4.6:

- **Column 1 (Sin CANDOR.md)**: Empty system prompt + user question
- **Column 2 (Con CANDOR.md)**: CANDOR.md as system prompt + same user question

Results display side-by-side with:
- Full response text (preserving formatting)
- Violation detection (filler phrases and word count)
- Response time metrics

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000
```

## Usage

1. Enter a prompt or click a sample prompt
2. Click "Comparar" to run the A/B test
3. Compare both responses

The goal is to observe directness differences, not word count.

## Interpreting Results

### What you should see with CANDOR.md:
- ✅ Directness: Opens with the answer, not explanation
- ✅ Assumption clarity: Asks clarifying questions before proceeding
- ✅ No soft openings: "Great question" / "That's a thoughtful approach" are gone
- ✅ Confrontation when needed: "Stop", "No" vs. "Let me explain"

### What may be similar:
- Word count (both can be long or short depending on topic)
- Filler phrase counts (models already avoid obvious flattery)
- Structure in complex answers (both can be well-organized)

## Test Data

See `EVALUATION.md` for:
- 5 empirical test cases
- Side-by-side metric comparisons
- Interpretation guide
- Readiness assessment for GitHub publication

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **API**: @anthropic-ai/sdk 0.92.0
- **Package Manager**: pnpm

## Project Structure

```
candor-validator/
├── app/
│   ├── page.tsx              # Main validator UI
│   ├── layout.tsx            # Metadata
│   ├── globals.css           # Design system
│   ├── components/
│   │   └── ViolationPanel.tsx # Violation display
│   └── api/
│       └── compare/
│           └── route.ts      # A/B comparison endpoint
├── content/
│   └── CANDOR.md             # System prompt (user-provided)
├── lib/
│   ├── anthropic.ts          # Claude client + logic
│   └── violations.ts         # Filler phrase detection
├── .env.local                # API key (not committed)
└── EVALUATION.md             # Test results & analysis
```

## API Endpoint

### POST `/api/compare`

Request:
```json
{
  "prompt": "Is MongoDB good for payments?"
}
```

Response:
```json
{
  "baseline": "...",
  "candor": "...",
  "baselineViolations": [
    { "type": "filler", "phrase": "great question", "count": 1 },
    { "type": "wordcount", "phrase": "234 words", "count": 234 }
  ],
  "candorViolations": [...]
}
```

## Limitations

1. **Filler Detection**: Currently looks for exact phrase matches. May miss hedging language ("might", "could", "seems").
2. **Single Model**: Only tests Claude Sonnet 4.6. Would be valuable to test other models (GPT, Gemini, DeepSeek).
3. **No Persistence**: Results aren't saved; each test is ephemeral.
4. **No Metrics**: Response time, token usage not tracked per test.

## Future Improvements

- [ ] Expand filler phrase detection (semantic matching)
- [ ] Track token usage and cost per comparison
- [ ] Save test history (optional user login)
- [ ] Multi-model support (test GPT, Gemini, etc.)
- [ ] Export results as CSV/JSON
- [ ] Dark mode toggle
- [ ] Real-time streaming responses

## License

MIT. See LICENSE file.

---

**Last Updated**: May 2, 2026  
**Status**: Ready for public use
