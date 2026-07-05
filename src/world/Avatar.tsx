import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { joystick, avatarState, useGame } from '../state';

const SPEED = 5;
const MAP_RADIUS = 26;
const CAMERA_OFFSET = new Vector3(0, 6.5, 9);

export default function Avatar({ npcPosition }: { npcPosition: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const wasNear = useRef(false);
  const npc = useRef(new Vector3(...npcPosition));
  const lookTarget = useRef(new Vector3());

  useFrame(({ camera, clock }, dt) => {
    const g = ref.current;
    if (!g) return;

    const moving = joystick.active && (joystick.x !== 0 || joystick.y !== 0);
    if (moving) {
      avatarState.x += joystick.x * SPEED * dt;
      avatarState.z += joystick.y * SPEED * dt;
      const r = Math.hypot(avatarState.x, avatarState.z);
      if (r > MAP_RADIUS) {
        avatarState.x = (avatarState.x / r) * MAP_RADIUS;
        avatarState.z = (avatarState.z / r) * MAP_RADIUS;
      }
      avatarState.rot = Math.atan2(joystick.x, joystick.y);
    }

    g.position.set(avatarState.x, 0, avatarState.z);
    g.rotation.y = avatarState.rot;
    // Rebote alegre al caminar
    g.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.12 : 0;

    // Cámara que sigue
    lookTarget.current.set(avatarState.x, 1, avatarState.z);
    camera.position.lerp(
      lookTarget.current.clone().add(CAMERA_OFFSET),
      Math.min(1, dt * 4)
    );
    camera.lookAt(lookTarget.current);

    // ¿Cerca de Doña Búho?
    const near = g.position.distanceTo(npc.current) < 4.5;
    if (near !== wasNear.current) {
      wasNear.current = near;
      useGame.getState().setNearNpc(near);
    }
  });

  return (
    <group ref={ref}>
      {/* Cuerpo (polera rosada) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.35, 0.42, 0.9, 16]} />
        <meshStandardMaterial color="#ff6fa5" />
      </mesh>
      {/* Cabeza */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffd8b1" />
      </mesh>
      {/* Pelo */}
      <mesh position={[0, 1.68, -0.05]}>
        <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      {/* Coletas */}
      <mesh position={[-0.42, 1.5, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      <mesh position={[0.42, 1.5, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      {/* Ojos */}
      <mesh position={[-0.14, 1.5, 0.34]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.14, 1.5, 0.34]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Sonrisa */}
      <mesh position={[0, 1.36, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#d62828" />
      </mesh>
      {/* Piernas */}
      <mesh position={[-0.15, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 8]} />
        <meshStandardMaterial color="#4361ee" />
      </mesh>
      <mesh position={[0.15, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 8]} />
        <meshStandardMaterial color="#4361ee" />
      </mesh>
    </group>
  );
}
