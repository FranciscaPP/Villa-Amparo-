import { Canvas } from '@react-three/fiber';
import Avatar from './Avatar';
import { OwlModel, FrogModel, TomatoModel, ToucanModel } from './NpcModels';

/**
 * Vitrina de personajes (solo para revisar el diseño):
 * se abre con ?personajes en la URL.
 */
export default function CharacterShowcase() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ fov: 40, position: [0, 2.2, 9] }} dpr={[1, 2]}>
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 10, 6]} intensity={1.2} />
        {/* Tarima */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[16, 0.6, 6]} />
          <meshStandardMaterial color="#7ed957" />
        </mesh>
        <group position={[-5.4, 0, 0]}>
          <Avatar showcase />
        </group>
        <OwlModel position={[-2.7, 0, 0]} />
        <FrogModel position={[0, 0, 0]} />
        <TomatoModel position={[2.7, 0, 0]} />
        <ToucanModel position={[5.4, 0, 0]} />
      </Canvas>
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          fontSize: 18,
          textShadow: '0 2px 2px rgba(0,0,0,0.4)',
        }}
      >
        Amparo · Doña Búho · Rana Rita · Don Tomate · Cartero Coco
      </div>
    </div>
  );
}
