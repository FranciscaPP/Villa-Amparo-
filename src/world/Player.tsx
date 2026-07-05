import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { joystick, avatarState, carState, useGame } from '../state';
import AvatarModel, { LimbRefs } from './AvatarModel';
import { TOWN_NPCS } from './Npcs';

const SPEED = 5.5;
const MAP_LIMIT = 29;
const CAMERA_OFFSET_WALK = new Vector3(0, 6.5, 9);
const CAMERA_OFFSET_DRIVE = new Vector3(0, 8.5, 12);

/**
 * La jugadora: mueve el avatar (o el auto si está manejando),
 * controla la cámara y detecta qué cosa interactiva está cerca.
 */
export default function Player() {
  const ref = useRef<Group>(null);
  const limbs = useRef<LimbRefs>(null);
  const near = useRef<string | null>(null);
  const lookTarget = useRef(new Vector3());
  const look = useGame((s) => s.look);
  const driving = useGame((s) => s.driving);

  useFrame(({ camera, clock }, dt) => {
    const g = ref.current;
    if (!g) return;

    if (driving) {
      // El avatar viaja escondido dentro del auto
      avatarState.x = carState.x;
      avatarState.z = carState.z;
      g.visible = false;
      lookTarget.current.set(carState.x, 1, carState.z);
      camera.position.lerp(lookTarget.current.clone().add(CAMERA_OFFSET_DRIVE), Math.min(1, dt * 4));
      camera.lookAt(lookTarget.current);
      updateNear('car-exit');
      return;
    }
    g.visible = true;

    const moving = joystick.active && (joystick.x !== 0 || joystick.y !== 0);
    if (moving) {
      avatarState.x += joystick.x * SPEED * dt;
      avatarState.z += joystick.y * SPEED * dt;
      avatarState.x = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, avatarState.x));
      avatarState.z = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, avatarState.z));
      avatarState.rot = Math.atan2(joystick.x, joystick.y);
    }

    g.position.set(avatarState.x, 0, avatarState.z);
    g.rotation.y = avatarState.rot;
    g.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.06 : 0;
    limbs.current?.swing(moving ? Math.sin(clock.elapsedTime * 10) * 0.8 : 0);

    lookTarget.current.set(avatarState.x, 1, avatarState.z);
    camera.position.lerp(lookTarget.current.clone().add(CAMERA_OFFSET_WALK), Math.min(1, dt * 4));
    camera.lookAt(lookTarget.current);

    // ¿Qué hay cerca? Los NPCs con misión tienen prioridad sobre el auto
    let found: string | null = null;
    for (const n of TOWN_NPCS) {
      if (Math.hypot(avatarState.x - n.position[0], avatarState.z - n.position[2]) < 3.5) {
        found = `npc-${n.id}`;
        break;
      }
    }
    if (!found && Math.hypot(avatarState.x - carState.x, avatarState.z - carState.z) < 3.2) {
      found = 'car';
    }
    updateNear(found);
  });

  function updateNear(found: string | null) {
    if (found !== near.current) {
      near.current = found;
      useGame.getState().setNearThing(found);
    }
  }

  return (
    <group ref={ref}>
      <AvatarModel ref={limbs} look={look} />
    </group>
  );
}
