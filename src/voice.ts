let esVoice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  esVoice =
    voices.find((v) => v.lang.startsWith('es') && v.localService) ??
    voices.find((v) => v.lang.startsWith('es')) ??
    null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export interface VoiceStyle {
  pitch?: number;
  rate?: number;
}

// Voz de Doña Búho: lenta y grave.
export const BUHO: VoiceStyle = { pitch: 0.8, rate: 0.82 };

export function speak(text: string, style: VoiceStyle = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    if (esVoice) u.voice = esVoice;
    u.lang = esVoice?.lang ?? 'es-ES';
    u.pitch = style.pitch ?? 1.05;
    u.rate = style.rate ?? 0.9;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
    };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
    // Red de seguridad: algunos Android no disparan onend.
    setTimeout(finish, Math.max(2500, text.length * 130));
  });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

const PRAISE = [
  '¡Muy bien!',
  '¡Eso es!',
  '¡Genial!',
  '¡Lo lograste!',
  '¡Qué lista eres!',
  '¡Bravo!',
  '¡Súper!',
  '¡Increíble!',
];

export function randomPraise(): string {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}
