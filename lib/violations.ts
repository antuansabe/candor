export interface Violation {
  type: 'filler' | 'wordcount';
  phrase: string;
  count: number;
}

const FILLER_PHRASES = [
  'great question',
  'great point',
  'excellent question',
  'excellent point',
  "you're absolutely right",
  "you're right",
  "that's a great",
  "that's a really",
  "i'd be happy to",
  "i'd love to",
  'let me think about',
  'what a thoughtful',
  'interesting approach',
  'fascinating',
  'absolutely',
  'certainly',
  'excelente pregunta',
  'gran pregunta',
  'muy buena pregunta',
  'qué interesante',
  'qué buena pregunta',
  'me encanta',
  'tienes toda la razón',
  'estás en lo correcto',
  'tienes razón',
  'absolutamente',
  'por supuesto',
  'claro que sí',
  'con gusto',
  'déjame ayudarte',
  'permíteme',
  'sin duda',
  'desde luego',
  'qué gran punto',
  'es un placer',
  'encantado de ayudarte',
];

export function countViolations(text: string): Violation[] {
  const lowerText = text.toLowerCase();
  const violations: Violation[] = [];

  for (const phrase of FILLER_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      violations.push({
        type: 'filler',
        phrase,
        count: matches.length,
      });
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  violations.push({
    type: 'wordcount',
    phrase: `${wordCount} words`,
    count: wordCount,
  });

  return violations;
}
