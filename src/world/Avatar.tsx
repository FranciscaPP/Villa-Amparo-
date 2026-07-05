import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { joystick, avatarState, useGame } from '../state';
import { NPCS } from './npcs';

const SPEED = 5;
const MAP_RADIUS = 26;
const CAMERA_OFFSET = new Vector3(0, 6.5, 9);
const NPC_POSITIONS = NPCS.map((n) => ({ id: n.id, v: new Vector3(...n.position) }));

const SKIN = '#ffcf9f';
const HAIR = '#5c3a21';
const SHIRT = '#ff5c8a';
const PANTS = '#3f6cff';

/**
 * Avatar estilo Roblox: minifigura de bloques con cabeza cúbica,
 * brazos y piernas que se balancean al caminar.
 */
export default function Avatar({ showcase = false }: { showcase?: boolean }) {
  const ref = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const nearId = useRef<string | null>(null);
  const lookTarget = useRef(new Vector3());

  useFrame(({ camera, clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    if (showcase) return; // en la vitrina de personajes no controla cámara ni se mueve

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

    // Balanceo de brazos y piernas al caminar (estilo minifigura)
    const swing = moving ? Math.sin(clock.elapsedTime * 10) * 0.8 : 0;
    if (armL.current) armL.current.rotation.x = swing;
    if (armR.current) armR.current.rotation.x = -swing;
    if (legL.current) legL.current.rotation.x = -swing * 0.7;
    if (legR.current) legR.current.rotation.x = swing * 0.7;
    // Salto sutil al caminar
    g.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.06 : 0;

    // Cámara que sigue
    lookTarget.current.set(avatarState.x, 1, avatarState.z);
    camera.position.lerp(
      lookTarget.current.clone().add(CAMERA_OFFSET),
      Math.min(1, dt * 4)
    );
    camera.lookAt(lookTarget.current);

    // NPC más cercano
    let found: string | null = null;
    for (const n of NPC_POSITIONS) {
      if (g.position.distanceTo(n.v) < 4.5) {
        found = n.id;
        break;
      }
    }
    if (found !== nearId.current) {
      nearId.current = found;
      useGame.getState().setNearNpc(found);
    }
  });

  return (
    <group ref={ref}>
      {/* Piernas (pivote en la cadera) */}
      <group ref={legL} position={[-0.19, 0.75, 0]}>
        <mesh position={[0, -0.375, 0]}>
          <boxGeometry args={[0.3, 0.75, 0.3]} />
          <meshStandardMaterial color={PANTS} />
        </mesh>
      </group>
      <group ref={legR} position={[0.19, 0.75, 0]}>
        <mesh position={[0, -0.375, 0]}>
          <boxGeometry args={[0.3, 0.75, 0.3]} />
          <meshStandardMaterial color={PANTS} />
        </mesh>
      </group>
      {/* Torso */}
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.42]} />
        <meshStandardMaterial color={SHIRT} />
      </mesh>
      {/* Estrella en la polera */}
      <mesh position={[0, 1.16, 0.22]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* Brazos (pivote en el hombro) */}
      <group ref={armL} position={[-0.53, 1.48, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.72, 0.25]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.27, 0.36, 0.27]} />
          <meshStandardMaterial color={SHIRT} />
        </mesh>
      </group>
      <group ref={armR} position={[0.53, 1.48, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.72, 0.25]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.27, 0.36, 0.27]} />
          <meshStandardMaterial color={SHIRT} />
        </mesh>
      </group>
      {/* Cabeza cúbica */}
      <mesh position={[0, 1.87, 0]}>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>
      {/* Pelo: tapa + chasquilla + atrás */}
      <mesh position={[0, 2.13, 0]}>
        <boxGeometry args={[0.68, 0.18, 0.68]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[0, 2.0, 0.33]}>
        <boxGeometry args={[0.68, 0.16, 0.06]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[0, 1.8, -0.33]}>
        <boxGeometry args={[0.68, 0.5, 0.06]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      {/* Coletas cúbicas */}
      <mesh position={[-0.44, 1.78, -0.05]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[0.44, 1.78, -0.05]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      {/* Ojos + sonrisa (cara Roblox) */}
      <mesh position={[-0.13, 1.92, 0.32]}>
        <boxGeometry args={[0.09, 0.14, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.13, 1.92, 0.32]}>
        <boxGeometry args={[0.09, 0.14, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 1.74, 0.32]}>
        <boxGeometry args={[0.26, 0.05, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.13, 1.77, 0.32]}>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.13, 1.77, 0.32]}>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}
