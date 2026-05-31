import React, { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { Lumi } from '../components/Lumi.jsx'
import { LETTERS, getLetterData } from '../data/letters.js'
import { useVoice } from '../hooks/useVoice.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getOtherLetters(exclude, count) {
  return shuffle(LETTERS.filter(l => l.letter !== exclude)).slice(0, count).map(l => l.letter)
}

function getOtherWordOptions(letterData) {
  // Gets 2 words that do NOT start with the target letter
  const otherLetters = LETTERS.filter(l => l.letter !== letterData.letter)
  const picks = []
  for (const ol of shuffle(otherLetters)) {
    for (let wi = 0; wi < ol.words.length && picks.length < 2; wi++) {
      picks.push({ word: ol.words[wi], emoji: ol.wordEmojis[wi] })
    }
    if (picks.length >= 2) break
  }
  return picks
}

// ---- Type 1: Letter Recognition ----
function LetterRecognition({ letterData, player, onCorrect, onWrong, attempt }) {
  const { speak } = useVoice()
  const [chosen, setChosen] = useState(null)
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState(false)

  const distractors = useRef(getOtherLetters(letterData.letter, 2))
  const options = useRef(shuffle([letterData.letter, ...distractors.current]))

  useEffect(() => {
    speak(`¿Puedes tocar la letra ${letterData.letter}?`)
    if (attempt >= 2) setHint(true)
  }, [attempt])

  const handleChoice = (letter) => {
    setChosen(letter)
    if (letter === letterData.letter) {
      speak(`¡Correcto! ¡Esa es la ${letterData.letter}!`)
      setTimeout(onCorrect, 700)
    } else {
      setShake(true)
      speak('¡Buen intento! Inténtalo otra vez.')
      setTimeout(() => { setShake(false); setChosen(null); onWrong() }, 900)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
      <h2 style={styles.question}>¿Puedes tocar la letra <span style={{ color: letterData.color }}>{letterData.letter}</span>?</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.current.map(letter => {
          const ld = getLetterData(letter)
          const isTarget = letter === letterData.letter
          const isChosen = chosen === letter
          const isHinted = hint && isTarget
          return (
            <button
              key={letter}
              onClick={() => handleChoice(letter)}
              className={isChosen && letter !== letterData.letter ? 'animate-shake' : ''}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '24px',
                border: isChosen && isTarget ? '5px solid #44ff44'
                  : isHinted ? '5px solid #FFD700'
                  : '3px solid rgba(255,255,255,0.25)',
                background: isChosen && isTarget
                  ? 'linear-gradient(135deg, #44ff44, #22cc22)'
                  : isHinted
                  ? `linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.2))`
                  : `linear-gradient(135deg, ${ld?.color || '#666'}cc, ${ld?.color || '#666'}88)`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'Nunito, sans-serif',
                transition: 'all 0.2s',
                transform: isChosen && isTarget ? 'scale(1.1)' : isHinted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHinted ? '0 0 20px rgba(255,215,0,0.7)' : '0 4px 16px rgba(0,0,0,0.3)',
                animation: isHinted ? 'pulse-glow 1s ease-in-out infinite' : 'none',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {hint && (
        <p style={{ color: '#FFD700', fontWeight: 700, fontSize: '16px', fontFamily: 'Nunito, sans-serif', animation: 'pulse 1s ease-in-out infinite' }}>
          💡 Pista: ¡La letra brillante es la correcta!
        </p>
      )}
    </div>
  )
}

// ---- Type 2: Word-Image Match ----
function WordImage({ letterData, player, onCorrect, onWrong, attempt }) {
  const { speak } = useVoice()
  const [chosen, setChosen] = useState(null)
  const [hint, setHint] = useState(false)

  const correctIdx = useRef(Math.floor(Math.random() * letterData.words.length))
  const wrongOptions = useRef(getOtherWordOptions(letterData))
  const allOptions = useRef(shuffle([
    { word: letterData.words[correctIdx.current], emoji: letterData.wordEmojis[correctIdx.current], correct: true },
    ...wrongOptions.current.map(o => ({ ...o, correct: false })),
  ]))

  useEffect(() => {
    speak(`${letterData.letter} de ${letterData.words[correctIdx.current]}. ¿Cuál imagen empieza con ${letterData.letter}?`)
    if (attempt >= 2) setHint(true)
  }, [attempt])

  const handleChoice = (opt) => {
    setChosen(opt.word)
    if (opt.correct) {
      speak(`¡Exacto! ${letterData.letter} de ${opt.word}.`)
      setTimeout(onCorrect, 700)
    } else {
      speak(`¡Buen intento! ${opt.word} no empieza con ${letterData.letter}.`)
      setTimeout(() => { setChosen(null); onWrong() }, 900)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
      <h2 style={styles.question}>
        ¿Qué imagen empieza con <span style={{ color: letterData.color }}>{letterData.letter}</span>?
      </h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {allOptions.current.map(opt => {
          const isChosen = chosen === opt.word
          const isHinted = hint && opt.correct
          return (
            <button
              key={opt.word}
              onClick={() => handleChoice(opt)}
              style={{
                width: '140px',
                minHeight: '140px',
                borderRadius: '24px',
                border: isChosen && opt.correct ? '5px solid #44ff44'
                  : isHinted ? '5px solid #FFD700'
                  : '2px solid rgba(255,255,255,0.2)',
                background: isChosen && opt.correct
                  ? 'linear-gradient(135deg, rgba(68,255,68,0.2), rgba(34,204,34,0.15))'
                  : isHinted
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.15))'
                  : 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                transform: isHinted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHinted ? '0 0 20px rgba(255,215,0,0.6)' : '0 4px 16px rgba(0,0,0,0.3)',
                animation: isHinted ? 'pulse-glow 1s ease-in-out infinite' : 'none',
              }}
            >
              <span style={{ fontSize: '54px' }}>{opt.emoji}</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', fontFamily: 'Nunito, sans-serif', textTransform: 'capitalize' }}>
                {opt.word}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---- Type 3: Phonics ----
function Phonics({ letterData, player, onCorrect, onWrong, attempt }) {
  const { speak } = useVoice()
  const [chosen, setChosen] = useState(null)
  const [hint, setHint] = useState(false)

  const distractors = useRef(getOtherLetters(letterData.letter, 2))
  const options = useRef(shuffle([letterData.letter, ...distractors.current]))

  const playSound = () => {
    speak(letterData.sound, { rate: 0.7, pitch: 1.2 })
  }

  useEffect(() => {
    setTimeout(() => playSound(), 400)
    if (attempt >= 2) setHint(true)
  }, [attempt])

  const handleChoice = (letter) => {
    setChosen(letter)
    if (letter === letterData.letter) {
      speak(`¡Correcto! El sonido ${letterData.phoneme} es la letra ${letterData.letter}.`)
      setTimeout(onCorrect, 700)
    } else {
      speak('¡Inténtalo otra vez!')
      setTimeout(() => { setChosen(null); onWrong() }, 900)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
      <h2 style={styles.question}>Escucha el sonido... ¿Cuál es esta letra?</h2>

      {/* Play sound button */}
      <button
        onClick={playSound}
        className="btn-big animate-pulse"
        style={{
          background: 'linear-gradient(135deg, #9B59B6, #3498DB)',
          color: '#fff',
          fontSize: '22px',
          padding: '16px 36px',
          gap: '10px',
        }}
      >
        🔊 Escuchar sonido
      </button>

      <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '16px', fontWeight: 600, fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>
        {letterData.sound}
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.current.map(letter => {
          const ld = getLetterData(letter)
          const isTarget = letter === letterData.letter
          const isChosen = chosen === letter
          const isHinted = hint && isTarget
          return (
            <button
              key={letter}
              onClick={() => handleChoice(letter)}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '24px',
                border: isChosen && isTarget ? '5px solid #44ff44'
                  : isHinted ? '5px solid #FFD700'
                  : '3px solid rgba(255,255,255,0.25)',
                background: isChosen && isTarget
                  ? 'linear-gradient(135deg, #44ff44, #22cc22)'
                  : isHinted
                  ? `linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.2))`
                  : `linear-gradient(135deg, ${ld?.color || '#666'}cc, ${ld?.color || '#666'}88)`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'Nunito, sans-serif',
                transition: 'all 0.2s',
                transform: isHinted ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isHinted ? '0 0 20px rgba(255,215,0,0.7)' : '0 4px 16px rgba(0,0,0,0.3)',
                animation: isHinted ? 'pulse-glow 1s ease-in-out infinite' : 'none',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {hint && (
        <p style={{ color: '#FFD700', fontWeight: 700, fontSize: '16px', fontFamily: 'Nunito, sans-serif', animation: 'pulse 1s ease-in-out infinite' }}>
          💡 Pista: ¡La letra brillante hace ese sonido!
        </p>
      )}
    </div>
  )
}

// ---- Styles ----
const styles = {
  question: {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 900,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Nunito, sans-serif',
    lineHeight: 1.3,
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  }
}

// ---- Main Minigame ----
export function LetterMinigame() {
  const completeMinigame = useGameStore(s => s.completeMinigame)
  const setScreen = useGameStore(s => s.setScreen)
  const currentLetter = useGameStore(s => s.currentLetter)
  const minigameType = useGameStore(s => s.minigameType)
  const player = useGameStore(s => s.player)
  const { speak } = useVoice()

  const letterData = getLetterData(currentLetter)
  const [attempt, setAttempt] = useState(0)
  const [phase, setPhase] = useState('playing') // playing | success | revealed
  const [lumiMsg, setLumiMsg] = useState(null)
  const [lumiAnim, setLumiAnim] = useState('float')
  const MAX_ATTEMPTS = 3

  useEffect(() => {
    if (!letterData) return
    setLumiMsg(`¡Vamos a aprender la letra ${letterData.letter}! ${letterData.sound}`)
  }, [currentLetter])

  if (!letterData) {
    return (
      <div style={{ ...containerStyle, justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#fff', fontSize: '24px', fontFamily: 'Nunito, sans-serif' }}>Cargando...</p>
      </div>
    )
  }

  const handleCorrect = () => {
    setPhase('success')
    setLumiMsg(`¡FANTÁSTICO! ${player.name || 'Campeón'}, ¡lo lograste! 🎉`)
    setLumiAnim('dance')
    speak(`¡Fantástico! ${player.name || 'Campeón'}, ¡lo lograste!`)
  }

  const handleWrong = () => {
    const newAttempt = attempt + 1
    if (newAttempt >= MAX_ATTEMPTS) {
      setPhase('revealed')
      setLumiMsg(`¡Ahí está! ¡La encontramos juntos! Es la letra ${letterData.letter}.`)
      speak(`¡Ahí está! ¡La encontramos juntos! Es la letra ${letterData.letter}.`)
      setTimeout(() => completeMinigame(true), 2500)
    } else {
      setAttempt(newAttempt)
      setLumiMsg('¡Buen intento! Volvamos a intentarlo. ¡Tú puedes!')
    }
  }

  const GameComponent = {
    letter_recognition: LetterRecognition,
    word_image: WordImage,
    phonics: Phonics,
  }[minigameType] || LetterRecognition

  return (
    <div className="game-screen" style={{
      background: `radial-gradient(ellipse at 50% 20%, ${letterData.color}33 0%, #1a0533 60%, #0d0220 100%)`,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '80px',
      overflowY: 'auto',
    }}>
      {/* Back button */}
      <button
        onClick={() => setScreen('letterforest')}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          color: '#fff',
          padding: '8px 16px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          cursor: 'pointer',
          zIndex: 30,
        }}
      >
        ← Salir
      </button>

      {/* Lumi */}
      <Lumi message={lumiMsg} animation={lumiAnim} position="corner" size="small" />

      {/* Letter character */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${letterData.color}, ${letterData.color}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '52px',
          fontWeight: 900,
          color: '#fff',
          fontFamily: 'Nunito, sans-serif',
          margin: '0 auto 8px',
          boxShadow: `0 0 30px ${letterData.color}88`,
          animation: phase === 'success' ? 'dance 0.8s ease-in-out infinite' : 'float 3s ease-in-out infinite',
          textShadow: '0 3px 8px rgba(0,0,0,0.5)',
        }}>
          {letterData.letter}
        </div>
        <div style={{ color: letterData.color, fontSize: '26px', fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}>
          {letterData.character} {letterData.characterName}
        </div>
      </div>

      {/* Game card */}
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        borderRadius: '28px',
        border: `2px solid ${letterData.color}55`,
        padding: '28px 24px',
        width: '100%',
        maxWidth: '540px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        animation: 'fade-in 0.4s ease-out',
        margin: '0 16px',
      }}>

        {/* Attempt dots */}
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i < attempt ? '#FF6B6B' : i === attempt ? letterData.color : 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
            }} />
          ))}
        </div>

        {phase === 'playing' && (
          <GameComponent
            letterData={letterData}
            player={player}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            attempt={attempt}
          />
        )}

        {phase === 'success' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            animation: 'bounce-in 0.6s ease-out',
          }}>
            <div style={{ fontSize: '80px', animation: 'dance 0.8s ease-in-out infinite' }}>✅</div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#44ff44',
              textShadow: '0 0 20px rgba(68,255,68,0.6)',
              fontFamily: 'Nunito, sans-serif',
              textAlign: 'center',
            }}>
              ¡FANTÁSTICO!
            </h2>
            <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>
              {player.name || 'Campeón'}, ¡aprendiste la letra {letterData.letter}!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,215,0,0.15)', borderRadius: '16px', padding: '10px 20px' }}>
              <span style={{ fontSize: '24px' }}>⭐</span>
              <span style={{ color: '#FFD700', fontWeight: 900, fontSize: '22px', fontFamily: 'Nunito, sans-serif' }}>+15</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontFamily: 'Nunito, sans-serif' }}>monedas</span>
            </div>
            <button
              className="btn-big animate-pulse-glow"
              onClick={() => completeMinigame(true)}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                color: '#fff',
                fontSize: '20px',
                padding: '16px 40px',
              }}
            >
              ¡Siguiente! →
            </button>
          </div>
        )}

        {phase === 'revealed' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: 'fade-in 0.5s ease-out',
          }}>
            <div style={{ fontSize: '60px', animation: 'bounce 1.2s ease-in-out infinite' }}>🎉</div>
            <p style={{ color: '#FFD700', fontSize: '22px', fontWeight: 900, fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>
              ¡Ahí está! ¡La encontramos juntos!
            </p>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${letterData.color}, ${letterData.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '42px', fontWeight: 900, color: '#fff',
              fontFamily: 'Nunito, sans-serif',
              boxShadow: `0 0 24px ${letterData.color}`,
              animation: 'dance 0.8s ease-in-out infinite',
            }}>
              {letterData.letter}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'Nunito, sans-serif',
}
