import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { HUD } from '../components/HUD.jsx'
import { Lumi } from '../components/Lumi.jsx'

const WORLD_W = 1200
const WORLD_H = 800
const PLAYER_SPEED = 3.5
const FRICTION = 0.85

const ZONES = {
  letterForest: { x: 80, y: 200, w: 260, h: 340, label: '🌲 Bosque de Letras', color: '#2d5a27', screen: 'letterforest' },
  mathIsland: { x: 860, y: 200, w: 260, h: 340, label: '🔢 Isla Matemática', color: '#1a3a6e', screen: null, locked: true },
  home: { x: 500, y: 80, w: 200, h: 160, label: '🏠 Tu Casa', color: '#8B4513', screen: 'home' },
}

const NPC = { x: 550, y: 420, emoji: '👴', name: 'Don Tomas', message: '¡Hola explorador! Las letras se escaparon al bosque...' }

function drawWorld(ctx, W, H) {
  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.4)
  skyGrad.addColorStop(0, '#87CEEB')
  skyGrad.addColorStop(1, '#B0E2FF')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, W, H * 0.35)

  // Ground
  const groundGrad = ctx.createLinearGradient(0, H * 0.35, 0, H)
  groundGrad.addColorStop(0, '#5DBB63')
  groundGrad.addColorStop(0.4, '#4aA050')
  groundGrad.addColorStop(1, '#3d8040')
  ctx.fillStyle = groundGrad
  ctx.fillRect(0, H * 0.35, W, H * 0.65)

  // Grass patches
  const patches = [
    [150, 320, 60, 30], [400, 450, 80, 35], [700, 360, 55, 25],
    [900, 500, 70, 30], [300, 600, 90, 35], [650, 580, 65, 28],
  ]
  ctx.fillStyle = '#3d9443'
  patches.forEach(([x, y, w, h]) => {
    ctx.beginPath()
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // Paths (dirt)
  ctx.fillStyle = '#D2B48C'
  // Horizontal main path
  ctx.beginPath()
  ctx.roundRect(200, 480, 800, 36, 10)
  ctx.fill()
  // Vertical path to home
  ctx.beginPath()
  ctx.roundRect(585, 240, 30, 260, 8)
  ctx.fill()
  // Path to letter forest
  ctx.beginPath()
  ctx.roundRect(200, 460, 380, 30, 8)
  ctx.fill()

  // Letter Forest zone
  const lf = ZONES.letterForest
  const lfGrad = ctx.createLinearGradient(lf.x, lf.y, lf.x, lf.y + lf.h)
  lfGrad.addColorStop(0, '#1a3d18')
  lfGrad.addColorStop(1, '#2d5a27')
  ctx.fillStyle = lfGrad
  ctx.beginPath()
  ctx.roundRect(lf.x, lf.y, lf.w, lf.h, 20)
  ctx.fill()
  ctx.strokeStyle = '#5DBB63'
  ctx.lineWidth = 3
  ctx.stroke()
  // Trees in forest
  const trees = [[100, 240], [140, 290], [180, 250], [240, 260], [120, 340], [200, 380], [160, 430], [240, 420], [110, 470]]
  trees.forEach(([tx, ty]) => {
    ctx.fillStyle = '#1a3d18'
    ctx.beginPath()
    ctx.arc(tx, ty, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2d6b28'
    ctx.beginPath()
    ctx.arc(tx - 4, ty - 4, 18, 0, Math.PI * 2)
    ctx.fill()
  })

  // Math Island zone (locked/gray)
  const mi = ZONES.mathIsland
  const miGrad = ctx.createLinearGradient(mi.x, mi.y, mi.x, mi.y + mi.h)
  miGrad.addColorStop(0, '#1a2a4a')
  miGrad.addColorStop(1, '#1e3060')
  ctx.fillStyle = miGrad
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.roundRect(mi.x, mi.y, mi.w, mi.h, 20)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.strokeStyle = '#4466AA'
  ctx.lineWidth = 3
  ctx.stroke()
  // Lock icon
  ctx.font = '36px serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'center'
  ctx.fillText('🔒', mi.x + mi.w / 2, mi.y + mi.h / 2 + 12)

  // Home zone
  const hz = ZONES.home
  // House base
  ctx.fillStyle = '#C8A96E'
  ctx.beginPath()
  ctx.roundRect(hz.x, hz.y + 50, hz.w, hz.h - 50, 8)
  ctx.fill()
  // Roof
  ctx.fillStyle = '#FF6B6B'
  ctx.beginPath()
  ctx.moveTo(hz.x - 10, hz.y + 55)
  ctx.lineTo(hz.x + hz.w / 2, hz.y)
  ctx.lineTo(hz.x + hz.w + 10, hz.y + 55)
  ctx.closePath()
  ctx.fill()
  // Door
  ctx.fillStyle = '#4A2800'
  ctx.beginPath()
  ctx.roundRect(hz.x + hz.w / 2 - 15, hz.y + 140, 30, 50, [10, 10, 0, 0])
  ctx.fill()
  // Windows
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(hz.x + 30, hz.y + 70, 30, 28)
  ctx.fillRect(hz.x + hz.w - 60, hz.y + 70, 30, 28)

  // Villa Amparo central building
  const cx = W / 2 - 50, cy = H * 0.42
  ctx.fillStyle = '#E8DCC8'
  ctx.beginPath()
  ctx.roundRect(cx - 60, cy, 200, 120, 10)
  ctx.fill()
  ctx.fillStyle = '#FF8C00'
  ctx.beginPath()
  ctx.moveTo(cx - 75, cy + 10)
  ctx.lineTo(cx + 40, cy - 55)
  ctx.lineTo(cx + 155, cy + 10)
  ctx.closePath()
  ctx.fill()
  // Sign
  ctx.fillStyle = '#4A2800'
  ctx.font = 'bold 13px Nunito, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Villa Amparo', cx + 40, cy + 60)
  ctx.font = '10px Nunito, sans-serif'
  ctx.fillStyle = '#666'
  ctx.fillText('Centro de Aprendizaje', cx + 40, cy + 78)

  // Flowers
  const flowers = ['🌸', '🌼', '🌺', '🌻']
  const flowerPos = [[260, 510], [320, 560], [720, 520], [820, 560], [450, 640], [700, 640]]
  ctx.font = '22px serif'
  flowerPos.forEach(([fx, fy], i) => {
    ctx.fillText(flowers[i % flowers.length], fx, fy)
  })

  // Clouds
  const cloudDraw = (x, y, s) => {
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.arc(x, y, s * 20, 0, Math.PI * 2)
    ctx.arc(x + s * 22, y, s * 16, 0, Math.PI * 2)
    ctx.arc(x + s * 44, y, s * 18, 0, Math.PI * 2)
    ctx.arc(x + s * 22, y - s * 10, s * 20, 0, Math.PI * 2)
    ctx.fill()
  }
  cloudDraw(80, 50, 1)
  cloudDraw(400, 30, 0.9)
  cloudDraw(750, 60, 1.1)
  cloudDraw(1050, 40, 0.8)

  // NPC
  ctx.font = '34px serif'
  ctx.textAlign = 'center'
  ctx.fillText(NPC.emoji, NPC.x, NPC.y)
}

function drawPlayer(ctx, x, y, skinTone) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(x, y + 20, 18, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body
  ctx.fillStyle = skinTone || '#FDBCB4'
  ctx.beginPath()
  ctx.arc(x, y, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,215,0,0.7)'
  ctx.lineWidth = 3
  ctx.stroke()

  // Face
  ctx.font = '18px serif'
  ctx.textAlign = 'center'
  ctx.fillText('😊', x, y + 6)

  // Glow
  const glowGrad = ctx.createRadialGradient(x, y, 10, x, y, 28)
  glowGrad.addColorStop(0, 'rgba(255,215,0,0.2)')
  glowGrad.addColorStop(1, 'rgba(255,215,0,0)')
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(x, y, 28, 0, Math.PI * 2)
  ctx.fill()
}

function drawMinimap(ctx, playerX, playerY, W, H, canvasW, canvasH) {
  const mmW = 140, mmH = 90, mmX = canvasW - mmW - 12, mmY = canvasH - mmH - 12
  const scaleX = mmW / W, scaleY = mmH / H

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.beginPath()
  ctx.roundRect(mmX - 4, mmY - 4, mmW + 8, mmH + 8, 8)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,215,0,0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Ground
  ctx.fillStyle = '#3d8040'
  ctx.fillRect(mmX, mmY, mmW, mmH)

  // Zones
  Object.values(ZONES).forEach(z => {
    ctx.fillStyle = z.color
    ctx.globalAlpha = 0.7
    ctx.fillRect(mmX + z.x * scaleX, mmY + z.y * scaleY, z.w * scaleX, z.h * scaleY)
    ctx.globalAlpha = 1
  })

  // Player dot
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(mmX + playerX * scaleX, mmY + playerY * scaleY, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

export function GameWorld() {
  const setScreen = useGameStore(s => s.setScreen)
  const player = useGameStore(s => s.player)
  const canvasRef = useRef(null)
  const stateRef = useRef({
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    vx: 0,
    vy: 0,
    keys: {},
    animFrame: null,
    nearZone: null,
    nearNPC: false,
    zoneEntryTimer: null,
  })
  const [nearZone, setNearZone] = useState(null)
  const [nearNPC, setNearNPC] = useState(false)
  const [lumiMsg, setLumiMsg] = useState('¡Usa las teclas o toca para moverte! El Bosque de Letras te espera.')

  const handleKeyDown = useCallback(e => {
    stateRef.current.keys[e.key] = true
    e.preventDefault()
  }, [])

  const handleKeyUp = useCallback(e => {
    stateRef.current.keys[e.key] = false
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let animId

    const loop = () => {
      const s = stateRef.current
      const keys = s.keys

      // Movement
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) s.vx -= PLAYER_SPEED
      if (keys['ArrowRight'] || keys['d'] || keys['D']) s.vx += PLAYER_SPEED
      if (keys['ArrowUp'] || keys['w'] || keys['W']) s.vy -= PLAYER_SPEED
      if (keys['ArrowDown'] || keys['s'] || keys['S']) s.vy += PLAYER_SPEED

      s.vx *= FRICTION
      s.vy *= FRICTION

      s.x = Math.max(20, Math.min(WORLD_W - 20, s.x + s.vx))
      s.y = Math.max(20, Math.min(WORLD_H - 20, s.y + s.vy))

      // Camera offset (center player)
      const cW = canvas.width, cH = canvas.height
      const camX = Math.max(0, Math.min(WORLD_W - cW, s.x - cW / 2))
      const camY = Math.max(0, Math.min(WORLD_H - cH, s.y - cH / 2))

      // Clear
      ctx.clearRect(0, 0, cW, cH)
      ctx.save()
      ctx.translate(-camX, -camY)

      drawWorld(ctx, WORLD_W, WORLD_H)

      // Zone labels
      Object.entries(ZONES).forEach(([key, z]) => {
        const inZone = s.x > z.x && s.x < z.x + z.w && s.y > z.y && s.y < z.y + z.h
        ctx.save()
        ctx.globalAlpha = inZone ? 1 : 0.75
        ctx.fillStyle = inZone ? '#FFD700' : 'rgba(255,255,255,0.85)'
        ctx.font = `bold 15px Nunito, sans-serif`
        ctx.textAlign = 'center'
        const shadow = inZone ? 'rgba(255,215,0,0.8)' : 'rgba(0,0,0,0.5)'
        ctx.shadowColor = shadow
        ctx.shadowBlur = inZone ? 12 : 4
        ctx.fillText(z.label, z.x + z.w / 2, z.y - 10)
        ctx.restore()

        if (inZone && s.nearZone !== key) {
          s.nearZone = key
          setNearZone(key)
          if (!z.locked) {
            setLumiMsg(`¡Estás cerca de ${z.label}! Pulsa ENTER o el botón para entrar.`)
          }
        }
        if (!inZone && s.nearZone === key) {
          s.nearZone = null
          setNearZone(null)
        }
      })

      // NPC check
      const npcDist = Math.hypot(s.x - NPC.x, s.y - NPC.y)
      if (npcDist < 70 && !s.nearNPC) {
        s.nearNPC = true
        setNearNPC(true)
        setLumiMsg(NPC.message)
      } else if (npcDist >= 70 && s.nearNPC) {
        s.nearNPC = false
        setNearNPC(false)
      }

      // NPC speech bubble
      if (npcDist < 70) {
        ctx.save()
        ctx.fillStyle = 'rgba(255,253,245,0.95)'
        ctx.strokeStyle = 'rgba(255,215,0,0.7)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(NPC.x - 110, NPC.y - 100, 220, 58, 12)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#2d1b69'
        ctx.font = 'bold 11px Nunito, sans-serif'
        ctx.textAlign = 'center'
        const words = NPC.message.split(' ')
        const line1 = words.slice(0, 5).join(' ')
        const line2 = words.slice(5).join(' ')
        ctx.fillText(line1, NPC.x, NPC.y - 76)
        ctx.fillText(line2, NPC.x, NPC.y - 58)
        ctx.restore()
      }

      drawPlayer(ctx, s.x, s.y, player.skinTone)

      ctx.restore()

      // Mini-map
      drawMinimap(ctx, s.x, s.y, WORLD_W, WORLD_H, cW, cH)

      animId = requestAnimationFrame(loop)
    }

    loop()

    const handleEnter = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const s = stateRef.current
        if (s.nearZone) {
          const zone = ZONES[s.nearZone]
          if (zone && !zone.locked && zone.screen) {
            setScreen(zone.screen)
          }
        }
      }
    }
    window.addEventListener('keydown', handleEnter)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handleEnter)
    }
  }, [player.skinTone, setScreen])

  // Touch/click movement
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    const s = stateRef.current
    const cW = canvas.width, cH = canvas.height
    const camX = Math.max(0, Math.min(WORLD_W - cW, s.x - cW / 2))
    const camY = Math.max(0, Math.min(WORLD_H - cH, s.y - cH / 2))
    const worldX = clickX + camX
    const worldY = clickY + camY
    const dx = worldX - s.x
    const dy = worldY - s.y
    const dist = Math.hypot(dx, dy)
    if (dist > 10) {
      s.vx += (dx / dist) * PLAYER_SPEED * 4
      s.vy += (dy / dist) * PLAYER_SPEED * 4
    }
  }

  const enterZone = () => {
    if (nearZone && ZONES[nearZone] && !ZONES[nearZone].locked) {
      setScreen(ZONES[nearZone].screen)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', cursor: 'crosshair' }}
        onClick={handleCanvasClick}
      />

      <HUD zoneName="Villa Amparo" />

      <Lumi message={lumiMsg} position="corner" size="small" />

      {/* Zone entry button */}
      {nearZone && ZONES[nearZone] && !ZONES[nearZone].locked && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce-in 0.4s ease-out',
          zIndex: 50,
        }}>
          <button
            className="btn-big animate-pulse-glow"
            onClick={enterZone}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              color: '#fff',
              fontSize: '20px',
              padding: '16px 40px',
              boxShadow: '0 8px 28px rgba(255,140,0,0.5)',
            }}
          >
            {ZONES[nearZone].label} →
          </button>
        </div>
      )}

      {/* Locked zone info */}
      {nearZone && ZONES[nearZone]?.locked && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '20px',
          padding: '14px 28px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          zIndex: 50,
          border: '2px solid rgba(255,255,255,0.2)',
        }}>
          🔒 ¡Completa el Bosque de Letras primero!
        </div>
      )}

      {/* Controls hint */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '12px',
        padding: '8px 14px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 600,
        zIndex: 20,
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        🕹 WASD / Flechas o toca el mapa para moverte
      </div>
    </div>
  )
}
