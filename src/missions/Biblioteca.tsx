import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state';
import { speak, stopSpeaking, randomPraise, BIBLIO } from '../voice';
import { Confetti } from './shared';

interface Book {
  word: string;
  color: string;
}

const ROUNDS: { letter: string; books: Book[] }[] = [
  {
    letter: 'M',
    books: [
      { word: 'MAMÁ', color: '#ef476f' },
      { word: 'SOL', color: '#ffd166' },
      { word: 'MESA', color: '#06d6a0' },
      { word: 'PATO', color: '#4cc9f0' },
      { word: 'MONO', color: '#9b5de5' },
      { word: 'LUNA', color: '#fb8500' },
      { word: 'CASA', color: '#118ab2' },
      { word: 'UVA', color: '#83c5be' },
    ],
  },
  {
    letter: 'P',
    books: [
      { word: 'PATO', color: '#06d6a0' },
      { word: 'GATO', color: '#ef476f' },
      { word: 'PAN', color: '#ffd166' },
      { word: 'OSO', color: '#4cc9f0' },
      { word: 'PIÑA', color: '#fb8500' },
      { word: 'MANO', color: '#9b5de5' },
      { word: 'NUBE', color: '#118ab2' },
      { word: 'TAZA', color: '#83c5be' },
    ],
  },
];

/** Misión de la biblioteca: encuentra los 3 libros que empiezan con la letra pedida. */
export default function Biblioteca() {
  const setScreen = useGame((s) => s.setScreen);
  const finishMission = useGame((s) => s.finishMission);
  const round = useRef(ROUNDS[Math.floor(Math.random() * ROUNDS.length)]);
  const targets = round.current.books.filter((b) => b.word.startsWith(round.current.letter));
  const [found, setFound] = useState<string[]>([]);
  const [wrongFx, setWrongFx] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);

  const instruction = `¡Busca los tres libros que empiezan con la letra ${round.current.letter}!`;

  useEffect(() => {
    speak(instruction, BIBLIO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = async (book: Book) => {
    if (done || found.includes(book.word)) return;
    if (book.word.startsWith(round.current.letter)) {
      const now = [...found, book.word];
      setFound(now);
      if (now.length >= targets.length) {
        setDone(true);
        const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        finishMission('biblioteca', stars, 5);
        speak(`¡Encontraste todos los libros con la ${round.current.letter}! ${randomPraise()} Ganaste tus estrellas.`, BIBLIO);
      } else {
        speak(`${randomPraise()} ${book.word} empieza con ${round.current.letter}. ¡Te faltan ${targets.length - now.length}!`, BIBLIO);
      }
    } else {
      setErrors((e) => e + 1);
      setWrongFx(book.word);
      setTimeout(() => setWrongFx(null), 450);
      speak(`Ese libro dice ${book.word.toLowerCase()}. Busca los que empiezan con ${round.current.letter}.`, BIBLIO);
    }
  };

  if (done) {
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
    return (
      <div className="mission library-bg">
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

  return (
    <div className="mission library-bg">
      <div className="mission-title">
        📚 Libros con la letra <span className="target-letter">{round.current.letter}</span>
        <span className="found-count">
          {found.length}/{targets.length}
        </span>
      </div>
      <div className="bookshelf">
        {round.current.books.map((b) => (
          <button
            key={b.word}
            className={[
              'book',
              found.includes(b.word) ? 'book-found' : '',
              wrongFx === b.word ? 'wrong-shake' : '',
            ].join(' ')}
            style={{ background: b.color }}
            onClick={() => tap(b)}
          >
            <span className="book-initial">{b.word[0]}</span>
            <span className="book-word">{b.word}</span>
          </button>
        ))}
      </div>
      <button className="speak-again" onClick={() => speak(instruction, BIBLIO)}>
        🔊
      </button>
    </div>
  );
}
