import { useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';

/** Cara Roblox: dos ojos cuadrados + sonrisa, pegada a la cara frontal. */
function BlockFace({ y, z, scale = 1 }: { y: number; z: number; scale?: number }) {
  const s = scale;
  return (
    <group position={[0, y, z]}>
      <mesh position={[-0.13 * s, 0.06 * s, 0]}>
        <boxGeometry args={[0.09 * s, 0.14 * s, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.13 * s, 0.06 * s, 0]}>
        <boxGeometry args={[0.09 * s, 0.14 * s, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, -0.13 * s, 0]}>
        <boxGeometry args={[0.26 * s, 0.05 * s, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

/** Envuelve un modelo de NPC: rebote suave + señal de misión ❗ */
function NpcMarker({
  position,
  height,
  children,
  showBang = true,
}: {
  position: [number, number, number];
  height: number;
  children: ReactNode;
  showBang?: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 2 + position[0]) * 0.07;
    }
  });
  return (
    <group position={position}>
      <group ref={ref}>{children}</group>
      {showBang && (
        <Html position={[0, height, 0]} center zIndexRange={[5, 0]}>
          <div className="exclaim">❗</div>
        </Html>
      )}
    </group>
  );
}

/** Doña Búho: búho de bloques con lentes de maestra. */
export function OwlModel({ position }: { position: [number, number, number] }) {
  return (
    <NpcMarker position={position} height={2.6}>
      {/* Cuerpo */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.0, 1.4, 0.85]} />
        <meshStandardMaterial color="#9c6644" />
      </mesh>
      {/* Panza */}
      <mesh position={[0, 0.55, 0.44]}>
        <boxGeometry args={[0.65, 0.85, 0.04]} />
        <meshStandardMaterial color="#e6ccb2" />
      </mesh>
      {/* Cabeza cúbica */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.95, 0.75, 0.8]} />
        <meshStandardMaterial color="#7f5539" />
      </mesh>
      {/* Orejitas de búho */}
      <mesh position={[-0.38, 2.2, 0]}>
        <boxGeometry args={[0.18, 0.25, 0.18]} />
        <meshStandardMaterial color="#7f5539" />
      </mesh>
      <mesh position={[0.38, 2.2, 0]}>
        <boxGeometry args={[0.18, 0.25, 0.18]} />
        <meshStandardMaterial color="#7f5539" />
      </mesh>
      {/* Ojos grandes cuadrados */}
      <mesh position={[-0.22, 1.8, 0.41]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.22, 1.8, 0.41]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.22, 1.8, 0.43]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.22, 1.8, 0.43]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Lentes rojos de maestra */}
      <mesh position={[-0.22, 1.8, 0.45]}>
        <boxGeometry args={[0.38, 0.38, 0.02]} />
        <meshStandardMaterial color="#d62828" wireframe />
      </mesh>
      <mesh position={[0.22, 1.8, 0.45]}>
        <boxGeometry args={[0.38, 0.38, 0.02]} />
        <meshStandardMaterial color="#d62828" wireframe />
      </mesh>
      {/* Pico triangular */}
      <mesh position={[0, 1.6, 0.45]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <coneGeometry args={[0.12, 0.25, 4]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
      {/* Alas de bloque */}
      <mesh position={[-0.62, 0.85, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.22, 0.9, 0.6]} />
        <meshStandardMaterial color="#7f5539" />
      </mesh>
      <mesh position={[0.62, 0.85, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.22, 0.9, 0.6]} />
        <meshStandardMaterial color="#7f5539" />
      </mesh>
      {/* Patas */}
      <mesh position={[-0.25, 0.05, 0.1]}>
        <boxGeometry args={[0.22, 0.1, 0.35]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
      <mesh position={[0.25, 0.05, 0.1]}>
        <boxGeometry args={[0.22, 0.1, 0.35]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
    </NpcMarker>
  );
}

/** Rana Rita: rana de bloques con moño. */
export function FrogModel({ position }: { position: [number, number, number] }) {
  return (
    <NpcMarker position={position} height={2.1}>
      {/* Cuerpo ancho */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.15, 0.9, 0.9]} />
        <meshStandardMaterial color="#43a047" />
      </mesh>
      {/* Panza */}
      <mesh position={[0, 0.42, 0.46]}>
        <boxGeometry args={[0.7, 0.55, 0.04]} />
        <meshStandardMaterial color="#dcedc8" />
      </mesh>
      {/* Ojos cúbicos arriba */}
      <mesh position={[-0.32, 1.15, 0.1]}>
        <boxGeometry args={[0.34, 0.34, 0.34]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.32, 1.15, 0.1]}>
        <boxGeometry args={[0.34, 0.34, 0.34]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.32, 1.15, 0.28]}>
        <boxGeometry args={[0.13, 0.13, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.32, 1.15, 0.28]}>
        <boxGeometry args={[0.13, 0.13, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Boca sonriente */}
      <mesh position={[0, 0.68, 0.46]}>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
      {/* Patas delanteras */}
      <mesh position={[-0.45, 0.08, 0.3]}>
        <boxGeometry args={[0.3, 0.16, 0.45]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
      <mesh position={[0.45, 0.08, 0.3]}>
        <boxGeometry args={[0.3, 0.16, 0.45]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
      {/* Moño rosado */}
      <mesh position={[0, 1.4, -0.05]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.34, 0.16, 0.14]} />
        <meshStandardMaterial color="#ff5c8a" />
      </mesh>
      <mesh position={[0, 1.4, -0.05]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.34, 0.16, 0.14]} />
        <meshStandardMaterial color="#ff5c8a" />
      </mesh>
    </NpcMarker>
  );
}

/** Don Tomate: tomate cúbico gruñón adorable. */
export function TomatoModel({ position }: { position: [number, number, number] }) {
  return (
    <NpcMarker position={position} height={2.2}>
      {/* Cuerpo cubo rojo */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.15, 1.15, 1.0]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      {/* Hojas de tomate (bloques verdes) */}
      <mesh position={[0, 1.32, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.8, 0.14, 0.8]} />
        <meshStandardMaterial color="#43a047" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      {/* Cara */}
      <BlockFace y={0.75} z={0.51} scale={1.4} />
      {/* Cejas de gruñón */}
      <mesh position={[-0.19, 1.0, 0.51]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.24, 0.06, 0.02]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      <mesh position={[0.19, 1.0, 0.51]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.24, 0.06, 0.02]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      {/* Bigote */}
      <mesh position={[0, 0.52, 0.52]}>
        <boxGeometry args={[0.42, 0.08, 0.02]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>
      {/* Patitas */}
      <mesh position={[-0.3, 0.04, 0.1]}>
        <boxGeometry args={[0.26, 0.09, 0.4]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0.3, 0.04, 0.1]}>
        <boxGeometry args={[0.26, 0.09, 0.4]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
    </NpcMarker>
  );
}

/** Cartero Coco: tucán de bloques con gorra y bolso. */
export function ToucanModel({ position }: { position: [number, number, number] }) {
  return (
    <NpcMarker position={position} height={2.7}>
      {/* Cuerpo */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.85, 1.1, 0.7]} />
        <meshStandardMaterial color="#263238" />
      </mesh>
      {/* Pecho amarillo */}
      <mesh position={[0, 0.65, 0.36]}>
        <boxGeometry args={[0.55, 0.7, 0.04]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* Cabeza */}
      <mesh position={[0, 1.65, 0.05]}>
        <boxGeometry args={[0.7, 0.6, 0.6]} />
        <meshStandardMaterial color="#263238" />
      </mesh>
      {/* Pico enorme (bloque naranjo) */}
      <mesh position={[0, 1.55, 0.65]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.3, 0.26, 0.75]} />
        <meshStandardMaterial color="#fb8500" />
      </mesh>
      <mesh position={[0, 1.44, 0.6]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.6]} />
        <meshStandardMaterial color="#e07000" />
      </mesh>
      {/* Ojos */}
      <mesh position={[-0.18, 1.76, 0.36]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.18, 1.76, 0.36]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.18, 1.76, 0.38]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.18, 1.76, 0.38]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Alas */}
      <mesh position={[-0.52, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.16, 0.8, 0.5]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[0.52, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.16, 0.8, 0.5]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      {/* Gorra azul de cartero */}
      <mesh position={[0, 2.0, 0.05]}>
        <boxGeometry args={[0.76, 0.16, 0.66]} />
        <meshStandardMaterial color="#4361ee" />
      </mesh>
      <mesh position={[0, 1.97, 0.42]}>
        <boxGeometry args={[0.6, 0.08, 0.25]} />
        <meshStandardMaterial color="#2f4bc7" />
      </mesh>
      {/* Bolso de cartas cruzado */}
      <mesh position={[0.5, 0.55, 0.05]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.32, 0.4, 0.2]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0.5, 0.72, 0.05]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.34, 0.1, 0.22]} />
        <meshStandardMaterial color="#6f4518" />
      </mesh>
      {/* Patas */}
      <mesh position={[-0.2, 0.05, 0.05]}>
        <boxGeometry args={[0.2, 0.1, 0.32]} />
        <meshStandardMaterial color="#fb8500" />
      </mesh>
      <mesh position={[0.2, 0.05, 0.05]}>
        <boxGeometry args={[0.2, 0.1, 0.32]} />
        <meshStandardMaterial color="#fb8500" />
      </mesh>
    </NpcMarker>
  );
}
