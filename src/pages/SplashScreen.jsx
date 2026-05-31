import React, { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { Lumi } from '../components/Lumi.jsx'
import { useVoice } from '../hooks/useVoice.js'

const BG_LETTERS = ['A', 'E', 'I', 'O', 'U', 'M', 'P', 'S', 'a', 'e', 'i', 'o', 'u', 'm', 'p', 's', '1', '2', '3', 'A', 'B', 'E']

function Star({ style }) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: '50%',
      background: '#fff',
      ...style,
    }} />
  )
}

function FallingLetter({ letter, left, delay, duration, color }) {
  return (
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: `${left}%`,
      fontSize: '32px',
      fontWeight: 900,
      color: color,
      opacity: 0.35,
      animation: `letter-float-up ${duration}s ${delay}s linear infinite`,
      fontFamily: 'Nunito, sans-serif',
      textShadow: `0 0 10px ${color}`,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {letter}
    </div>
  )
}

const LETTER_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD700', '#96CEB4', '#DDA0DD', '#87CEEB', '#FF8C00', '#5DBB63']

export function SplashScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const { speak } = useVoice()
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)

  useEffect(() => {
    speak('¡Bienvenido a Villa Amparo! Un mundo mágico para aprender.')
    const t1 = setTimeout(() => setTitleVisible(true), 300)
    const t2 = setTimeout(() => setSubtitleVisible(true), 900)
    const t3 = setTimeout(() => setBtnVisible(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleStart = () => {
    speak('¡Vamos a crear tu personaje!')
    setScreen('avatar')
  }

  const fallingLetters = BG_LETTERS.map((l, i) => ({
    letter: l,
    left: (i * 4.5 + 2) % 96,
    delay: (i * 0.7) % 6,
    duration: 6 + (i % 4) * 2,
    color: LETTER_COLORS[i % LETTER_COLORS.length],
  }))

  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: 1.5 + Math.random() * 2,
  }))

  return (
    <div className="game-screen" style={{
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a0533 50%, #0a0118 100%)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Stars */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          top: s.top,
          left: s.left,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: '50%',
          background: '#fff',
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* Falling letters background */}
      {fallingLetters.map((fl, i) => (
        <FallingLetter key={i} {...fl} />
      ))}

      {/* Glow rings */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,89,182,0.15) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        zIndex: 10,
        padding: '20px',
        textAlign: 'center',
      }}>
        {/* Lumi large */}
        <div className="animate-float-slow">
          <Lumi
            message="¡Hola! Soy Lumi. ¡Bienvenido a Villa Amparo!"
            animation="float"
            position="center"
            size="large"
          />
        </div>

        {/* Title */}
        {titleVisible && (
          <div style={{
            animation: 'bounce-in 0.7s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
          }}>
            <h1 style={{
              fontSize: 'clamp(42px, 8vw, 80px)',
              fontWeight: 900,
              fontFamily: 'Nunito, sans-serif',
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 40%, #FF6B6B 70%, #DDA0DD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              lineHeight: 1.1,
              filter: 'drop-shadow(0 4px 24px rgba(255,215,0,0.4))',
            }}>
              🏡 Villa Amparo
            </h1>
          </div>
        )}

        {/* Subtitle */}
        {subtitleVisible && (
          <div style={{
            animation: 'slide-up 0.5s ease-out forwards',
          }}>
            <p style={{
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontWeight: 700,
              color: 'rgba(200, 180, 255, 0.9)',
              fontFamily: 'Nunito, sans-serif',
              letterSpacing: '0.02em',
              textShadow: '0 2px 12px rgba(155,89,182,0.5)',
            }}>
              ✨ Un mundo mágico para aprender ✨
            </p>
          </div>
        )}

        {/* Start button */}
        {btnVisible && (
          <div style={{
            animation: 'pop-in 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
            marginTop: '8px',
          }}>
            <button
              className="btn-big animate-pulse-glow"
              onClick={handleStart}
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 60%, #FF6B6B 100%)',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 900,
                padding: '18px 48px',
                borderRadius: '50px',
                boxShadow: '0 8px 32px rgba(255,140,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: '0.03em',
              }}
            >
              🚀 ¡Comenzar Aventura!
            </button>

            <p style={{
              marginTop: '16px',
              color: 'rgba(200,180,255,0.65)',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Nunito, sans-serif',
            }}>
              Para niños de 5 a 8 años
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
