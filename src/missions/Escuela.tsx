import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state';
import { speak, stopSpeaking, randomPraise, PROFE } from '../voice';
import { Confetti } from './shared';

interface Item {
  word: string;
  emoji: string;
  options: string[]; // la inicial correcta + distractores
}

const POOL: Item[] = [
  { word: 'gato', emoji: '🐱', options: ['G', 'P', 'M'] },
  { word: 'sol', emoji: '☀️', options: ['S', 'L', 'T'] },
  { word: 'luna', emoji: '🌙', options: ['L', 'N', 'S'] },
  { word: 'mano', emoji: '✋', options: ['M', 'N', 'P'] },
  { word: 'pato', emoji: '🦆', options: ['P', 'T', 'G'] },
  { word: 'uva', emoji: '🍇', options: ['U', 'A', 'O'] },
  { word: 'casa', emoji: '🏠', options: ['C', 'S', 'G'] },
  { word: 'nube', emoji: '☁️', options: ['N', 'M', 'B'] },
  { word: 'oso', emoji: '🐻', options: ['O', 'U', 'A'] },
  { word: 'flor', emoji: '🌸', options: ['F', 'L', 'P'] },
];

const TOTAL = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Misión de la escuela: escucha la palabra y elige su letra inicial. */
export default function Escuela() {
  const setScreen = useGame((s) => s.setScreen);
  const finishMission = useGame((s) => s.finishMission);
  const items = useRef(shuffle(POOL).slice(0, TOTAL));
  const [round, setRound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(true);
  const [wrongFx, setWrongFx] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const firstTries = useRef(0);

  const item = items.current[round];
  const options = useRef<string[]>([]);
  if (options.current.length === 0 || !options.current.includes(item.options[0])) {
    options.current = shuffle(item.options);
  }

  const sayInstruction = (it: Item) =>
    speak(`Escucha bien: ${it.word}. ¿Con qué letra empieza ${it.word}?`, PROFE);

  useEffect(() => {
    let alive = true;
    (async () => {
      await sayInstruction(item);
      if (alive) setLocked(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const next = () => {
    if (round + 1 >= TOTAL) {
      setDone(true);
      const ok = firstTries.current;
      const stars = ok >= 5 ? 3 : ok >= 3 ? 2 : 1;
      finishMission('escuela', stars, 5);
      speak(`¡Terminamos la clase! ${randomPraise()} Ganaste tus estrellas y monedas.`, PROFE);
      return;
    }
    options.current = [];
    setRound((r) => r + 1);
    setAttempts(0);
    setLocked(true);
  };

  const correct = item.options[0];

  const tap = async (letter: string) => {
    if (locked || done) return;
    if (letter === correct) {
      setLocked(true);
      if (attempts === 0) firstTries.current += 1;
      await speak(`${randomPraise()} ${item.word} empieza con ${letter}.`, PROFE);
      next();
    } else {
      const n = attempts + 1;
      setAttempts(n);
      setWrongFx(letter);
      setTimeout(() => setWrongFx(null), 450);
      if (n === 1) {
        speak(`Mmm, esa es la ${letter}. Escucha de nuevo: ${item.word}.`, PROFE);
      } else if (n === 2) {
        speak(`¡Mira la letra que baila! ${item.word} empieza con ${correct}.`, PROFE);
      } else {
        setLocked(true);
        await speak(`¡Es la ${correct}! ${item.word} empieza con ${correct}. ¡Ahora ya lo sabes!`, PROFE);
        next();
      }
    }
  };

  if (done) {
    const ok = firstTries.current;
    const stars = ok >= 5 ? 3 : ok >= 3 ? 2 : 1;
    return (
      <div className="mission school-bg">
        <Confetti />
        <div className="mission-end">
          <h2>¡MUY BIEN! 🎉</h2>
          <div className="stars-earned">{'⭐'.repeat(stars)}</div>
          <div className="coins-earned">+5 🪙</div>
          <button
            className="big-btn"
            onClick={() => {
              stopSpeaking();
              setScreen('world');
            }}
          >
            🏘️ VOLVER
          </button>
        </div>
      </div>
    );
  }

  const showHint = attempts >= 2;

  return (
    <div className="mission school-bg">
      <div className="mission-title">🏫 ¿Con qué letra empieza?</div>
      <div className="school-word">
        <span className="school-emoji">{item.emoji}</span>
      </div>
      <div className="letter-options">
        {options.current.map((l) => (
          <button
            key={l}
            className={[
              'letter-card',
              wrongFx === l ? 'wrong-shake' : '',
              showHint && l === correct ? 'hint' : '',
            ].join(' ')}
            onClick={() => tap(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="round-dots">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span key={i} style={{ opacity: i < round ? 1 : 0.3 }}>
            ⭐
          </span>
        ))}
      </div>
      <button className="speak-again" onClick={() => sayInstruction(item)}>
        🔊
      </button>
    </div>
  );
}
