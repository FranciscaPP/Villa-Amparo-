import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { HUD } from '../components/HUD.jsx'
import { Lumi } from '../components/Lumi.jsx'
import { LETTERS } from '../data/letters.js'
import { useVoice } from '../hooks/useVoice.js'

const MINIGAME_TYPES = ['letter_recognition', 'word_image', 'phonics']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function initLetterBubbles(canvasW, canvasH) {
  return LETTERS.map((ld) => ({
    letter: ld.letter,
    color: ld.color,
    x: randomBetween(80, canvasW - 80),
    y: randomBetween(120, canvasH - 100),
    vx: (Math.random() - 0.5) * 1.8,
    vy: (Math.random() - 0.5) * 1.8,
    radius: 44,
    popped: false,
    popAnim: 0,
    scale: 1,
    bouncing: false,
  }))
}

export function LetterForest() {
  const setScreen = useGameStore(s => s.setScreen)
  const goToMinigame = useGameStore(s => s.goToMinigame)
  const lettersLearned = useGameStore(s => s.lettersLearned)
  const { speak } = useVoice()

  const canvasRef = useRef(null)
  const bubblesRef = useRef([])
  const animRef = useRef(null)
  const [fogOffset, setFogOffset] = useState(0)
  const [lumiMsg] = useState('¡Las letras están escondidas aquí! Toca una letra para atraparla.')

  useEffect(() => {
    speak('¡Las letras están escondidas aquí! Toca una letra para atraparla.')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (bubblesRef.current.length === 0) {
        bubblesRef.current = initLetterBubbles(canvas.width, canvas.height)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let fog = 0

    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Forest background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, '#0a1f0a')
      bgGrad.addColorStop(0.4, '#0d2e0d')
      bgGrad.addColorStop(1, '#0a1a0a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Tree silhouettes background
      const treePositions = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380]
      treePositions.forEach((tx, i) => {
        const treeH = 200 + (i % 4) * 50
        const treeW = 40 + (i % 3) * 20
        ctx.fillStyle = i % 2 === 0 ? '#0a2a0a' : '#0d380d'
        // Trunk
        ctx.fillRect(tx + treeW / 2 - 6, H - treeH, 12, treeH)
        // Canopy layers
        for (let layer = 0; layer < 3; layer++) {
          const layerW = treeW + layer * 20
          const layerH = treeH * 0.35
          const layerY = H - treeH - layerH * 0.5 + layer * (layerH * 0.4)
          ctx.beginPath()
          ctx.moveTo(tx + treeW / 2 - layerW / 2, layerY + layerH)
          ctx.lineTo(tx + treeW / 2, layerY)
          ctx.lineTo(tx + treeW / 2 + layerW / 2, layerY + layerH)
          ctx.closePath()
          ctx.fill()
        }
      })

      // Glowing fireflies
      fog += 0.01
      const fireflies = [
        [100, 200], [300, 350], [500, 180], [700, 420], [900, 250], [200, 500], [650, 350], [800, 180],
      ]
      fireflies.forEach(([fx, fy], i) => {
        const glow = (Math.sin(fog * 2 + i) + 1) / 2
        ctx.fillStyle = `rgba(255, 255, 100, ${0.2 + glow * 0.5})`
        ctx.beginPath()
        ctx.arc(
          fx + Math.sin(fog + i) * 20,
          fy + Math.cos(fog * 0.7 + i) * 15,
          3 + glow * 2, 0, Math.PI * 2
        )
        ctx.fill()
      })

      // Fog / mist layers
      for (let layer = 0; layer < 3; layer++) {
        const alpha = 0.04 + layer * 0.02
        const fogX = ((fog * (layer + 1) * 0.3) * 100) % (W * 2) - W
        const grad = ctx.createLinearGradient(fogX, H - 150, fogX + W, H - 50)
        grad.addColorStop(0, `rgba(100,255,100,0)`)
        grad.addColorStop(0.3, `rgba(100,255,100,${alpha})`)
        grad.addColorStop(0.7, `rgba(50,200,50,${alpha})`)
        grad.addColorStop(1, `rgba(100,255,100,0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, H - 200, W, 200)
      }

      // Update + draw letter bubbles
      bubblesRef.current.forEach((b) => {
        if (b.popped) {
          b.popAnim += 0.15
          if (b.popAnim < 1) {
            const alpha = 1 - b.popAnim
            const scale = 1 + b.popAnim * 2
            ctx.save()
            ctx.globalAlpha = alpha
            ctx.translate(b.x, b.y)
            ctx.scale(scale, scale)
            // Pop rings
            for (let r = 0; r < 4; r++) {
              ctx.strokeStyle = b.color
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.arc(0, 0, b.radius * (1 + r * 0.4) * scale, 0, Math.PI * 2)
              ctx.stroke()
            }
            ctx.restore()
          }
          return
        }

        // Move
        b.x += b.vx
        b.y += b.vy
        // Bounce off edges
        const W2 = canvas.width, H2 = canvas.height
        if (b.x - b.radius < 60 || b.x + b.radius > W2 - 20) b.vx *= -1
        if (b.y - b.radius < 80 || b.y + b.radius > H2 - 80) b.vy *= -1
        b.x = Math.max(b.radius + 60, Math.min(W2 - b.radius - 20, b.x))
        b.y = Math.max(b.radius + 80, Math.min(H2 - b.radius - 80, b.y))

        // Slight speed variation
        b.vx += (Math.random() - 0.5) * 0.04
        b.vy += (Math.random() - 0.5) * 0.04
        const maxSpeed = 2.2
        const speed = Math.hypot(b.vx, b.vy)
        if (speed > maxSpeed) { b.vx = (b.vx / speed) * maxSpeed; b.vy = (b.vy / speed) * maxSpeed }

        // Hover scale
        b.scale = 1 + Math.sin(fog * 2 + b.x * 0.01) * 0.06

        const isLearned = lettersLearned.includes(b.letter)

        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.scale(b.scale, b.scale)

        // Outer glow
        const glowGrad = ctx.createRadialGradient(0, 0, b.radius * 0.5, 0, 0, b.radius * 1.6)
        glowGrad.addColorStop(0, `${b.color}55`)
        glowGrad.addColorStop(1, `${b.color}00`)
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(0, 0, b.radius * 1.6, 0, Math.PI * 2)
        ctx.fill()

        // Main bubble
        const bubbleGrad = ctx.createRadialGradient(-b.radius * 0.25, -b.radius * 0.25, 4, 0, 0, b.radius)
        bubbleGrad.addColorStop(0, isLearned ? '#aaffaa' : '#fff')
        bubbleGrad.addColorStop(0.3, isLearned ? '#44cc44' : b.color + 'dd')
        bubbleGrad.addColorStop(1, isLearned ? '#226622' : b.color)
        ctx.fillStyle = bubbleGrad
        ctx.beginPath()
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = isLearned ? '#88ff88' : '#fff'
        ctx.lineWidth = isLearned ? 3 : 2
        ctx.globalAlpha = 0.8
        ctx.stroke()
        ctx.globalAlpha = 1

        // Letter
        ctx.font = `bold ${b.radius * 1.0}px Nunito, sans-serif`
        ctx.fillStyle = isLearned ? '#fff' : '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 4
        ctx.fillText(b.letter, 0, 0)
        ctx.shadowBlur = 0

        // Learned checkmark
        if (isLearned) {
          ctx.font = '14px serif'
          ctx.fillText('✓', b.radius * 0.5, -b.radius * 0.55)
        }

        ctx.restore()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [lettersLearned])

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    for (const b of bubblesRef.current) {
      if (b.popped) continue
      const dist = Math.hypot(cx - b.x, cy - b.y)
      if (dist <= b.radius * 1.1) {
        b.popped = true
        b.popAnim = 0
        speak(`¡Encontraste la letra ${b.letter}!`)
        const type = MINIGAME_TYPES[Math.floor(Math.random() * MINIGAME_TYPES.length)]
        setTimeout(() => goToMinigame(b.letter, type), 400)
        break
      }
    }
  }, [goToMinigame, speak])

  const handleTouch = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY })
  }, [handleCanvasClick])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', cursor: 'pointer' }}
        onClick={handleCanvasClick}
        onTouchStart={handleTouch}
      />

      <HUD zoneName="Bosque de Letras" />

      <Lumi message={lumiMsg} position="corner" size="small" />

      {/* Title overlay */}
      <div style={{
        position: 'fixed',
        top: '68px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        pointerEvents: 'none',
      }}>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '22px',
          fontWeight: 900,
          color: '#5DBB63',
          textShadow: '0 0 12px rgba(93,187,99,0.8), 0 2px 4px rgba(0,0,0,0.8)',
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}>
          🌲 Bosque de Letras 🌲
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          color: 'rgba(150,220,150,0.8)',
          textAlign: 'center',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          marginTop: '4px',
        }}>
          Toca las letras para atraparlas
        </p>
      </div>

      {/* Learned letters bottom bar */}
      {lettersLearned.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '24px',
          padding: '8px 16px',
          border: '2px solid rgba(93,187,99,0.4)',
          zIndex: 20,
          alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(150,220,150,0.8)', fontSize: '13px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
            Aprendidas:
          </span>
          {lettersLearned.map(l => {
            const ld = LETTERS.find(x => x.letter === l)
            return (
              <div key={l} style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: ld?.color || '#5DBB63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '16px',
                color: '#fff',
                fontFamily: 'Nunito, sans-serif',
                boxShadow: `0 0 8px ${ld?.color || '#5DBB63'}88`,
              }}>
                {l}
              </div>
            )
          })}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => setScreen('world')}
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          background: 'rgba(0,0,0,0.6)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          color: '#fff',
          padding: '10px 18px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          cursor: 'pointer',
          zIndex: 20,
        }}
      >
        ← Salir
      </button>
    </div>
  )
}
