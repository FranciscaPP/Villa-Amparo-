import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { carState, joystick, useGame } from '../state';
import { narrate } from '../voice';

const CAR_SPEED = 11;
const MAP_LIMIT = 29;

/** Auto rosado manejable: se conduce con el mismo joystick. */
export default function Car() {
  const ref = useRef<Group>(null);
  const wheels = useRef<Mesh[]>([]);
  const driving = useGame((s) => s.driving);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;

    if (driving && joystick.active && (joystick.x !== 0 || joystick.y !== 0)) {
      const target = Math.atan2(joystick.x, joystick.y);
      // Giro suave hacia la dirección del dedo
      let diff = target - carState.rot;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      carState.rot += diff * Math.min(1, dt * 5);
      const speed = CAR_SPEED * Math.min(1, Math.hypot(joystick.x, joystick.y) + 0.3);
      carState.x += Math.sin(carState.rot) * speed * dt;
      carState.z += Math.cos(carState.rot) * speed * dt;
      carState.x = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, carState.x));
      carState.z = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, carState.z));
      wheels.current.forEach((w) => w && (w.rotation.x += speed * dt * 2));
    }
    g.position.set(carState.x, 0, carState.z);
    g.rotation.y = carState.rot;
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (joystick.wasDrag) return;
        narrate('Tu auto rosado. Acércate y toca el botón para subirte y manejar.');
      }}
    >
      {/* Carrocería */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.6, 0.55, 3.0]} />
        <meshStandardMaterial color="#ff5c8a" />
      </mesh>
      {/* Cabina */}
      <mesh position={[0, 1.05, -0.2]}>
        <boxGeometry args={[1.4, 0.55, 1.6]} />
        <meshStandardMaterial color="#ff8fab" />
      </mesh>
      {/* Parabrisas */}
      <mesh position={[0, 1.05, 0.62]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.3, 0.5, 0.06]} />
        <meshStandardMaterial color="#a8dcff" />
      </mesh>
      {/* Focos */}
      <mesh position={[-0.5, 0.55, 1.51]}>
        <boxGeometry args={[0.25, 0.18, 0.05]} />
        <meshStandardMaterial color="#fff3b0" emissive="#ffd166" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.5, 0.55, 1.51]}>
        <boxGeometry args={[0.25, 0.18, 0.05]} />
        <meshStandardMaterial color="#fff3b0" emissive="#ffd166" emissiveIntensity={0.6} />
      </mesh>
      {/* Ruedas */}
      {(
        [
          [-0.85, 0.35, 1.0],
          [0.85, 0.35, 1.0],
          [-0.85, 0.35, -1.0],
          [0.85, 0.35, -1.0],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={i} ref={(el) => (wheels.current[i] = el!)} position={p} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 12]} />
          <meshStandardMaterial color="#263238" />
        </mesh>
      ))}
    </group>
  );
}
