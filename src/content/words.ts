export interface Word {
  text: string;          // en minúsculas, para la voz
  syllables: string[];
  emoji: string;
  level: 1 | 2 | 3;
  gap?: {
    index: number;       // índice de la letra que falta
    options: string[];   // la correcta + distractores (mayúsculas)
  };
}

export const WORDS: Word[] = [
  { text: 'mamá', syllables: ['ma', 'má'], emoji: '👩', level: 1 },
  { text: 'papá', syllables: ['pa', 'pá'], emoji: '👨', level: 1 },
  { text: 'oso', syllables: ['o', 'so'], emoji: '🐻', level: 1, gap: { index: 1, options: ['S', 'L', 'M'] } },
  { text: 'uva', syllables: ['u', 'va'], emoji: '🍇', level: 1 },
  { text: 'sol', syllables: ['sol'], emoji: '☀️', level: 2 },
  { text: 'pan', syllables: ['pan'], emoji: '🍞', level: 2 },
  { text: 'gato', syllables: ['ga', 'to'], emoji: '🐱', level: 2, gap: { index: 2, options: ['T', 'P', 'S'] } },
  { text: 'pato', syllables: ['pa', 'to'], emoji: '🦆', level: 2, gap: { index: 2, options: ['T', 'L', 'N'] } },
  { text: 'casa', syllables: ['ca', 'sa'], emoji: '🏠', level: 2, gap: { index: 2, options: ['S', 'M', 'T'] } },
  { text: 'mesa', syllables: ['me', 'sa'], emoji: '🍽️', level: 2, gap: { index: 2, options: ['S', 'N', 'L'] } },
  { text: 'sopa', syllables: ['so', 'pa'], emoji: '🍲', level: 2, gap: { index: 2, options: ['P', 'T', 'M'] } },
  { text: 'luna', syllables: ['lu', 'na'], emoji: '🌙', level: 2, gap: { index: 2, options: ['N', 'M', 'S'] } },
  { text: 'mono', syllables: ['mo', 'no'], emoji: '🐵', level: 2, gap: { index: 2, options: ['N', 'L', 'P'] } },
  { text: 'sapo', syllables: ['sa', 'po'], emoji: '🐸', level: 2, gap: { index: 2, options: ['P', 'S', 'T'] } },
  { text: 'loro', syllables: ['lo', 'ro'], emoji: '🦜', level: 2 },
  { text: 'piña', syllables: ['pi', 'ña'], emoji: '🍍', level: 2 },
  { text: 'taza', syllables: ['ta', 'za'], emoji: '☕', level: 2 },
  { text: 'boca', syllables: ['bo', 'ca'], emoji: '👄', level: 2 },
  { text: 'mano', syllables: ['ma', 'no'], emoji: '✋', level: 2 },
  { text: 'nube', syllables: ['nu', 'be'], emoji: '☁️', level: 2 },
  { text: 'pelota', syllables: ['pe', 'lo', 'ta'], emoji: '⚽', level: 3, gap: { index: 2, options: ['L', 'N', 'T'] } },
  { text: 'tomate', syllables: ['to', 'ma', 'te'], emoji: '🍅', level: 3, gap: { index: 2, options: ['M', 'P', 'L'] } },
  { text: 'camisa', syllables: ['ca', 'mi', 'sa'], emoji: '👕', level: 3 },
  { text: 'zapato', syllables: ['za', 'pa', 'to'], emoji: '👟', level: 3, gap: { index: 2, options: ['P', 'T', 'M'] } },
  { text: 'estrella', syllables: ['es', 'tre', 'lla'], emoji: '⭐', level: 3 },
  { text: 'flor', syllables: ['flor'], emoji: '🌸', level: 3 },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickWords(n: number, filter?: (w: Word) => boolean): Word[] {
  return shuffle(filter ? WORDS.filter(filter) : WORDS).slice(0, n);
}
