import React, { useEffect, useCallback } from 'react'
import { useVoice } from '../hooks/useVoice.js'

export function Lumi({ message, animation = 'float', position = 'corner', size = 'small', onDone }) {
  const { speak } = useVoice()

  useEffect(() => {
    if (message) {
      speak(message)
    }
  }, [message])

  const handleRepeat = useCallback(() => {
    if (message) speak(message)
  }, [message, speak])

  const isLarge = size === 'large'
  const isCorner = position === 'corner'

  const containerStyle = {
    position: isCorner ? 'fixed' : 'relative',
    ...(isCorner ? { top: '80px', right: '16px', zIndex: 100 } : {}),
    display: 'flex',
    flexDirection: isCorner ? 'column' : 'column',
    alignItems: 'center',
    gap: '8px',
    pointerEvents: 'none',
  }

  const starSize = isLarge ? 110 : 70
  const fontSize = isLarge ? '52px' : '36px'

  const starStyle = {
    width: `${starSize}px`,
    height: `${starSize}px`,
    fontSize: fontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: animation === 'float' ? 'float 3s ease-in-out infinite' :
               animation === 'bounce' ? 'bounce 1.2s ease-in-out infinite' :
               animation === 'dance' ? 'dance 0.8s ease-in-out infinite' :
               'float 3s ease-in-out infinite',
    filter: 'drop-shadow(0 0 12px #FFD700) drop-shadow(0 0 24px #FFB800)',
    cursor: 'default',
    flexShrink: 0,
  }

  const bubbleStyle = {
    background: 'rgba(255, 253, 245, 0.97)',
    borderRadius: '18px',
    padding: isLarge ? '14px 20px' : '10px 14px',
    maxWidth: isLarge ? '320px' : '220px',
    minWidth: isCorner ? '160px' : '200px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,215,0,0.4)',
    position: 'relative',
    pointerEvents: 'auto',
    border: '2px solid rgba(255,215,0,0.5)',
  }

  const bubbleArrowStyle = {
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '12px solid rgba(255, 253, 245, 0.97)',
  }

  const messageStyle = {
    fontSize: isLarge ? '15px' : '13px',
    color: '#2d1b69',
    fontWeight: 700,
    lineHeight: 1.4,
    fontFamily: 'Nunito, sans-serif',
    textAlign: 'center',
  }

  const repeatBtnStyle = {
    marginTop: '6px',
    background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
    border: 'none',
    borderRadius: '10px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
    color: '#fff',
    fontFamily: 'Nunito, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: 'auto',
  }

  return (
    <div style={containerStyle}>
      {/* Speech bubble above the star */}
      {message && (
        <div style={bubbleStyle}>
          <p style={messageStyle}>{message}</p>
          <button style={repeatBtnStyle} onClick={handleRepeat}>
            🔊 Repetir
          </button>
          <div style={bubbleArrowStyle} />
        </div>
      )}
      {/* The star */}
      <div style={starStyle} className="animate-glow-star">
        ⭐
      </div>
    </div>
  )
}
