import React, { Suspense, lazy } from 'react'
import { useGameStore } from './stores/gameStore.js'
import { SplashScreen } from './pages/SplashScreen.jsx'
import { BackButton } from './components/BackButton.jsx'

// Lazy load — Three.js only loads when actually needed, not on first screen
const AvatarCreator = lazy(() => import('./pages/AvatarCreator.jsx').then(m => ({ default: m.AvatarCreator })))
const GameWorld     = lazy(() => import('./pages/GameWorld.jsx').then(m => ({ default: m.GameWorld })))
const Cutscene      = lazy(() => import('./pages/Cutscene.jsx').then(m => ({ default: m.Cutscene })))
const LetterForest  = lazy(() => import('./pages/LetterForest.jsx').then(m => ({ default: m.LetterForest })))
const LetterMinigame = lazy(() => import('./pages/LetterMinigame.jsx').then(m => ({ default: m.LetterMinigame })))
const RewardScreen  = lazy(() => import('./pages/RewardScreen.jsx').then(m => ({ default: m.RewardScreen })))
const HomeView      = lazy(() => import('./pages/HomeView.jsx').then(m => ({ default: m.HomeView })))

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('Villa Amparo error:', error, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: '100vw', height: '100vh',
          background: 'radial-gradient(ellipse at center, #2d1b69, #1a0533)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 24, fontFamily: 'Nunito, sans-serif', padding: 24,
        }}>
          <div style={{ fontSize: 72, animation: 'float 3s ease-in-out infinite' }}>⭐</div>
          <p style={{ color: '#FFD700', fontSize: 26, fontWeight: 900, textAlign: 'center', margin: 0 }}>
            ¡Ups! Algo salió mal
          </p>
          <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: 15, fontWeight: 600, textAlign: 'center', margin: 0 }}>
            Tu progreso está guardado. ¡Inténtalo de nuevo!
          </p>
          <button onClick={() => { this.setState({ error: null }) }} style={{
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)', border: 'none',
            borderRadius: 24, padding: '16px 40px', fontSize: 20, fontWeight: 900,
            color: '#1a0533', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,140,0,0.5)',
          }}>🔄 Reintentar</button>
        </div>
      )
    }
    return this.props.children
  }
}

function LoadingScreen() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69, #1a0533)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, fontFamily: 'Nunito, sans-serif',
    }}>
      <div style={{ fontSize: 80, animation: 'float 1.5s ease-in-out infinite' }}>🏡</div>
      <p style={{ color: '#FFD700', fontSize: 22, fontWeight: 900, margin: 0, animation: 'pulse 1.5s ease-in-out infinite' }}>
        Cargando Villa Amparo...
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {['#FF6B6B','#FFD700','#4ECDC4','#A8E6CF'].map((c, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%', background: c,
            animation: `bounce 1.2s ${i * 0.15}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const screen = useGameStore(s => s.screen)

  const screens = {
    splash:      <SplashScreen />,
    avatar:      <AvatarCreator />,
    cutscene:    <Cutscene />,
    world:       <GameWorld />,
    letterforest: <LetterForest />,
    minigame:    <LetterMinigame />,
    reward:      <RewardScreen />,
    home:        <HomeView />,
  }

  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'Nunito, sans-serif' }}>
        <Suspense fallback={<LoadingScreen />}>
          {screens[screen] || <SplashScreen />}
        </Suspense>
        <BackButton />
      </div>
    </ErrorBoundary>
  )
}
