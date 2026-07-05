import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';

export const OWL_POSITION: [number, number, number] = [-6.5, 0, -4];

/** Doña Búho, la maestra de las letras. */
export default function Owl() {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.08;
    }
  });

  return (
    <group position={OWL_POSITION}>
      <group ref={ref}>
        {/* Cuerpo */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#9c6644" />
        </mesh>
        {/* Panza */}
        <mesh position={[0, 0.85, 0.35]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#e6ccb2" />
        </mesh>
        {/* Cabeza */}
        <mesh position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        {/* Ojos */}
        <mesh position={[-0.2, 1.85, 0.38]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.2, 1.85, 0.38]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.2, 1.85, 0.51]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.2, 1.85, 0.51]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        {/* Pico */}
        <mesh position={[0, 1.68, 0.48]} rotation={[Math.PI / 2.4, 0, 0]}>
          <coneGeometry args={[0.09, 0.25, 8]} />
          <meshStandardMaterial color="#ffb703" />
        </mesh>
        {/* Alas */}
        <mesh position={[-0.62, 0.95, 0]} rotation={[0, 0, 0.5]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        <mesh position={[0.62, 0.95, 0]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        {/* Lentes de maestra */}
        <mesh position={[0, 1.85, 0.42]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.19, 0.02, 8, 16]} />
          <meshStandardMaterial color="#d62828" />
        </mesh>
      </group>
      {/* Señal de misión */}
      <Html position={[0, 2.9, 0]} center zIndexRange={[5, 0]}>
        <div className="exclaim">❗</div>
      </Html>
    </group>
  );
}
