import React, { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from '../stores/gameStore.js'
import { RobloxCharacter } from '../components/RobloxCharacter.jsx'
import { useVoice } from '../hooks/useVoice.js'

const SKIN_TONES = [
  '#FFDABB', '#F5C09A', '#E8A87C', '#D4875E', '#B86B3E', '#8B4513',
  '#6B3410', '#4A230D', '#FFF0E0', '#C9956C',
]
const HAIR_STYLES = [
  { id: 'short', label: 'Corto', emoji: '✂️' },
  { id: 'long', label: 'Largo', emoji: '💁' },
  { id: 'curly', label: 'Rizado', emoji: '🌀' },
  { id: 'braids', label: 'Trenzas', emoji: '🎀' },
  { id: 'ponytail', label: 'Cola', emoji: '🐴' },
  { id: 'afro', label: 'Afro', emoji: '⭐' },
  { id: 'mohawk', label: 'Mohicano', emoji: '⚡' },
  { id: 'bald', label: 'Calvo', emoji: '😎' },
]
const HAIR_COLORS = [
  '#1a0a00', '#3D1C02', '#6B3A2A', '#8B4513', '#C68642', '#D4A017',
  '#FFD700', '#FF8C00', '#FF4500', '#FF1493', '#9B59B6', '#4169E1',
  '#00CED1', '#2ECC71', '#FFFFFF', '#808080',
]
const CLOTHES_COLORS = [
  { color: '#4A90D9', label: 'Azul' },
  { color: '#E74C3C', label: 'Rojo' },
  { color: '#2ECC71', label: 'Verde' },
  { color: '#F39C12', label: 'Naranja' },
  { color: '#9B59B6', label: 'Morado' },
  { color: '#FF69B4', label: 'Rosa' },
  { color: '#1ABC9C', label: 'Turquesa' },
  { color: '#34495E', label: 'Gris' },
]
const HATS = [
  { id: 'none', label: 'Sin gorro', emoji: '🚫' },
  { id: 'cap', label: 'Gorra', emoji: '🧢' },
  { id: 'crown', label: 'Corona', emoji: '👑' },
  { id: 'bow', label: 'Moño', emoji: '🎀' },
]
const PETS = [
  { id: 'cat', emoji: '🐱', name: 'Naranjo', label: 'Gatito' },
  { id: 'dog', emoji: '🐶', name: 'Manchas', label: 'Perrito' },
  { id: 'rabbit', emoji: '🐰', name: 'Nube', label: 'Conejito' },
  { id: 'chick', emoji: '🐥', name: 'Pipín', label: 'Pollito' },
  { id: 'dragon', emoji: '🐲', name: 'Fuego', label: 'Dragón' },
  { id: 'owl', emoji: '🦉', name: 'Sabio', label: 'Búho' },
]

const LUMI_MESSAGES = [
  '¡Elige el color de tu piel! ¡Todos somos hermosos! 🌈',
  '¿Qué peinado te gusta más? ✨',
  '¿De qué color es tu pelo? 🌟',
  '¡Elige la ropa de tu personaje! 👕',
  '¿Quieres un accesorio especial? 🎩',
  '¡Elige tu mascota compañera! 🐾',
  '¡Ponle un nombre a tu personaje! 📝',
]

function AutoRotate({ children }) {
  const ref = useRef()
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.8 })
  return <group ref={ref}>{children}</group>
}

export function AvatarCreator() {
  const setScreen = useGameStore(s => s.setScreen)
  const setPlayer = useGameStore(s => s.setPlayer)
  const player = useGameStore(s => s.player)
  const { speak } = useVoice()
  const [step, setStep] = useState(0)

  useEffect(() => { speak(LUMI_MESSAGES[step]) }, [step])

  const next = () => { if (step < 6) setStep(s => s + 1) }
  const prev = () => { if (step > 0) setStep(s => s - 1) }

  const handleFinish = () => {
    if (!player.name?.trim()) { speak('¡Ponle un nombre a tu personaje!'); return }
    speak(`¡Genial! ¡${player.name} está listo para la aventura!`)
    setTimeout(() => setScreen('cutscene'), 800)
  }

  const STEPS = ['Piel', 'Peinado', 'Pelo', 'Ropa', 'Gorro', 'Mascota', 'Nombre']

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      background: 'linear-gradient(160deg, #1a0533 0%, #2d1b69 50%, #1a3a5c 100%)',
      overflow: 'hidden', fontFamily: 'Nunito, sans-serif',
    }}>

      {/* 3D Preview panel */}
      <div style={{ width: '40%', height: '100%', position: 'relative', flexShrink: 0 }}>
        <Canvas camera={{ position: [0, 2.2, 5.5], fov: 45 }} gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#a8d8ff" />
          <Suspense fallback={null}>
            <AutoRotate>
              <RobloxCharacter
                skinTone={player.skinTone || '#FFDABB'}
                hairColor={player.hairColor || '#4A2800'}
                hairStyle={player.hairStyle || 'short'}
                clothesColor={player.clothesColor || '#4A90D9'}
                hatStyle={player.hatStyle || 'none'}
              />
            </AutoRotate>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* Decorative ring */}
        <div style={{
          position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 28, background: 'rgba(0,0,0,0.4)',
          borderRadius: '50%', filter: 'blur(6px)',
        }} />

        {player.name && (
          <div style={{
            position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center',
            color: '#FFD700', fontSize: 24, fontWeight: 900,
            textShadow: '0 0 20px rgba(255,215,0,0.9)',
            animation: 'fade-in 0.4s ease-out',
          }}>✨ {player.name} ✨</div>
        )}
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0,
          textAlign: 'center', fontSize: 44,
        }}>
          {PETS.find(p => p.id === player.petType)?.emoji || '🐱'}
        </div>

        <div style={{
          position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center',
          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600,
        }}>🖱️ Arrastra para girar</div>
      </div>

      {/* Config panel */}
      <div style={{
        flex: 1, height: '100%', display: 'flex', flexDirection: 'column',
        padding: '18px 20px 18px 8px', overflowY: 'auto',
      }}>
        <h1 style={{ color: '#FFD700', fontSize: 24, fontWeight: 900, marginBottom: 10, marginTop: 0 }}>
          ¡Crea tu Personaje!
        </h1>

        {/* Steps bar */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {STEPS.map((s, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: i === step ? '#FFD700' : i < step ? '#2ECC71' : 'rgba(255,255,255,0.1)',
              color: i <= step ? '#1a0533' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', border: i === step ? '2px solid white' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>{i < step ? '✓' : (i + 1)}. {s}</div>
          ))}
        </div>

        {/* Lumi tip */}
        <div style={{
          background: 'rgba(255,215,0,0.12)', borderRadius: 14, padding: '10px 14px',
          marginBottom: 14, border: '2px solid rgba(255,215,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>⭐</span>
          <p style={{ color: '#FFE87C', fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
            {LUMI_MESSAGES[step]}
          </p>
        </div>

        {/* Step 0: Skin */}
        {step === 0 && (
          <div>
            <Label>Color de piel</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {SKIN_TONES.map(tone => (
                <div key={tone} onClick={() => setPlayer({ skinTone: tone })} style={{
                  aspectRatio: '1', borderRadius: 12, background: tone, cursor: 'pointer',
                  border: player.skinTone === tone ? '3px solid #FFD700' : '3px solid rgba(255,255,255,0.15)',
                  boxShadow: player.skinTone === tone ? '0 0 14px rgba(255,215,0,0.8)' : '0 2px 6px rgba(0,0,0,0.3)',
                  transform: player.skinTone === tone ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>{player.skinTone === tone ? '✓' : ''}</div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Hair style */}
        {step === 1 && (
          <div>
            <Label>Peinado</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {HAIR_STYLES.map(h => (
                <div key={h.id} onClick={() => setPlayer({ hairStyle: h.id })} style={{
                  background: player.hairStyle === h.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
                  border: player.hairStyle === h.id ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '10px 6px', cursor: 'pointer', textAlign: 'center',
                  transform: player.hairStyle === h.id ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.18s',
                }}>
                  <div style={{ fontSize: 22 }}>{h.emoji}</div>
                  <div style={{ color: 'white', fontSize: 11, fontWeight: 700, marginTop: 3 }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Hair color */}
        {step === 2 && (
          <div>
            <Label>Color del pelo</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
              {HAIR_COLORS.map(color => (
                <div key={color} onClick={() => setPlayer({ hairColor: color })} style={{
                  aspectRatio: '1', borderRadius: '50%', background: color, cursor: 'pointer',
                  border: player.hairColor === color ? '3px solid #FFD700' : '3px solid rgba(255,255,255,0.15)',
                  boxShadow: player.hairColor === color ? '0 0 14px rgba(255,215,0,0.8)' : '0 2px 6px rgba(0,0,0,0.4)',
                  transform: player.hairColor === color ? 'scale(1.18)' : 'scale(1)',
                  transition: 'all 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, textShadow: '0 0 4px black',
                }}>{player.hairColor === color ? '✓' : ''}</div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Clothes */}
        {step === 3 && (
          <div>
            <Label>Color de ropa</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {CLOTHES_COLORS.map(c => (
                <div key={c.color} onClick={() => setPlayer({ clothesColor: c.color })} style={{
                  background: c.color, borderRadius: 14, padding: '16px 6px', cursor: 'pointer', textAlign: 'center',
                  border: player.clothesColor === c.color ? '3px solid #FFD700' : '3px solid rgba(255,255,255,0.15)',
                  boxShadow: player.clothesColor === c.color ? '0 0 14px rgba(255,215,0,0.8)' : '0 2px 6px rgba(0,0,0,0.3)',
                  transform: player.clothesColor === c.color ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.18s',
                }}>
                  <div style={{ color: 'white', fontSize: 12, fontWeight: 900, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                    {player.clothesColor === c.color ? '✓ ' : ''}{c.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Hat */}
        {step === 4 && (
          <div>
            <Label>Accesorio especial</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {HATS.map(h => (
                <div key={h.id} onClick={() => setPlayer({ hatStyle: h.id })} style={{
                  background: player.hatStyle === h.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
                  border: player.hatStyle === h.id ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '14px 10px', cursor: 'pointer', textAlign: 'center',
                  transform: player.hatStyle === h.id ? 'scale(1.04)' : 'scale(1)', transition: 'all 0.18s',
                }}>
                  <div style={{ fontSize: 32 }}>{h.emoji}</div>
                  <div style={{ color: 'white', fontSize: 13, fontWeight: 700, marginTop: 5 }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Pet */}
        {step === 5 && (
          <div>
            <Label>Tu mascota compañera</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {PETS.map(pet => (
                <div key={pet.id} onClick={() => setPlayer({ petType: pet.id, petName: pet.name })} style={{
                  background: player.petType === pet.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
                  border: player.petType === pet.id ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '12px 6px', cursor: 'pointer', textAlign: 'center',
                  transform: player.petType === pet.id ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.18s',
                }}>
                  <div style={{ fontSize: 32 }}>{pet.emoji}</div>
                  <div style={{ color: '#FFE87C', fontSize: 12, fontWeight: 800, marginTop: 3 }}>{pet.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{pet.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Name */}
        {step === 6 && (
          <div>
            <Label>Nombre del personaje</Label>
            <input
              type="text"
              placeholder="¿Cómo se llama? ✏️"
              value={player.name || ''}
              onChange={e => setPlayer({ name: e.target.value })}
              maxLength={16}
              style={{
                width: '100%', padding: '14px 18px', fontSize: 20, fontWeight: 800,
                fontFamily: 'Nunito, sans-serif', borderRadius: 16,
                border: '3px solid rgba(255,215,0,0.5)', background: 'rgba(255,255,255,0.1)',
                color: 'white', outline: 'none', boxSizing: 'border-box', marginBottom: 12,
                caretColor: '#FFD700',
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
              {['Luna', 'Sol', 'Arco', 'Rayo', 'Nova', 'Kira'].map(name => (
                <button key={name} onClick={() => setPlayer({ name })} style={{
                  background: 'rgba(255,215,0,0.12)', border: '2px solid rgba(255,215,0,0.3)',
                  borderRadius: 10, padding: '9px 6px', color: '#FFE87C', fontSize: 13,
                  fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                }}>{name}</button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          {step > 0 && (
            <button onClick={prev} style={navBtn('rgba(255,255,255,0.12)', 'white')}>
              ← Anterior
            </button>
          )}
          {step < 6 ? (
            <button onClick={next} style={{ ...navBtn('#FFD700', '#1a0533'), flex: 1 }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={handleFinish} style={{ ...navBtn('#FFD700', '#1a0533'), flex: 1, fontSize: 17 }}>
              ¡Listo! ¡A Jugar! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 700, marginBottom: 9, marginTop: 0 }}>{children}</p>
}

const navBtn = (bg, color) => ({
  padding: '13px 18px', borderRadius: 14, fontSize: 15, fontWeight: 900,
  fontFamily: 'Nunito, sans-serif', cursor: 'pointer', border: 'none',
  background: bg, color, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
})
