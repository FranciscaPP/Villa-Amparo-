import { forwardRef, useRef, useImperativeHandle } from 'react';
import type { Group } from 'three';
import type { Look } from '../state';

export interface LimbRefs {
  swing: (v: number) => void;
}

/**
 * Minifigura estilo Roblox, 100% personalizable desde `look`.
 * Expone swing() para animar brazos y piernas al caminar.
 */
const AvatarModel = forwardRef<LimbRefs, { look: Look }>(function AvatarModel(
  { look },
  ref
) {
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);

  useImperativeHandle(ref, () => ({
    swing: (v: number) => {
      if (armL.current) armL.current.rotation.x = v;
      if (armR.current) armR.current.rotation.x = -v;
      if (legL.current) legL.current.rotation.x = -v * 0.7;
      if (legR.current) legR.current.rotation.x = v * 0.7;
    },
  }));

  const { skin, hairStyle, hairColor, shirt, pants, accessory } = look;

  return (
    <group>
      {/* Piernas */}
      <group ref={legL} position={[-0.19, 0.75, 0]}>
        <mesh position={[0, -0.375, 0]}>
          <boxGeometry args={[0.3, 0.75, 0.3]} />
          <meshStandardMaterial color={pants} />
        </mesh>
      </group>
      <group ref={legR} position={[0.19, 0.75, 0]}>
        <mesh position={[0, -0.375, 0]}>
          <boxGeometry args={[0.3, 0.75, 0.3]} />
          <meshStandardMaterial color={pants} />
        </mesh>
      </group>
      {/* Torso */}
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.42]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <mesh position={[0, 1.16, 0.22]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* Brazos */}
      <group ref={armL} position={[-0.53, 1.48, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.72, 0.25]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.27, 0.36, 0.27]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <group ref={armR} position={[0.53, 1.48, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.72, 0.25]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.27, 0.36, 0.27]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      {/* Cabeza */}
      <mesh position={[0, 1.87, 0]}>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      {/* Pelo */}
      <mesh position={[0, 2.13, 0]}>
        <boxGeometry args={[0.68, 0.18, 0.68]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      <mesh position={[0, 2.0, 0.33]}>
        <boxGeometry args={[0.68, 0.16, 0.06]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      {hairStyle === 'coletas' && (
        <>
          <mesh position={[0, 1.8, -0.33]}>
            <boxGeometry args={[0.68, 0.5, 0.06]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[-0.44, 1.78, -0.05]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.44, 1.78, -0.05]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}
      {hairStyle === 'corto' && (
        <mesh position={[0, 1.95, -0.31]}>
          <boxGeometry args={[0.68, 0.35, 0.1]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
      {hairStyle === 'melena' && (
        <>
          <mesh position={[0, 1.65, -0.31]}>
            <boxGeometry args={[0.68, 0.85, 0.12]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[-0.37, 1.75, 0]}>
            <boxGeometry args={[0.1, 0.65, 0.55]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.37, 1.75, 0]}>
            <boxGeometry args={[0.1, 0.65, 0.55]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}
      {/* Cara */}
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
      {/* Accesorios */}
      {accessory === 'gorro' && (
        <>
          <mesh position={[0, 2.28, 0]}>
            <boxGeometry args={[0.72, 0.22, 0.72]} />
            <meshStandardMaterial color="#e63946" />
          </mesh>
          <mesh position={[0, 2.26, 0.44]}>
            <boxGeometry args={[0.55, 0.08, 0.28]} />
            <meshStandardMaterial color="#c1121f" />
          </mesh>
        </>
      )}
      {accessory === 'lentes' && (
        <>
          <mesh position={[-0.14, 1.92, 0.34]}>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color="#9b5de5" wireframe />
          </mesh>
          <mesh position={[0.14, 1.92, 0.34]}>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color="#9b5de5" wireframe />
          </mesh>
          <mesh position={[0, 1.92, 0.34]}>
            <boxGeometry args={[0.1, 0.04, 0.02]} />
            <meshStandardMaterial color="#9b5de5" />
          </mesh>
        </>
      )}
      {accessory === 'mochila' && (
        <>
          <mesh position={[0, 1.1, -0.35]}>
            <boxGeometry args={[0.6, 0.65, 0.25]} />
            <meshStandardMaterial color="#06d6a0" />
          </mesh>
          <mesh position={[0, 1.32, -0.49]}>
            <boxGeometry args={[0.35, 0.2, 0.06]} />
            <meshStandardMaterial color="#048a68" />
          </mesh>
        </>
      )}
    </group>
  );
});

export default AvatarModel;
