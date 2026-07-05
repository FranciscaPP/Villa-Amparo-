const HOUSES: { pos: [number, number, number]; color: string; rot: number }[] = [
  { pos: [-8, 0, -6], color: '#ff8fab', rot: 0.5 },
  { pos: [8, 0, -7], color: '#8ecae6', rot: -0.5 },
  { pos: [-9, 0, 4], color: '#ffd166', rot: 1.2 },
  { pos: [9, 0, 5], color: '#b5e48c', rot: -1.2 },
];

const TREES: [number, number][] = [
  [-14, -10], [14, -12], [-16, 2], [16, 0], [-12, 12], [12, 12], [0, -16], [-5, 15], [6, 15],
];

export default function Village() {
  return (
    <group>
      {/* Pasto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#7ed957" />
      </mesh>
      {/* Plaza central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#f4d58d" />
      </mesh>
      <Fountain />
      {HOUSES.map((h, i) => (
        <House key={i} position={h.pos} color={h.color} rotation={h.rot} />
      ))}
      {TREES.map(([x, z], i) => (
        <Tree key={i} x={x} z={z} />
      ))}
    </group>
  );
}

function House({
  position,
  color,
  rotation,
}: {
  position: [number, number, number];
  color: string;
  rotation: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.6, 2.2, 2.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.3, 1.6, 4]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      {/* Puerta */}
      <mesh position={[0, 0.65, 1.31]}>
        <boxGeometry args={[0.7, 1.3, 0.05]} />
        <meshStandardMaterial color="#6f4518" />
      </mesh>
      {/* Ventana */}
      <mesh position={[0.85, 1.4, 1.31]}>
        <boxGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial color="#fff9c4" />
      </mesh>
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 1.6, 8]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color="#3fa34d" />
      </mesh>
      <mesh position={[0.5, 2.7, 0.2]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#5cc244" />
      </mesh>
    </group>
  );
}

function Fountain() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.5, 24]} />
        <meshStandardMaterial color="#adb5bd" />
      </mesh>
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 24]} />
        <meshStandardMaterial color="#4cc9f0" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.9, 12]} />
        <meshStandardMaterial color="#adb5bd" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#4cc9f0" />
      </mesh>
    </group>
  );
}
