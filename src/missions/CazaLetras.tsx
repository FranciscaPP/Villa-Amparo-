import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state';
import { speak, stopSpeaking, randomPraise, BUHO } from '../voice';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const BALLOON_COLORS = ['#ef476f', '#118ab2', '#06d6a0', '#ffd166', '#9b5de5'];
const TOTAL_ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type BalloonFx = 'none' | 'popped' | 'wrong-shake';

export default function CazaLetras() {
  const setScreen = useGame((s) => s.setScreen);
  const addRewards = useGame((s) => s.addRewards);

  // Los 5 objetivos son las 5 vocales en orden aleatorio.
  const targets = useRef<string[]>(shuffle(VOWELS));
  const [round, setRound] = useState(0);
  const [balloons, setBalloons] = useState<string[]>(() => shuffle(VOWELS));
  const [fx, setFx] = useState<Record<string, BalloonFx>>({});
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(true);
  const [done, setDone] = useState(false);
  const firstTries = useRef(0);
  const target = targets.current[round];

  const sayInstruction = (t: string) =>
    speak(`¡Atrapa el globo con la letra ${t}!`, BUHO);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (round === 0) {
        await speak('¡Las vocales se escaparon en globos!', BUHO);
      }
      if (!alive) return;
      await sayInstruction(target);
      if (alive) setLocked(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const nextRound = async () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      finish();
      return;
    }
    setRound((r) => r + 1);
    setBalloons(shuffle(VOWELS));
    setFx({});
    setAttempts(0);
    setLocked(true);
  };

  const finish = () => {
    const ok = firstTries.current;
    const stars = ok >= 5 ? 3 : ok >= 3 ? 2 : 1;
    addRewards(stars, 5);
    setDone(true);
    speak(
      `¡Lo hiciste increíble! Ganaste ${stars === 1 ? 'una estrella' : `${stars} estrellas`} y cinco monedas. ¡Gracias por atrapar mis vocales!`,
      BUHO
    );
  };

  const tap = async (letter: string) => {
    if (locked || done) return;

    if (letter === target) {
      setLocked(true);
      if (attempts === 0) firstTries.current += 1;
      setFx((f) => ({ ...f, [letter]: 'popped' }));
      await speak(`${randomPraise()} ¡Atrapaste la ${target}!`);
      nextRound();
      return;
    }

    // Se equivocó: pistas escalonadas, nunca "game over".
    const n = attempts + 1;
    setAttempts(n);
    setFx((f) => ({ ...f, [letter]: 'wrong-shake' }));
    setTimeout(() => setFx((f) => ({ ...f, [letter]: 'none' })), 450);
    if (n === 1) {
      speak(`Mmm, esa es la ${letter}. Busca la ${target}.`, BUHO);
    } else if (n === 2) {
      speak(`¡Mira el globo que baila! Esa es la ${target}.`, BUHO);
    } else {
      // Tercera vez: se la mostramos y celebramos igual.
      setLocked(true);
      setFx((f) => ({ ...f, [target]: 'popped' }));
      await speak(`¡Esta es la ${target}! ¡Ahora ya la conoces!`, BUHO);
      nextRound();
    }
  };

  const showHint = attempts >= 2;

  if (done) {
    const ok = firstTries.current;
    const stars = ok >= 5 ? 3 : ok >= 3 ? 2 : 1;
    return (
      <div className="mission">
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
            🏡 VOLVER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mission">
      <div className="mission-title">
        🦉 Atrapa la letra <span className="target-letter">{target}</span>
      </div>
      <div className="balloons">
        {balloons.map((letter, i) => {
          const state = fx[letter] ?? 'none';
          return (
            <div
              key={letter}
              className={[
                'balloon',
                state === 'popped' ? 'popped' : '',
                state === 'wrong-shake' ? 'wrong-shake' : '',
                showHint && letter === target ? 'hint' : '',
              ].join(' ')}
              style={{
                background: BALLOON_COLORS[i % BALLOON_COLORS.length],
                animationDelay: state === 'none' ? `${i * 0.35}s` : undefined,
              }}
              onPointerDown={() => tap(letter)}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <div className="round-dots">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <span key={i} style={{ opacity: i < round ? 1 : 0.3 }}>
            ⭐
          </span>
        ))}
      </div>
      <button className="speak-again" onClick={() => sayInstruction(target)}>
        🔊
      </button>
    </div>
  );
}

const CONFETTI_EMOJI = ['🎉', '⭐', '🎈', '✨', '🌟'];

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 26 }, (_, i) => ({
      emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
      left: Math.random() * 100,
      duration: 2 + Math.random() * 2.5,
      delay: Math.random() * 1.5,
    }))
  );
  return (
    <>
      {pieces.current.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}
