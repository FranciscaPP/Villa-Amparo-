import { Canvas } from '@react-three/fiber';
import { useGame, avatarState, carState } from '../state';
import { speak, narrate, BIBLIO, PROFE } from '../voice';
import Joystick from '../ui/Joystick';
import Hud from '../ui/Hud';
import Town from './Town';
import Car from './Car';
import Npcs, { TOWN_NPCS } from './Npcs';
import Player from './Player';

export default function WorldScreen() {
  const nearThing = useGame((s) => s.nearThing);
  const driving = useGame((s) => s.driving);
  const setDriving = useGame((s) => s.setDriving);
  const startMission = useGame((s) => s.startMission);
  const setScreen = useGame((s) => s.setScreen);

  const enterCar = () => {
    setDriving(true);
    narrate('¡Brrrum! Arrastra el dedo para manejar.');
  };
  const exitCar = () => {
    setDriving(false);
    // Deja a la niña al lado del auto
    avatarState.x = carState.x + 2;
    avatarState.z = carState.z;
    narrate('¡Llegamos! Sigue explorando.');
  };
  const talkNpc = (id: string) => {
    const npc = TOWN_NPCS.find((n) => `npc-${n.id}` === id);
    if (!npc || !npc.mission) return;
    if (npc.mission === 'biblioteca') {
      speak('¡Hola! Soy Beti. ¡Se me desordenaron los libros! ¿Me ayudas a encontrar los que empiezan con una letra?', BIBLIO);
    } else {
      speak('¡Hola! Soy la profesora Pía. ¡Juguemos a las letras! Escucha la palabra y dime con qué letra empieza.', PROFE);
    }
    startMission(npc.mission);
  };

  return (
    <div className="world-wrap">
      <Canvas
        camera={{ fov: 50, position: [2, 7, 16] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#b8e6ff', 40, 75]} />
        <ambientLight intensity={0.95} />
        <directionalLight position={[10, 18, 6]} intensity={1.1} />
        <Town />
        <Car />
        <Npcs />
        <Player />
      </Canvas>
      <Hud />
      <Joystick />
      {/* Botón para personalizar avatar */}
      {!driving && (
        <button className="avatar-btn" onClick={() => setScreen('studio')}>
          🧍 AVATAR
        </button>
      )}
      {/* Acciones según lo que esté cerca */}
      {nearThing === 'car' && !driving && (
        <button className="talk-btn" onClick={enterCar}>
          🚗 SUBIR AL AUTO
        </button>
      )}
      {driving && (
        <button className="talk-btn" onClick={exitCar}>
          ⬇️ BAJARSE
        </button>
      )}
      {nearThing?.startsWith('npc-') && !driving && (
        <button className="talk-btn" onClick={() => talkNpc(nearThing)}>
          💬 HABLAR
        </button>
      )}
    </div>
  );
}
