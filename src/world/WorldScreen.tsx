import { Canvas } from '@react-three/fiber';
import { useGame } from '../state';
import { speak } from '../voice';
import Hud from '../ui/Hud';
import Joystick from '../ui/Joystick';
import Village from './Village';
import Avatar from './Avatar';
import { NPCS } from './npcs';
import { OwlModel, FrogModel, TomatoModel, ToucanModel } from './NpcModels';

const MODELS: Record<string, typeof OwlModel> = {
  buho: OwlModel,
  rana: FrogModel,
  tomate: TomatoModel,
  coco: ToucanModel,
};

export default function WorldScreen() {
  const nearNpc = useGame((s) => s.nearNpc);
  const startMission = useGame((s) => s.startMission);
  const npc = NPCS.find((n) => n.id === nearNpc);

  const talk = () => {
    if (!npc) return;
    speak(npc.intro, npc.voice);
    if (npc.mission === 'vocales') {
      startMission(npc.mission);
    } else {
      // Los demás minijuegos vienen en camino
      speak('¡Mi juego estará listo muy pronto! ¡Vuelve a visitarme!', npc.voice);
    }
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
        {NPCS.map((n) => {
          const Model = MODELS[n.id];
          return <Model key={n.id} position={n.position} />;
        })}
        <Avatar />
      </Canvas>
      <Hud />
      <Joystick />
      {npc && (
        <button className="talk-btn" onPointerDown={(e) => e.stopPropagation()} onClick={talk}>
          💬 HABLAR
        </button>
      )}
    </div>
  );
}
