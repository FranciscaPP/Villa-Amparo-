import React, { useEffect, useState } from 'react'

const COLORS = ['#FF6B6B', '#FFD700', '#4ECDC4', '#96CEB4', '#DDA0DD', '#87CEEB', '#FF8C00', '#5DBB63', '#9B59B6', '#F0E68C']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export function Confetti({ count = 50, duration = 3000 }) {
  const [pieces, setPieces] = useState([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      left: randomBetween(0, 100),
      size: randomBetween(8, 20),
      animDuration: randomBetween(1.5, 3.5),
      animDelay: randomBetween(0, 1.5),
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotation: randomBetween(0, 360),
    }))
    setPieces(newPieces)

    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-30px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: p.shape === 'circle' ? `${p.size}px` : `${p.size * 0.6}px`,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            background: p.color,
            animation: `confetti-fall ${p.animDuration}s ${p.animDelay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
            boxShadow: `0 0 4px ${p.color}88`,
          }}
        />
      ))}
    </div>
  )
}
