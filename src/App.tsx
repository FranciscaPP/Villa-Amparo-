import { useGame } from './state';
import { speak } from './voice';
import WorldScreen from './world/WorldScreen';
import AvatarStudio from './customize/AvatarStudio';
import Biblioteca from './missions/Biblioteca';
import Escuela from './missions/Escuela';

export default function App() {
  const screen = useGame((s) => s.screen);
  const activeMission = useGame((s) => s.activeMission);

  if (screen === 'home') return <Home />;
  if (screen === 'studio') return <AvatarStudio />;
  if (screen === 'mission') {
    if (activeMission === 'biblioteca') return <Biblioteca />;
    if (activeMission === 'escuela') return <Escuela />;
  }
  return <WorldScreen />;
}

function Home() {
  const setScreen = useGame((s) => s.setScreen);

  const start = async () => {
    try {
      await document.documentElement.requestFullscreen();
      await (screen.orientation as any)?.lock?.('landscape');
    } catch {
      /* si no se puede, se juega igual */
    }
    setScreen('world');
    speak(
      '¡Bienvenida a Villa Amparo! Arrastra el dedo para caminar, y toca las casas, los autos y las personas para escuchar qué son.'
    );
  };

  return (
    <div className="home">
      <h1>🏘️ Villa Amparo</h1>
      <div className="subtitle">Tu ciudad de las palabras</div>
      <button className="big-btn" onClick={start}>
        ▶ JUGAR
      </button>
    </div>
  );
}
