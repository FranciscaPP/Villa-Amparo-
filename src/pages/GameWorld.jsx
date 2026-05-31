import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useGameStore } from '../stores/gameStore.js'
import { RobloxCharacter } from '../components/RobloxCharacter.jsx'
import { useVoice } from '../hooks/useVoice.js'
import * as THREE from 'three'

const ZONES = [
  { id: 'letterforest', name: 'Bosque de Letras', color: '#27AE60', lightColor: '#A8E6CF', pos: [-30, 0, -30], emoji: '🌳', description: '¡Aprende las letras!' },
  { id: 'numbers', name: 'Playa de Números', color: '#F39C12', lightColor: '#FFE4A0', pos: [32, 0, -28], emoji: '🔢', description: '¡Suma y resta!' },
  { id: 'mountain', name: 'Montaña Mágica', color: '#9B59B6', lightColor: '#D7BDE2', pos: [35, 0, 28], emoji: '⛰️', description: '¡Rompecabezas!' },
  { id: 'village', name: 'Aldea Musical', color: '#E74C3C', lightColor: '#FADBD8', pos: [-28, 0, 32], emoji: '🎵', description: '¡Música y ritmo!' },
  { id: 'garden', name: 'Jardín Mágico', color: '#FF69B4', lightColor: '#FFD1E8', pos: [0, 0, -45], emoji: '🌺', description: '¡Palabras y lectura!' },
  { id: 'river', name: 'Río del Tiempo', color: '#3498DB', lightColor: '#AED6F1', pos: [45, 0, 0], emoji: '🌊', description: '¡Comprensión!' },
  { id: 'castle', name: 'Castillo del Arte', color: '#E67E22', lightColor: '#FAD7A0', pos: [0, 0, 45], emoji: '🏰', description: '¡Colores y arte!' },
  { id: 'home', name: 'Mi Casa', color: '#16A085', lightColor: '#A2D9CE', pos: [-45, 0, 0], emoji: '🏠', description: '¡Tu hogar!' },
]

function Ground() {
  return (
    <>
      {/* Main grass plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>
      {/* Path crosses */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[6, 200]} />
        <meshLambertMaterial color="#D4A96A" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[200, 6]} />
        <meshLambertMaterial color="#D4A96A" />
      </mesh>
      {/* Center plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshLambertMaterial color="#C8A96A" />
      </mesh>
      {/* Outer border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <ringGeometry args={[98, 100, 64]} />
        <meshLambertMaterial color="#2E7D32" />
      </mesh>
    </>
  )
}

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.6, 6]} />
        <meshLambertMaterial color="#6D4C41" />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <dodecahedronGeometry args={[1.4, 0]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshLambertMaterial color="#43A047" />
      </mesh>
    </group>
  )
}

function ZonePlatform({ zone }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5 + zone.pos[0]) * 0.08
    }
  })

  return (
    <group position={[zone.pos[0], 0, zone.pos[2]]}>
      {/* Platform base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 1.2, 14]} />
        <meshLambertMaterial color={zone.color} />
      </mesh>
      {/* Platform top */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[14.4, 0.3, 14.4]} />
        <meshLambertMaterial color={zone.lightColor} />
      </mesh>
      {/* Sign post */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 6]} />
        <meshLambertMaterial color="#8D6E63" />
      </mesh>
      {/* Sign board */}
      <mesh ref={meshRef} position={[0, 3.4, 0]}>
        <boxGeometry args={[4.5, 1.4, 0.2]} />
        <meshLambertMaterial color={zone.lightColor} />
      </mesh>
      {/* Decorative pillars */}
      {[[-5.5, 0, -5.5], [5.5, 0, -5.5], [-5.5, 0, 5.5], [5.5, 0, 5.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, 1.5, z]} castShadow>
          <boxGeometry args={[0.8, 3.2, 0.8]} />
          <meshLambertMaterial color={zone.color} />
        </mesh>
      ))}
      {/* Emoji float */}
      <EmojiSign emoji={zone.emoji} position={[0, 5.2, 0]} />
    </group>
  )
}

function EmojiSign({ emoji, position }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.2
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshLambertMaterial color="rgba(255,255,200,0.9)" transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

function CenterFountain() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.3
  })
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[3, 3.5, 0.6, 16]} />
        <meshLambertMaterial color="#B0BEC5" />
      </mesh>
      {/* Column */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 8]} />
        <meshLambertMaterial color="#90A4AE" />
      </mesh>
      {/* Star on top */}
      <group ref={ref} position={[0, 2.5, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color="#FFB300" />
        </mesh>
      </group>
      {/* Water circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshLambertMaterial color="#29B6F6" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function WorldTrees() {
  const positions = []
  const rng = (() => { let s = 42; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff } })()

  for (let i = 0; i < 80; i++) {
    const angle = rng() * Math.PI * 2
    const r = 12 + rng() * 82
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const skip = ZONES.some(zone => Math.hypot(x - zone.pos[0], z - zone.pos[2]) < 12)
    const onPath = Math.abs(x) < 5 || Math.abs(z) < 5
    if (!skip && !onPath && r < 95) positions.push([x, 0, z])
  }

  return <>{positions.map((pos, i) => <Tree key={i} position={pos} />)}</>
}

function PlayerController({ playerRef, onZoneEnter }) {
  const keysRef = useRef({})
  const velRef = useRef({ x: 0, z: 0 })
  const isMovingRef = useRef(false)
  const player = useGameStore(s => s.player)
  const { camera } = useThree()

  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true }
    const up = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // Expose move function for joystick
  useEffect(() => {
    window.__playerMove = (dx, dz) => {
      velRef.current.x += dx * 0.18
      velRef.current.z += dz * 0.18
    }
    return () => { delete window.__playerMove }
  }, [])

  useFrame((_, delta) => {
    const keys = keysRef.current
    const speed = 7 * delta

    let dx = 0, dz = 0
    if (keys['w'] || keys['W'] || keys['ArrowUp']) dz -= speed
    if (keys['s'] || keys['S'] || keys['ArrowDown']) dz += speed
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx -= speed
    if (keys['d'] || keys['D'] || keys['ArrowRight']) dx += speed

    velRef.current.x = velRef.current.x * 0.82 + dx
    velRef.current.z = velRef.current.z * 0.82 + dz

    const moving = Math.abs(velRef.current.x) > 0.004 || Math.abs(velRef.current.z) > 0.004
    isMovingRef.current = moving

    if (playerRef.current) {
      const nx = playerRef.current.position.x + velRef.current.x
      const nz = playerRef.current.position.z + velRef.current.z
      const bound = 94
      playerRef.current.position.x = Math.max(-bound, Math.min(bound, nx))
      playerRef.current.position.z = Math.max(-bound, Math.min(bound, nz))

      if (moving) {
        const angle = Math.atan2(velRef.current.x, velRef.current.z) + Math.PI
        playerRef.current.rotation.y += (angle - playerRef.current.rotation.y) * 0.18
      }

      // Camera follow (third-person)
      const camTarget = new THREE.Vector3(
        playerRef.current.position.x,
        playerRef.current.position.y + 10,
        playerRef.current.position.z + 14
      )
      camera.position.lerp(camTarget, 0.08)
      camera.lookAt(
        playerRef.current.position.x,
        playerRef.current.position.y + 1.5,
        playerRef.current.position.z
      )

      // Zone detection
      for (const zone of ZONES) {
        const dist = Math.hypot(
          playerRef.current.position.x - zone.pos[0],
          playerRef.current.position.z - zone.pos[2]
        )
        if (dist < 8) { onZoneEnter(zone); return }
      }
      onZoneEnter(null)
    }
  })

  return (
    <group ref={playerRef} position={[0, 0.1, 0]}>
      <RobloxCharacter
        skinTone={player.skinTone || '#FFDABB'}
        hairColor={player.hairColor || '#4A2800'}
        hairStyle={player.hairStyle || 'short'}
        clothesColor={player.clothesColor || '#4A90D9'}
        hatStyle={player.hatStyle || 'none'}
        isMoving={true}
      />
    </group>
  )
}

function Scene({ playerRef, onZoneEnter }) {
  return (
    <>
      {/* Sky */}
      <Sky sunPosition={[100, 50, 100]} turbidity={6} rayleigh={0.5} />

      {/* Lights */}
      <ambientLight intensity={0.9} color="#fff8f0" />
      <directionalLight position={[30, 50, 20]} intensity={1.4} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={200}
        shadow-camera-left={-100} shadow-camera-right={100}
        shadow-camera-top={100} shadow-camera-bottom={-100}
      />
      <hemisphereLight skyColor="#87CEEB" groundColor="#4CAF50" intensity={0.6} />

      <Suspense fallback={null}>
        <Ground />
        <WorldTrees />
        {ZONES.map(zone => <ZonePlatform key={zone.id} zone={zone} />)}
        <CenterFountain />
        <PlayerController playerRef={playerRef} onZoneEnter={onZoneEnter} />
      </Suspense>
    </>
  )
}

export function GameWorld() {
  const setScreen = useGameStore(s => s.setScreen)
  const player = useGameStore(s => s.player)
  const coins = useGameStore(s => s.coins)
  const level = useGameStore(s => s.level)
  const { speak } = useVoice()
  const playerRef = useRef()
  const [nearZone, setNearZone] = useState(null)
  const [lastZone, setLastZone] = useState(null)

  const handleZoneEnter = (zone) => {
    if (zone?.id !== lastZone?.id) {
      setNearZone(zone)
      setLastZone(zone)
      if (zone) speak(`${zone.name}. ${zone.description}`)
    } else if (!zone && lastZone) {
      setNearZone(null)
      setLastZone(null)
    }
  }

  const enterZone = () => {
    if (!nearZone) return
    if (nearZone.id === 'home') { setScreen('home'); return }
    if (nearZone.id === 'letterforest') { setScreen('letterforest'); return }
    speak(`¡Entrando a ${nearZone.name}!`)
  }

  // On-screen joystick state
  const joystickRef = useRef(null)
  const [joystickActive, setJoystickActive] = useState(false)
  const touchIdRef = useRef(null)

  const handleJoystickStart = (e) => {
    const touch = e.changedTouches?.[0] || e
    touchIdRef.current = touch.identifier ?? 0
    setJoystickActive(true)
  }

  const handleJoystickMove = (e) => {
    if (!joystickActive) return
    const touch = Array.from(e.touches || []).find(t => t.identifier === touchIdRef.current)
    if (!touch || !joystickRef.current) return
    const rect = joystickRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (touch.clientX - cx) / (rect.width / 2)
    const dz = (touch.clientY - cy) / (rect.height / 2)
    if (window.__playerMove) window.__playerMove(dx * 0.4, dz * 0.4)
  }

  const handleJoystickEnd = () => { setJoystickActive(false); touchIdRef.current = null }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#87CEEB' }}>
      <Canvas
        shadows
        camera={{ position: [0, 10, 14], fov: 60, near: 0.1, far: 500 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
      >
        <Scene playerRef={playerRef} onZoneEnter={handleZoneEnter} />
      </Canvas>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 70, right: 16,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
        borderRadius: 18, padding: '10px 16px', display: 'flex',
        flexDirection: 'column', gap: 6, border: '2px solid rgba(255,255,255,0.15)',
      }}>
        <div style={{ color: '#FFD700', fontSize: 18, fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>
          🪙 {coins}
        </div>
        <div style={{ color: '#A8E6CF', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>
          ⭐ Nivel {level}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Nunito, sans-serif' }}>
          {player.name || 'Jugador'}
        </div>
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 130, right: 16,
        background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: '8px 12px',
        color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Nunito, sans-serif',
        fontWeight: 700,
      }}>
        WASD / ↑↓←→ para moverse
      </div>

      {/* Zone prompt */}
      {nearZone && (
        <div style={{
          position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          borderRadius: 24, padding: '16px 28px', textAlign: 'center',
          border: `3px solid ${nearZone.color}`,
          boxShadow: `0 0 30px ${nearZone.color}88`,
          animation: 'slide-up 0.3s ease-out',
          maxWidth: '80vw',
        }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>{nearZone.emoji}</div>
          <div style={{ color: 'white', fontSize: 20, fontWeight: 900, fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>
            {nearZone.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
            {nearZone.description}
          </div>
          <button onClick={enterZone} style={{
            background: nearZone.color, border: 'none', borderRadius: 14,
            padding: '11px 28px', color: 'white', fontSize: 17, fontWeight: 900,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: `0 4px 16px ${nearZone.color}88`,
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }}>
            ¡Entrar! {nearZone.emoji}
          </button>
        </div>
      )}

      {/* Mobile joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        style={{
          position: 'absolute', bottom: 24, left: 24,
          width: 110, height: 110, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '3px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer', touchAction: 'none',
        }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: joystickActive ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.3)',
          border: '2px solid rgba(255,255,255,0.5)',
          transition: 'background 0.1s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'white',
        }}>🕹️</div>
      </div>

      {/* Mobile d-pad buttons */}
      <div style={{ position: 'absolute', bottom: 24, left: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {[['↑', 0, -1], ['↓', 0, 1]].map(([label, dx, dz]) => (
          <button key={label}
            onTouchStart={() => window.__playerMove?.(dx * 0.5, dz * 0.5)}
            onClick={() => window.__playerMove?.(dx * 0.5, dz * 0.5)}
            style={dpadBtn}>{label}</button>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 58, left: 160, display: 'flex', gap: 4 }}>
        {[['←', -1, 0], ['→', 1, 0]].map(([label, dx, dz]) => (
          <button key={label}
            onTouchStart={() => window.__playerMove?.(dx * 0.5, dz * 0.5)}
            onClick={() => window.__playerMove?.(dx * 0.5, dz * 0.5)}
            style={dpadBtn}>{label}</button>
        ))}
      </div>
    </div>
  )
}

const dpadBtn = {
  width: 44, height: 44, borderRadius: 10, border: '2px solid rgba(255,255,255,0.3)',
  background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 20, fontWeight: 900,
  cursor: 'pointer', touchAction: 'manipulation', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
}
