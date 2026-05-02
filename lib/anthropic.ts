import { Anthropic } from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { countViolations, Violation } from './violations';

let candorPrompt: string | null = null;

function getCandorPrompt(): string {
  if (!candorPrompt) {
    const path = join(process.cwd(), 'content', 'CANDOR.md');
    candorPrompt = readFileSync(path, 'utf-8');
  }
  return candorPrompt;
}

export interface ComparisonResult {
  baseline: string;
  candor: string;
  baselineViolations: Violation[];
  candorViolations: Violation[];
}

export async function compareWithAndWithoutCandor(
  userPrompt: string
): Promise<ComparisonResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  const client = new Anthropic({ apiKey });
  const candor = getCandorPrompt();

  const [baselineResponse, candorResponse] = await Promise.all([
    client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: '',
      messages: [{ role: 'user', content: userPrompt }],
    }),
    client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: candor,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  ]);

  const baselineText =
    baselineResponse.content[0].type === 'text' ? baselineResponse.content[0].text : '';
  const candorText =
    candorResponse.content[0].type === 'text' ? candorResponse.content[0].text : '';

  return {
    baseline: baselineText,
    candor: candorText,
    baselineViolations: countViolations(baselineText),
    candorViolations: countViolations(candorText),
  };
}
