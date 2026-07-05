import { useRef } from 'react';

const CONFETTI_EMOJI = ['🎉', '⭐', '🎈', '✨', '🌟'];

export function Confetti() {
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
