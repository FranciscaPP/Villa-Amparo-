import React, { useState, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { useVoice } from '../hooks/useVoice.js'

function VillageShape() {
  return (
    <div style={{ position: 'relative', width: '260px', height: '180px', margin: '0 auto' }}>
      {/* Sky */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(180deg, #87CEEB 0%, #5DBB63 60%, #4a9450 100%)',
        borderRadius: '16px',
      }} />
      {/* House 1 */}
      <div style={{ position: 'absolute', bottom: '30px', left: '20px' }}>
        <div style={{ width: '0', height: '0', borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '30px solid #FF6B6B', marginBottom: '-2px' }} />
        <div style={{ width: '60px', height: '50px', background: '#F5F5DC', border: '2px solid #ddd' }}>
          <div style={{ width: '16px', height: '22px', background: '#8B4513', margin: '14px auto 0' }} />
        </div>
      </div>
      {/* House 2 (center, taller) */}
      <div style={{ position: 'absolute', bottom: '30px', left: '100px' }}>
        <div style={{ width: '0', height: '0', borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '40px solid #FFD700', marginBottom: '-2px' }} />
        <div style={{ width: '80px', height: '60px', background: '#FFFDF5', border: '2px solid #ddd' }}>
          <div style={{ width: '22px', height: '30px', background: '#4A2800', margin: '15px auto 0' }} />
        </div>
      </div>
      {/* House 3 */}
      <div style={{ position: 'absolute', bottom: '30px', right: '20px' }}>
        <div style={{ width: '0', height: '0', borderLeft: '28px solid transparent', borderRight: '28px solid transparent', borderBottom: '28px solid #4ECDC4', marginBottom: '-2px' }} />
        <div style={{ width: '56px', height: '45px', background: '#E8F8FF', border: '2px solid #ddd' }}>
          <div style={{ width: '14px', height: '20px', background: '#2980B9', margin: '12px auto 0' }} />
        </div>
      </div>
      {/* Trees */}
      <div style={{ position: 'absolute', bottom: '28px', left: '5px', fontSize: '28px' }}>🌳</div>
      <div style={{ position: 'absolute', bottom: '28px', right: '5px', fontSize: '24px' }}>🌲</div>
      {/* Sun */}
      <div style={{ position: 'absolute', top: '4px', right: '20px', fontSize: '32px', animation: 'twinkle 2s ease-in-out infinite' }}>☀️</div>
      {/* Path */}
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '30px', height: '14px', background: '#D2B48C', borderRadius: '4px' }} />
    </div>
  )
}

function StormScene() {
  return (
    <div style={{ position: 'relative', width: '260px', height: '160px', margin: '0 auto' }}>
      {/* Dark sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #2c3e50 0%, #4a4a6a 60%, #5a5a3a 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Storm clouds */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '40px', animation: 'float 2s ease-in-out infinite', opacity: 0.9 }}>⛈️</div>
        <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '36px', animation: 'float 2.5s 0.5s ease-in-out infinite' }}>🌩️</div>
        {/* Flying letters */}
        {['A', 'E', 'I', 'O', 'U', 'M'].map((l, i) => (
          <div key={l} style={{
            position: 'absolute',
            top: `${20 + i * 14}px`,
            left: `${10 + i * 35}px`,
            fontSize: '20px',
            fontWeight: 900,
            color: '#FFD700',
            opacity: 0.7,
            animation: `float ${1.5 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
            fontFamily: 'Nunito, sans-serif',
          }}>{l}</div>
        ))}
        {/* Ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: '#3d3d20' }} />
      </div>
    </div>
  )
}

function SadVillage() {
  return (
    <div style={{ position: 'relative', width: '260px', height: '160px', margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #888 0%, #aaa 50%, #777 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        filter: 'grayscale(0.8)',
      }}>
        {/* Gray houses */}
        {[20, 90, 170].map((x, i) => (
          <div key={x} style={{ position: 'absolute', bottom: '25px', left: `${x}px` }}>
            <div style={{ width: '0', height: '0', borderLeft: '25px solid transparent', borderRight: '25px solid transparent', borderBottom: '25px solid #999', marginBottom: '-2px' }} />
            <div style={{ width: '50px', height: '40px', background: '#bbb', border: '1px solid #aaa' }}>
              <div style={{ width: '12px', height: '18px', background: '#888', margin: '10px auto 0' }} />
            </div>
          </div>
        ))}
        {/* Sad face cloud */}
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '32px' }}>😢</div>
        {/* Ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25px', background: '#888' }} />
      </div>
    </div>
  )
}

function HeroScene({ playerName, skinTone }) {
  return (
    <div style={{ position: 'relative', width: '260px', height: '160px', margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #2d1b69 0%, #3d0e4a 50%, #1a5c2a 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Stars */}
        {['⭐', '✨', '🌟', '💫'].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${8 + i * 12}px`,
            left: `${i * 55 + 20}px`,
            fontSize: '18px',
            animation: `twinkle ${1 + i * 0.3}s ease-in-out infinite`,
          }}>{s}</div>
        ))}
        {/* Lumi */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '20px',
          fontSize: '40px',
          animation: 'dance 0.8s ease-in-out infinite',
        }}>⭐</div>
        {/* Player hero */}
        <div style={{
          position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: skinTone || '#FDBCB4',
            border: '3px solid #FFD700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
            animation: 'float 2s ease-in-out infinite',
            boxShadow: '0 0 16px rgba(255,215,0,0.6)',
          }}>🦸</div>
          <div style={{ color: '#FFD700', fontSize: '12px', fontWeight: 900, fontFamily: 'Nunito, sans-serif', textShadow: '0 0 6px rgba(255,215,0,0.8)' }}>
            {playerName || 'Héroe'}
          </div>
        </div>
        {/* Ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: '#1a5c2a' }} />
      </div>
    </div>
  )
}

const PANELS = [
  {
    title: 'Había una vez...',
    text: 'Había una vez un pueblo mágico llamado Villa Amparo, lleno de colores y letras...',
    narration: 'Había una vez un pueblo mágico llamado Villa Amparo, lleno de colores y letras.',
    bg: 'linear-gradient(135deg, #87CEEB 0%, #5DBB63 100%)',
    Scene: VillageShape,
  },
  {
    title: '¡La Tormenta!',
    text: 'Pero llegó la terrible Tormenta de las Palabras Perdidas y todo cambió...',
    narration: '¡Pero llegó la terrible Tormenta de las Palabras Perdidas y todo cambió!',
    bg: 'linear-gradient(135deg, #2c3e50 0%, #4a4a6a 100%)',
    Scene: StormScene,
  },
  {
    title: 'Las letras desaparecieron...',
    text: 'Las letras y los números volaron lejos. El pueblo quedó gris y triste.',
    narration: 'Las letras y los números volaron lejos. El pueblo quedó gris y triste.',
    bg: 'linear-gradient(135deg, #888 0%, #555 100%)',
    Scene: SadVillage,
  },
  {
    title: '¡Tú eres el héroe!',
    text: null, // dynamic
    narration: null, // dynamic
    bg: 'linear-gradient(135deg, #2d1b69 0%, #1a0533 100%)',
    Scene: HeroScene,
  },
]

export function Cutscene() {
  const setScreen = useGameStore(s => s.setScreen)
  const player = useGameStore(s => s.player)
  const { speak } = useVoice()
  const [panel, setPanel] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const heroText = `¡${player.name || 'Aventurero'}! Villa Amparo te necesita. ¡Sé el héroe que salve las letras!`
  const heroNarration = `¡${player.name || 'Aventurero'}! Villa Amparo te necesita. ¡Sé el héroe que salve las letras!`

  const currentPanel = PANELS[panel]
  const text = panel === 3 ? heroText : currentPanel.text
  const narration = panel === 3 ? heroNarration : currentPanel.narration

  useEffect(() => {
    speak(narration)
    setAnimKey(k => k + 1)
  }, [panel])

  const advance = () => {
    if (panel < PANELS.length - 1) {
      setPanel(p => p + 1)
    } else {
      setScreen('world')
    }
  }

  const Scene = currentPanel.Scene

  return (
    <div
      className="game-screen"
      onClick={advance}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a0533 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Skip button */}
      <button
        onClick={e => { e.stopPropagation(); setScreen('world') }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          color: '#fff',
          padding: '8px 18px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        Saltar ⏭
      </button>

      {/* Panel content */}
      <div
        key={animKey}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '20px',
          maxWidth: '520px',
          width: '100%',
          animation: 'fade-in 0.6s ease-out forwards',
        }}
      >
        {/* Scene illustration */}
        <div style={{
          background: currentPanel.bg,
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          width: '100%',
          maxWidth: '300px',
          animation: 'slide-up 0.6s ease-out forwards',
        }}>
          {panel === 3
            ? <Scene playerName={player.name} skinTone={player.skinTone} />
            : <Scene />
          }
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#FFD700',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(255,215,0,0.5)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          {currentPanel.title}
        </h2>

        {/* Text */}
        <p style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'rgba(255,253,245,0.9)',
          textAlign: 'center',
          lineHeight: 1.5,
          fontFamily: 'Nunito, sans-serif',
          maxWidth: '400px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}>
          {text}
        </p>

        {/* Hint */}
        <p style={{
          color: 'rgba(200,180,255,0.6)',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: 'Nunito, sans-serif',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          {panel < PANELS.length - 1 ? '👆 Toca para continuar' : '👆 ¡Toca para comenzar!'}
        </p>
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        display: 'flex',
        gap: '10px',
      }}>
        {PANELS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === panel ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: i === panel ? '#FFD700' : i < panel ? '#9B59B6' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
