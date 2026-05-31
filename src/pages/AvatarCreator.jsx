import React, { useState, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { Lumi } from '../components/Lumi.jsx'
import { useVoice } from '../hooks/useVoice.js'

const SKIN_TONES = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDBAC']
const HAIR_STYLES = [
  { id: 'short', label: 'Corto', emoji: '💇' },
  { id: 'long', label: 'Largo', emoji: '💁' },
  { id: 'curly', label: 'Rizado', emoji: '🌀' },
  { id: 'braids', label: 'Trenzas', emoji: '👱' },
]
const HAIR_COLORS = ['#1a0a00', '#4A2800', '#8B4513', '#D2691E', '#FFD700', '#FF69B4', '#4169E1', '#8A2BE2']
const PETS = [
  { id: 'cat', emoji: '🐱', name: 'Naranjo', label: 'Gatito Naranjo' },
  { id: 'dog', emoji: '🐶', name: 'Manchas', label: 'Perrito Manchas' },
  { id: 'rabbit', emoji: '🐰', name: 'Nube', label: 'Conejito Nube' },
  { id: 'chick', emoji: '🐥', name: 'Pipín', label: 'Pollito Pipín' },
]

const LUMI_MESSAGES = [
  '¿Cómo es tu piel? ¡Todos somos hermosos!',
  '¡Elige tu peinado favorito!',
  '¿De qué color tienes el pelo?',
  '¡Elige tu mascota! Será tu compañero.',
  '¿Cómo se llama tu personaje?',
]

export function AvatarCreator() {
  const setScreen = useGameStore(s => s.setScreen)
  const setPlayer = useGameStore(s => s.setPlayer)
  const player = useGameStore(s => s.player)
  const { speak } = useVoice()

  const [step, setStep] = useState(0)
  const [bouncing, setBouncing] = useState(null)

  const totalSteps = 5

  useEffect(() => {
    speak(LUMI_MESSAGES[step])
  }, [step])

  const next = () => {
    if (step < totalSteps - 1) setStep(s => s + 1)
  }
  const prev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleFinish = () => {
    if (!player.name.trim()) {
      speak('¡Ponle un nombre a tu personaje!')
      return
    }
    speak(`¡Genial! ¡${player.name} está listo para la aventura!`)
    setTimeout(() => setScreen('cutscene'), 800)
  }

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(ellipse at 50% 0%, #3d1b7a 0%, #1a0533 60%, #0d0220 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: 'Nunito, sans-serif',
    position: 'relative',
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(16px)',
    borderRadius: '32px',
    border: '2px solid rgba(255,215,0,0.25)',
    padding: '32px 28px',
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    zIndex: 2,
  }

  const titleStyle = {
    fontSize: '26px',
    fontWeight: 900,
    color: '#FFD700',
    textAlign: 'center',
    textShadow: '0 2px 12px rgba(255,215,0,0.4)',
  }

  const stepTitleMap = [
    '🎨 Elige el color de tu piel',
    '💇 Elige tu peinado',
    '🎨 Elige el color del pelo',
    '🐾 Elige tu mascota',
    '✍️ ¿Cómo te llamas?',
  ]

  // Avatar preview
  const petEmoji = PETS.find(p => p.id === player.petType)?.emoji || '🐱'
  const hairEmoji = HAIR_STYLES.find(h => h.id === player.hairStyle)?.emoji || '💇'

  return (
    <div style={containerStyle}>
      {/* Header Lumi */}
      <div style={{ marginTop: '16px', zIndex: 10 }}>
        <Lumi message={LUMI_MESSAGES[step]} position="center" size="small" />
      </div>

      {/* Avatar preview */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        marginTop: '8px',
        zIndex: 2,
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: player.skinTone,
          border: `5px solid ${player.hairColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          animation: 'breathe 3s ease-in-out infinite',
        }}>
          {hairEmoji}
        </div>
        {player.name && (
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px', marginTop: '4px' }}>
            {player.name} {petEmoji}
          </div>
        )}
      </div>

      {/* Step card */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>{stepTitleMap[step]}</h2>

        {/* Step 0: Skin tone */}
        {step === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {SKIN_TONES.map(tone => (
              <button
                key={tone}
                onClick={() => setPlayer({ skinTone: tone })}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: tone,
                  border: player.skinTone === tone ? '5px solid #FFD700' : '4px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: player.skinTone === tone ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: player.skinTone === tone ? '0 0 18px rgba(255,215,0,0.7)' : '0 2px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                {player.skinTone === tone ? '✓' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Hair style */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%' }}>
            {HAIR_STYLES.map(hs => (
              <button
                key={hs.id}
                onClick={() => setPlayer({ hairStyle: hs.id })}
                style={{
                  padding: '16px',
                  borderRadius: '20px',
                  border: player.hairStyle === hs.id ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
                  background: player.hairStyle === hs.id
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,140,0,0.15))'
                    : 'rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transform: player.hairStyle === hs.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '36px' }}>{hs.emoji}</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', fontFamily: 'Nunito, sans-serif' }}>
                  {hs.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Hair color */}
        {step === 2 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {HAIR_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setPlayer({ hairColor: color })}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: color,
                  border: player.hairColor === color ? '5px solid #FFD700' : '3px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: player.hairColor === color ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: player.hairColor === color ? '0 0 16px rgba(255,215,0,0.7)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                {player.hairColor === color ? '✓' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Pet */}
        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%' }}>
            {PETS.map(pet => (
              <button
                key={pet.id}
                onClick={() => {
                  setPlayer({ petType: pet.id, petName: pet.name })
                  setBouncing(pet.id)
                  setTimeout(() => setBouncing(null), 800)
                  speak(`¡${pet.label}!`)
                }}
                style={{
                  padding: '16px 12px',
                  borderRadius: '20px',
                  border: player.petType === pet.id ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
                  background: player.petType === pet.id
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.15))'
                    : 'rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  fontSize: '44px',
                  animation: bouncing === pet.id ? 'bounce 1.2s ease-in-out infinite' : 'none',
                  display: 'inline-block',
                }}>
                  {pet.emoji}
                </span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>
                  {pet.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Name */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <p style={{ color: 'rgba(200,180,255,0.85)', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>
              ¿Cómo se llama tu personaje?
            </p>
            <input
              type="text"
              value={player.name}
              onChange={e => setPlayer({ name: e.target.value })}
              placeholder="Escribe tu nombre..."
              maxLength={20}
              style={{
                width: '100%',
                minHeight: '60px',
                fontSize: '24px',
                fontWeight: 800,
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '20px',
                border: '3px solid rgba(255,215,0,0.5)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '12px 20px',
                outline: 'none',
                textAlign: 'center',
                caretColor: '#FFD700',
              }}
              autoFocus
            />
            {player.name && (
              <div style={{
                background: 'rgba(255,215,0,0.15)',
                borderRadius: '16px',
                padding: '12px 20px',
                animation: 'fade-in 0.3s ease-out',
              }}>
                <span style={{ color: '#FFD700', fontWeight: 800, fontSize: '18px' }}>
                  {player.name} y su mascota {PETS.find(p => p.id === player.petType)?.emoji} {player.petName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '14px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
          {step > 0 && (
            <button
              className="btn-big"
              onClick={prev}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: '18px',
                flex: 1,
                maxWidth: '160px',
              }}
            >
              ← Anterior
            </button>
          )}
          {step < totalSteps - 1 ? (
            <button
              className="btn-big"
              onClick={next}
              style={{
                background: 'linear-gradient(135deg, #9B59B6, #3498DB)',
                color: '#fff',
                fontSize: '18px',
                flex: 1,
                maxWidth: '200px',
              }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              className="btn-big animate-pulse-glow"
              onClick={handleFinish}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                color: '#fff',
                fontSize: '20px',
                flex: 1,
                maxWidth: '220px',
              }}
            >
              🚀 ¡Comenzar!
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '24px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: i === step ? '#FFD700' : i < step ? '#9B59B6' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
