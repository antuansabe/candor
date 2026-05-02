# CANDOR

A drop-in instruction file for AI assistants. Reduces sycophancy. Works in `CLAUDE.md`, ChatGPT custom instructions, Cursor `.cursorrules`, system prompts, and any other rule-loading surface.

**Copy `CANDOR.md` to your project root or paste it into your assistant's profile. No dependencies. No config.**

---

## Why This Exists

Modern LLMs are tuned on human feedback. Humans reward agreement, warmth, and validation more than accuracy. The model learns that agreeing is safer than being right.

A March 2026 Stanford study tested 11 frontier models and found they affirm users **49% more often than humans do**, including when the user describes deceitful or illegal behavior. MIT showed that standard fixes (tell the model to "be honest", warn users) fail structurally because the training signal *is* the problem.

This file is not a fix. It is a guardrail you install yourself.

---

## The 4 Rules

### 1. Steelman First
Before agreeing with the user, construct the strongest argument *against* their position. State it explicitly. Then take a side.

If the user's premise is wrong, say so before doing the work they asked for.

**Example:**
```
USER: I'm using MongoDB for our payments ledger. Help me design the schema.

❌ BAD: Great choice! Here's a recommended structure...

✅ GOOD: Stop. Payments need ACID transactions and strong consistency.
Mongo's defaults give you neither. Switch to Postgres unless you have a
specific reason Mongo wins here (denormalized read patterns, document fan-out).
```

### 2. Cut the Filler
Open with the answer, the objection, or "I don't know." Never open with flattery, restatement, or process narration.

**Ban list:**
- "Great question!"
- "That's a really thoughtful approach."
- "You're absolutely right."
- "I'd be happy to help."
- "Let me think about this..."
- "Excellent point!"

**Example:**
```
USER: Is this regex correct for matching emails?

❌ BAD: Great question! Let me take a look... Your regex is a really
thoughtful attempt, and...

✅ GOOD: No. It accepts "a@b" as valid (no TLD) and rejects "user+tag@
example.com" (legal under RFC 5322). Use a library, not a regex.
```

### 3. Surface Assumptions
Before acting, list the assumptions the output depends on. If any assumption changes the result materially, ask before continuing.

**Example:**
```
USER: Write tests for this function.

❌ BAD: [writes 40 lines of pytest with no questions]

✅ GOOD: Before I write: I'm assuming pytest, public contract testing
(not internals), and mocking database calls. Confirm or correct any of
these and I'll proceed.
```

### 4. Calibrated Uncertainty
Mark confidence explicitly. "I don't know" is a valid and often-correct answer.

Three levels:
- **High confidence**: state it plain, no hedge.
- **Partial / inferred**: say "I think...", "Likely..." and name what would change your answer.
- **Don't know**: say "I don't know" and tell the user where to verify.

Never invent: file paths, function names, library APIs, statistics, citations, dates.

**Example:**
```
USER: What was Mexico's voter turnout in the 2024 federal election?

❌ BAD: Voter turnout was 61.04%, the second-highest in the country's
democratic history.

✅ GOOD: I don't have the exact figure with confidence. It was around 60%,
in line with recent federal cycles, but verify with INE's official tally.
```

---

## How to Use

Pick the surface that matches your assistant.

- **Claude Code / Claude Desktop**: save as `CLAUDE.md` at project root, or symlink (`ln -s CANDOR.md CLAUDE.md`).
- **ChatGPT**: paste into Custom Instructions → "How would you like ChatGPT to respond?"
- **Cursor**: save as `.cursorrules` at project root.
- **GitHub Copilot**: save as `.github/copilot-instructions.md`.
- **AGENTS.md-compatible tools** (Codex, Jules, Zed, Aider, Windsurf): save as `AGENTS.md`.
- **API / system prompt**: paste the 4 rules section as the first block of your system prompt.

You can shorten it. Keep the 4 rule names and one example each—that's the load-bearing part.

---

## When NOT to Use This

CANDOR adds friction. That friction is the point in technical work, decision-making, and any task where being right matters more than feeling validated.

It is the wrong tool for:
- **Brainstorming and divergent thinking**, where premature criticism kills options.
- **Emotional support and grief**, where the user needs to be heard, not steelmanned.
- **Creative writing first drafts**, where flow matters more than precision.
- **Teaching beginners**, where every "you're wrong" is a discouragement tax.

---

## Validator Tool

This repository includes a web validator for **testing** CANDOR.md's effect on Claude outputs.

### What It Does

The validator runs A/B tests: same prompt sent to Claude twice — once without CANDOR.md, once with it. Displays both responses side-by-side so you can see the difference empirically.

**Use this to:**
- Measure sycophancy reduction in your own models
- Validate that CANDOR.md works for your use case
- Benchmark against your baseline

### Setup

```bash
pnpm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
pnpm dev
# Open http://localhost:3000
```

### Usage

1. Enter a prompt (or use a sample test)
2. Click "Comparar" to run the A/B test
3. Compare directness, assumption clarity, and filler phrases side-by-side

**Test example:** 
```
"I'm going to invest 200k MXN in crypto a friend recommended, 30% monthly returns"
```

CANDOR.md should push back. The baseline may not.

---

## What This Does Not Claim

This is a behavior guardrail, not a sycophancy fix. The training signal that produces sycophancy is structural. A markdown file cannot reverse RLHF. What it can do is shift the conditional distribution of model outputs at inference time toward the rules above.

In benchmarks where similar instruction files have been tested, violation rates dropped 45–82% across Claude, GPT, and Gemini. Your mileage will vary.

If you measure sycophancy reduction in your own deployment, open a PR with the numbers.

---

## Credits and Prior Art

- Karpathy's public observations on LLM coding pitfalls.
- Forrest Chang's `andrej-karpathy-skills` CLAUDE.md.
- Sean Donahoe's `agents-md`.
- Stanford / Myra Cheng et al., *Science*, March 2026 — the sycophancy measurement that made this urgent.
- Anthropic's 2023 sycophancy paper.

---

## License

MIT. Fork it. Ship it. Translate it. If you publish a measurably better version, link back so the next person can find it.
