import React, { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../stores/gameStore.js'

export function HUD({ zoneName = 'Villa Amparo' }) {
  const coins = useGameStore(s => s.coins)
  const level = useGameStore(s => s.level)
  const prevCoins = useRef(coins)
  const [coinAnim, setCoinAnim] = useState(false)

  useEffect(() => {
    if (coins !== prevCoins.current) {
      setCoinAnim(true)
      prevCoins.current = coins
      const t = setTimeout(() => setCoinAnim(false), 600)
      return () => clearTimeout(t)
    }
  }, [coins])

  const hudStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: 'rgba(26, 5, 51, 0.75)',
    backdropFilter: 'blur(12px)',
    borderBottom: '2px solid rgba(255, 215, 0, 0.25)',
    height: '60px',
    fontFamily: 'Nunito, sans-serif',
  }

  const coinStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.15))',
    borderRadius: '20px',
    padding: '6px 14px',
    border: '2px solid rgba(255,215,0,0.5)',
    boxShadow: coinAnim ? '0 0 20px rgba(255,215,0,0.8)' : '0 0 8px rgba(255,215,0,0.3)',
    transition: 'box-shadow 0.3s',
  }

  const coinNumStyle = {
    color: '#FFD700',
    fontSize: '20px',
    fontWeight: 900,
    animation: coinAnim ? 'bounce-in 0.5s ease-out' : 'none',
    display: 'inline-block',
  }

  const levelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(69,183,209,0.2))',
    borderRadius: '20px',
    padding: '6px 14px',
    border: '2px solid rgba(155,89,182,0.5)',
    color: '#e0c3ff',
    fontSize: '16px',
    fontWeight: 800,
  }

  const zoneStyle = {
    color: 'rgba(255,253,245,0.85)',
    fontSize: '15px',
    fontWeight: 700,
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    flex: 1,
    padding: '0 12px',
  }

  return (
    <div style={hudStyle}>
      <div style={coinStyle}>
        <span style={{ fontSize: '20px' }}>⭐</span>
        <span style={coinNumStyle}>{coins}</span>
      </div>

      <div style={zoneStyle}>🏡 {zoneName}</div>

      <div style={levelStyle}>
        <span>Nv.</span>
        <span style={{ color: '#FFD700', fontSize: '18px', fontWeight: 900 }}>{level}</span>
      </div>
    </div>
  )
}
