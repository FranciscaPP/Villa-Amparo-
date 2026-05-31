import React, { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { Lumi } from '../components/Lumi.jsx'
import { HUD } from '../components/HUD.jsx'
import { useVoice } from '../hooks/useVoice.js'

const STARTER_ITEMS = [
  { emoji: '🛏️', name: 'Cama', x: '15%', y: '35%', size: '70px' },
  { emoji: '🪑', name: 'Silla', x: '60%', y: '55%', size: '55px' },
  { emoji: '🌱', name: 'Plantita', x: '75%', y: '30%', size: '50px' },
  { emoji: '🪟', name: 'Ventana', x: '40%', y: '18%', size: '60px' },
  { emoji: '🏮', name: 'Lámpara', x: '20%', y: '20%', size: '45px' },
]

const UNLOCKABLE = [
  { emoji: '📚', name: 'Libros', requiredLetters: 1 },
  { emoji: '🎨', name: 'Pinturas', requiredLetters: 2 },
  { emoji: '🪴', name: 'Maceta', requiredLetters: 3 },
  { emoji: '🎵', name: 'Música', requiredLetters: 4 },
  { emoji: '🌈', name: 'Arco iris', requiredLetters: 5 },
  { emoji: '🦋', name: 'Mariposa', requiredLetters: 6 },
  { emoji: '⭐', name: 'Estrella', requiredLetters: 7 },
  { emoji: '🏆', name: 'Trofeo', requiredLetters: 8 },
]

// Isometric room tile
function RoomTile({ x, y, w, h, color, shadow }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      background: color,
      boxShadow: shadow,
      borderRadius: '4px',
    }} />
  )
}

export function HomeView() {
  const setScreen = useGameStore(s => s.setScreen)
  const lettersLearned = useGameStore(s => s.lettersLearned)
  const player = useGameStore(s => s.player)
  const { speak } = useVoice()

  useEffect(() => {
    const msg = lettersLearned.length > 0
      ? `¡Esta es tu casa, ${player.name || 'amigo'}! Has ganado ${lettersLearned.length} decoraciones. ¡Sigue aprendiendo para añadir más!`
      : `¡Esta es tu casa, ${player.name || 'amigo'}! Con cada letra que aprendas, podrás decorarla más.`
    speak(msg)
  }, [])

  const unlockedExtras = UNLOCKABLE.filter(item => lettersLearned.length >= item.requiredLetters)

  return (
    <div className="game-screen" style={{
      background: 'radial-gradient(ellipse at 50% 20%, #2d1b69 0%, #1a0533 70%, #0d0220 100%)',
    }}>
      <HUD zoneName="Tu Casa" />
      <Lumi
        message={`¡Esta es tu casa! Con cada letra aprendida, podrás decorarla más. ¡Ya tienes ${lettersLearned.length} letras!`}
        position="corner"
        size="small"
      />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '68px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#FFD700',
          fontFamily: 'Nunito, sans-serif',
          textShadow: '0 2px 12px rgba(255,215,0,0.4)',
        }}>
          🏠 Tu Casa
        </h1>
        <p style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'rgba(200,180,255,0.7)',
          fontFamily: 'Nunito, sans-serif',
          marginTop: '4px',
        }}>
          {unlockedExtras.length + STARTER_ITEMS.length} objetos • {lettersLearned.length} letras aprendidas
        </p>
      </div>

      {/* Isometric room */}
      <div style={{
        position: 'absolute',
        top: '130px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(700px, 95vw)',
        height: '420px',
        perspective: '800px',
      }}>
        {/* Room wrapper with isometric-like tilt */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: 'rotateX(15deg)',
          transformOrigin: 'center top',
        }}>
          {/* Floor */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #C8A96E 0%, #B8945A 40%, #A07840 100%)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            {/* Floor pattern */}
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => (
                <div
                  key={`${row}-${col}`}
                  style={{
                    position: 'absolute',
                    left: `${col * 12.5}%`,
                    top: `${row * 16.7}%`,
                    width: '12%',
                    height: '16%',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: (row + col) % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                />
              ))
            )}

            {/* Walls suggestion */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '35%',
              background: 'linear-gradient(180deg, #E8D5B0 0%, #D4B888 100%)',
              borderBottom: '3px solid rgba(0,0,0,0.15)',
            }} />

            {/* Wall decorations */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              right: '5%',
              height: '25%',
              background: 'linear-gradient(180deg, #DFC9A0 0%, #C9A870 100%)',
              borderRadius: '8px',
              border: '2px solid rgba(0,0,0,0.1)',
            }} />

            {/* Starter items */}
            {STARTER_ITEMS.map(item => (
              <div
                key={item.name}
                title={item.name}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  fontSize: item.size,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                  cursor: 'default',
                  animation: 'breathe 3s ease-in-out infinite',
                  userSelect: 'none',
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Unlocked extra items */}
            {unlockedExtras.slice(0, 8).map((item, i) => (
              <div
                key={item.name}
                title={item.name}
                style={{
                  position: 'absolute',
                  left: `${25 + (i % 4) * 16}%`,
                  top: `${40 + Math.floor(i / 4) * 25}%`,
                  fontSize: '40px',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                  userSelect: 'none',
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Player avatar in room */}
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              animation: 'float 2s ease-in-out infinite',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: player.skinTone,
                border: `4px solid ${player.hairColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              }}>
                😊
              </div>
              <div style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: '12px',
                fontFamily: 'Nunito, sans-serif',
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '8px',
                padding: '2px 8px',
              }}>
                {player.name || 'Tú'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locked items preview */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(700px, 95vw)',
        zIndex: 10,
      }}>
        <p style={{
          color: 'rgba(200,180,255,0.6)',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Por desbloquear:
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {UNLOCKABLE.filter(item => lettersLearned.length < item.requiredLetters).slice(0, 5).map(item => (
            <div
              key={item.name}
              title={`Aprende ${item.requiredLetters} letras para desbloquear`}
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                filter: 'grayscale(1)',
                opacity: 0.5,
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.emoji}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
                {item.name} ({item.requiredLetters}⭐)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => setScreen('world')}
        className="btn-big"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #9B59B6, #3498DB)',
          color: '#fff',
          fontSize: '18px',
          padding: '14px 36px',
          zIndex: 10,
        }}
      >
        ← Volver al Mundo
      </button>
    </div>
  )
}
