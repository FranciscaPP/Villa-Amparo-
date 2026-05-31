import React, { useEffect, useState } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { Confetti } from '../components/Confetti.jsx'
import { getLetterData } from '../data/letters.js'
import { useVoice } from '../hooks/useVoice.js'

const FURNITURE = [
  { emoji: '🪴', name: 'Maceta colorida' },
  { emoji: '🪆', name: 'Muñeca curiosa' },
  { emoji: '📚', name: 'Libro de aventuras' },
  { emoji: '🌈', name: 'Arco iris decorativo' },
  { emoji: '⭐', name: 'Estrella brillante' },
  { emoji: '🎨', name: 'Lienzo artístico' },
  { emoji: '🎵', name: 'Nota musical' },
  { emoji: '🦋', name: 'Mariposa de cristal' },
]

export function RewardScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const lastReward = useGameStore(s => s.lastReward)
  const player = useGameStore(s => s.player)
  const coins = useGameStore(s => s.coins)
  const { speak } = useVoice()

  const [showCoins, setShowCoins] = useState(false)
  const [showFurniture, setShowFurniture] = useState(false)
  const [danceLetter, setDanceLetter] = useState(false)
  const [coinFlying, setCoinFlying] = useState(false)

  const letter = lastReward?.letter
  const letterData = letter ? getLetterData(letter) : null
  const furniture = FURNITURE[Math.floor(Math.random() * FURNITURE.length)]

  useEffect(() => {
    const msg = `¡Increíble! ${player.name || 'Campeón'}, aprendiste la letra ${letter}! ¡Ganaste quince estrellas!`
    speak(msg)

    const t1 = setTimeout(() => setDanceLetter(true), 300)
    const t2 = setTimeout(() => { setShowCoins(true); setCoinFlying(true) }, 700)
    const t3 = setTimeout(() => setCoinFlying(false), 2200)
    const t4 = setTimeout(() => setShowFurniture(true), 1400)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div className="game-screen" style={{
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a0533 60%, #0a0118 100%)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Confetti count={60} duration={4000} />

      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: letterData
          ? `radial-gradient(circle, ${letterData.color}22 0%, transparent 70%)`
          : 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        animation: 'pulse 2s ease-in-out infinite',
      }} />

      {/* Spinning star burst */}
      <div style={{
        position: 'absolute',
        fontSize: '60px',
        animation: 'spin 8s linear infinite',
        opacity: 0.15,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        lineHeight: 1,
      }}>
        ✨🌟⭐💫✨🌟⭐💫✨
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 5,
        padding: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}>
        {/* INCREÍBLE title */}
        <div style={{ animation: 'bounce-in 0.7s ease-out forwards' }}>
          <h1 style={{
            fontSize: 'clamp(52px, 10vw, 88px)',
            fontWeight: 900,
            fontFamily: 'Nunito, sans-serif',
            background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 40%, #FF6B6B 70%, #DDA0DD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 20px rgba(255,215,0,0.5))',
          }}>
            ¡INCREÍBLE!
          </h1>
        </div>

        {/* Letter dancing */}
        {letterData && (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${letterData.color}, ${letterData.color}88)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            fontWeight: 900,
            color: '#fff',
            fontFamily: 'Nunito, sans-serif',
            boxShadow: `0 0 40px ${letterData.color}99, 0 0 80px ${letterData.color}44`,
            animation: danceLetter ? 'dance 0.8s ease-in-out infinite' : 'pop-in 0.5s ease-out forwards',
            textShadow: '0 3px 10px rgba(0,0,0,0.5)',
            border: '4px solid rgba(255,255,255,0.3)',
          }}>
            {letterData.letter}
          </div>
        )}

        {/* Name + letter */}
        <p style={{
          fontSize: '22px',
          fontWeight: 800,
          color: '#fff',
          fontFamily: 'Nunito, sans-serif',
          lineHeight: 1.4,
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          animation: 'slide-up 0.5s 0.3s ease-out both',
        }}>
          {player.name || 'Campeón'}, ¡aprendiste la letra{' '}
          <span style={{ color: letterData?.color || '#FFD700', fontWeight: 900 }}>
            {letter}
          </span>!
        </p>

        {/* Coins */}
        {showCoins && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,215,0,0.15)',
            borderRadius: '20px',
            padding: '12px 24px',
            border: '2px solid rgba(255,215,0,0.4)',
            animation: 'pop-in 0.5s ease-out forwards',
            position: 'relative',
          }}>
            {/* Flying coins */}
            {coinFlying && Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: '20px',
                  left: `${20 + i * 15}px`,
                  top: '0px',
                  animation: `coin-rise ${0.8 + i * 0.1}s ${i * 0.12}s ease-out forwards`,
                  pointerEvents: 'none',
                }}
              >
                ⭐
              </div>
            ))}
            <span style={{ fontSize: '32px' }}>⭐</span>
            <div>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: '28px', fontFamily: 'Nunito, sans-serif' }}>
                +{lastReward?.coins || 15}
              </div>
              <div style={{ color: 'rgba(255,215,0,0.7)', fontSize: '14px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
                Total: {coins} ⭐
              </div>
            </div>
          </div>
        )}

        {/* Unlocked furniture */}
        {showFurniture && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(155,89,182,0.2)',
            borderRadius: '20px',
            padding: '12px 20px',
            border: '2px solid rgba(155,89,182,0.4)',
            animation: 'slide-up 0.5s ease-out forwards',
          }}>
            <span style={{ fontSize: '36px', animation: 'bounce 1.2s ease-in-out infinite' }}>
              {furniture.emoji}
            </span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#DDA0DD', fontWeight: 900, fontSize: '14px', fontFamily: 'Nunito, sans-serif' }}>
                ¡Nuevo para tu casa!
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: 'Nunito, sans-serif' }}>
                {furniture.name}
              </div>
            </div>
          </div>
        )}

        {/* Lumi excited */}
        <div style={{ animation: 'bounce 1.2s ease-in-out infinite', fontSize: '48px' }}>⭐</div>

        {/* Continue button */}
        <button
          className="btn-big animate-pulse-glow"
          onClick={() => setScreen('letterforest')}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 60%, #FF6B6B 100%)',
            color: '#fff',
            fontSize: '22px',
            padding: '18px 44px',
            boxShadow: '0 8px 32px rgba(255,140,0,0.5)',
            animation: 'pop-in 0.5s 0.8s ease-out both',
          }}
        >
          🚀 ¡Continuar la aventura!
        </button>
      </div>
    </div>
  )
}
