import { Canvas } from '@react-three/fiber';
import { useGame } from '../state';
import { speak, BUHO } from '../voice';
import Hud from '../ui/Hud';
import Joystick from '../ui/Joystick';
import Village from './Village';
import Avatar from './Avatar';
import Owl, { OWL_POSITION } from './Owl';

export default function WorldScreen() {
  const nearNpc = useGame((s) => s.nearNpc);
  const setScreen = useGame((s) => s.setScreen);

  const talk = () => {
    speak(
      '¡Hola! Soy Doña Búho. ¡Las vocales se escaparon en globos! ¿Me ayudas a atraparlas?',
      BUHO
    );
    setScreen('mission');
  };

  return (
    <div className="world-wrap">
      <Canvas
        camera={{ fov: 50, position: [0, 7, 12] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#b8e6ff', 30, 60]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[8, 15, 5]} intensity={1.1} />
        <Village />
        <Owl />
        <Avatar npcPosition={OWL_POSITION} />
      </Canvas>
      <Hud />
      <Joystick />
      {nearNpc && (
        <button className="talk-btn" onPointerDown={(e) => e.stopPropagation()} onClick={talk}>
          💬 HABLAR
        </button>
      )}
    </div>
  );
}
