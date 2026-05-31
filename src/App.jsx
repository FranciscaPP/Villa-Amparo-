import React from 'react'
import { useGameStore } from './stores/gameStore.js'
import { SplashScreen } from './pages/SplashScreen.jsx'
import { AvatarCreator } from './pages/AvatarCreator.jsx'
import { Cutscene } from './pages/Cutscene.jsx'
import { GameWorld } from './pages/GameWorld.jsx'
import { LetterForest } from './pages/LetterForest.jsx'
import { LetterMinigame } from './pages/LetterMinigame.jsx'
import { RewardScreen } from './pages/RewardScreen.jsx'
import { HomeView } from './pages/HomeView.jsx'

export default function App() {
  const screen = useGameStore(s => s.screen)

  const screens = {
    splash: <SplashScreen />,
    avatar: <AvatarCreator />,
    cutscene: <Cutscene />,
    world: <GameWorld />,
    letterforest: <LetterForest />,
    minigame: <LetterMinigame />,
    reward: <RewardScreen />,
    home: <HomeView />,
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'Nunito, sans-serif' }}>
      {screens[screen] || <SplashScreen />}
    </div>
  )
}
