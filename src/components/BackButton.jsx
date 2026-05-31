import React from 'react'
import { useGameStore } from '../stores/gameStore.js'

const BACK_MAP = {
  avatar: 'splash',
  cutscene: 'avatar',
  world: 'splash',
  letterforest: 'world',
  minigame: 'letterforest',
  reward: 'world',
  home: 'world',
}

export function BackButton() {
  const screen = useGameStore(s => s.screen)
  const setScreen = useGameStore(s => s.setScreen)

  if (!BACK_MAP[screen]) return null

  return (
    <button
      onClick={() => setScreen(BACK_MAP[screen])}
      style={{
        position: 'fixed',
        top: 14,
        left: 14,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
        border: '3px solid rgba(255,255,255,0.5)',
        borderRadius: 18,
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 900,
        fontSize: 16,
        color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        animation: 'retroceso-glow 2s ease-in-out infinite',
        boxShadow: '0 0 14px rgba(255,107,107,0.7), 0 4px 12px rgba(0,0,0,0.3)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        minWidth: 120,
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 20 }}>◀</span>
      <span>Retroceso</span>
    </button>
  )
}
