import { useGame } from './state';
import { speak } from './voice';
import WorldScreen from './world/WorldScreen';
import CazaLetras from './missions/CazaLetras';

export default function App() {
  const screen = useGame((s) => s.screen);

  if (screen === 'home') return <Home />;
  if (screen === 'mission') return <CazaLetras />;
  return <WorldScreen />;
}

function Home() {
  const setScreen = useGame((s) => s.setScreen);

  const start = async () => {
    // Pantalla completa y orientación horizontal si el teléfono lo permite.
    try {
      await document.documentElement.requestFullscreen();
      await (screen.orientation as any)?.lock?.('landscape');
    } catch {
      /* si no se puede, se juega igual */
    }
    setScreen('world');
    speak('¡Bienvenida a Villa Amparo! Camina con el dedo y busca a Doña Búho.');
  };

  return (
    <div className="home">
      <h1>🏡 Villa Amparo</h1>
      <div className="subtitle">Un pueblito lleno de letras</div>
      <button className="big-btn" onClick={start}>
        ▶ JUGAR
      </button>
    </div>
  );
}
