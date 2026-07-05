import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import { narrate } from '../voice';
import { joystick } from '../state';

/** Al tocar cualquier cosa del mundo, dice su nombre y para qué sirve. */
function tappable(text: string) {
  return {
    onClick: (e: any) => {
      e.stopPropagation();
      if (joystick.wasDrag) return; // fue un arrastre para caminar, no un toque
      narrate(text);
    },
  };
}

function Sign({ text, y = 4.2 }: { text: string; y?: number }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[5, 0]}>
      <div className="building-sign">{text}</div>
    </Html>
  );
}

export default function Town() {
  return (
    <group>
      <Ground />
      <Roads />
      {/* Cuadrante noroeste: escuela */}
      <School position={[-13, 0, -11]} />
      {/* Cuadrante noreste: biblioteca y cafetería */}
      <Library position={[12, 0, -11]} />
      <Cafe position={[22, 0, -9]} />
      {/* Cuadrante suroeste: mi casa y parque */}
      <MyHouse position={[-12, 0, 10]} />
      <Park position={[-22, 0, 15]} />
      {/* Cuadrante sureste: tienda */}
      <Shop position={[12, 0, 10]} />
      {/* Decoración urbana */}
      <StreetTrees />
      <Lamps />
      <Fountain />
    </group>
  );
}

function Ground() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        {...tappable('El pasto de Villa Amparo. ¡Qué verde!')}
      >
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial color="#6fce5a" />
      </mesh>
      {/* Borde de la isla */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[64, 2, 64]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
    </>
  );
}

function Roads() {
  const dashesH = Array.from({ length: 10 }, (_, i) => -28 + i * 6);
  return (
    <group {...tappable('La calle. Por aquí pueden pasar los autos.')}>
      {/* Calle horizontal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[64, 5]} />
        <meshStandardMaterial color="#4a4e57" />
      </mesh>
      {/* Calle vertical */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.02]}>
        <planeGeometry args={[5, 64]} />
        <meshStandardMaterial color="#4a4e57" />
      </mesh>
      {/* Veredas */}
      {[3.2, -3.2].map((o, i) => (
        <mesh key={`h${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, o]}>
          <planeGeometry args={[64, 1.2]} />
          <meshStandardMaterial color="#c8cdd6" />
        </mesh>
      ))}
      {[3.2, -3.2].map((o, i) => (
        <mesh key={`v${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[o, 0.02, 0]}>
          <planeGeometry args={[1.2, 64]} />
          <meshStandardMaterial color="#c8cdd6" />
        </mesh>
      ))}
      {/* Líneas segmentadas */}
      {dashesH.map((x, i) => (
        <mesh key={`dh${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, 0]}>
          <planeGeometry args={[2.2, 0.28]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {dashesH.map((z, i) => (
        <mesh key={`dv${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
          <planeGeometry args={[0.28, 2.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

/** Ventana con marco blanco. */
function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.06]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
        <meshStandardMaterial color="#a8dcff" />
      </mesh>
    </group>
  );
}

function Door({ position, color = '#6f4518' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.1, 2.0, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -0.03, 0.03]}>
        <boxGeometry args={[0.9, 1.85, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Building({
  position,
  size,
  color,
  roofColor,
  flat = false,
  narration,
  sign,
  children,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  roofColor?: string;
  flat?: boolean;
  narration: string;
  sign: string;
  children?: ReactNode;
}) {
  const [w, h, d] = size;
  return (
    <group position={position} {...tappable(narration)}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {flat ? (
        <mesh position={[0, h + 0.15, 0]}>
          <boxGeometry args={[w + 0.5, 0.3, d + 0.5]} />
          <meshStandardMaterial color={roofColor ?? '#ffffff'} />
        </mesh>
      ) : (
        <mesh position={[0, h + 0.8, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(w, d) * 0.78, 1.6, 4]} />
          <meshStandardMaterial color={roofColor ?? '#e63946'} flatShading />
        </mesh>
      )}
      <Sign text={sign} y={flat ? h + 1.3 : h + 2.2} />
      {children}
    </group>
  );
}

function School({ position }: { position: [number, number, number] }) {
  return (
    <Building
      position={position}
      size={[8, 4, 6]}
      color="#ffd166"
      roofColor="#f4a261"
      flat
      narration="La escuela. Aquí la profesora Pía te enseña las letras. ¡Entra a jugar con ella!"
      sign="🏫 ESCUELA"
    >
      <Door position={[0, 1.0, 3.04]} color="#4361ee" />
      <Window position={[-2.5, 2.6, 3.04]} />
      <Window position={[2.5, 2.6, 3.04]} />
      <Window position={[-2.5, 1.2, 3.04]} />
      <Window position={[2.5, 1.2, 3.04]} />
      {/* Reloj */}
      <mesh position={[0, 3.4, 3.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </Building>
  );
}

function Library({ position }: { position: [number, number, number] }) {
  return (
    <Building
      position={position}
      size={[7, 3.6, 5.5]}
      color="#b08968"
      roofColor="#6f4518"
      narration="La biblioteca. Está llena de libros y de palabras. Beti la bibliotecaria necesita tu ayuda."
      sign="📚 BIBLIOTECA"
    >
      <Door position={[0, 1.0, 2.79]} />
      <Window position={[-2.2, 2.2, 2.79]} />
      <Window position={[2.2, 2.2, 2.79]} />
      {/* Columnas */}
      <mesh position={[-3.0, 1.4, 2.9]}>
        <boxGeometry args={[0.4, 2.8, 0.4]} />
        <meshStandardMaterial color="#f2e8cf" />
      </mesh>
      <mesh position={[3.0, 1.4, 2.9]}>
        <boxGeometry args={[0.4, 2.8, 0.4]} />
        <meshStandardMaterial color="#f2e8cf" />
      </mesh>
    </Building>
  );
}

function Cafe({ position }: { position: [number, number, number] }) {
  return (
    <Building
      position={position}
      size={[4.5, 3, 4.5]}
      color="#e07a5f"
      roofColor="#81b29a"
      flat
      narration="La cafetería. ¡Mmm! Huele a chocolate caliente y a galletas."
      sign="☕ CAFETERÍA"
    >
      <Door position={[0, 1.0, 2.29]} color="#81b29a" />
      <Window position={[-1.4, 1.8, 2.29]} />
      <Window position={[1.4, 1.8, 2.29]} />
      {/* Taza gigante en el techo */}
      <mesh position={[0, 3.7, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.7, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </Building>
  );
}

function MyHouse({ position }: { position: [number, number, number] }) {
  return (
    <Building
      position={position}
      size={[5, 3, 4.5]}
      color="#ff8fab"
      roofColor="#e63946"
      narration="¡Mi casa! Aquí vives tú. Muy pronto podrás decorarla por dentro."
      sign="🏠 MI CASA"
    >
      <Door position={[0, 1.0, 2.29]} />
      <Window position={[-1.6, 1.9, 2.29]} />
      <Window position={[1.6, 1.9, 2.29]} />
    </Building>
  );
}

function Shop({ position }: { position: [number, number, number] }) {
  return (
    <Building
      position={position}
      size={[6, 3.2, 5]}
      color="#8ecae6"
      roofColor="#219ebc"
      flat
      narration="La tienda. Aquí puedes comprar cosas leyendo sus nombres. ¡Pronto abrirá!"
      sign="🛒 TIENDA"
    >
      <Door position={[0, 1.0, 2.54]} color="#219ebc" />
      <Window position={[-1.9, 1.9, 2.54]} />
      <Window position={[1.9, 1.9, 2.54]} />
      {/* Toldo */}
      {[-1.9, -0.63, 0.63, 1.9].map((x, i) => (
        <mesh key={i} position={[x, 2.6, 2.85]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[1.25, 0.06, 1.1]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#e63946' : '#ffffff'} />
        </mesh>
      ))}
    </Building>
  );
}

function Park({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} {...tappable('El parque. ¡A jugar en el columpio entre las flores!')}>
      <Sign text="🌳 PARQUE" y={4.5} />
      {/* Columpio */}
      <mesh position={[-1, 1.3, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.16, 2.6, 0.16]} />
        <meshStandardMaterial color="#e07000" />
      </mesh>
      <mesh position={[1, 1.3, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.16, 2.6, 0.16]} />
        <meshStandardMaterial color="#e07000" />
      </mesh>
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[2.4, 0.16, 0.16]} />
        <meshStandardMaterial color="#fb8500" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.04, 1.4, 0.04]} />
        <meshStandardMaterial color="#8d99ae" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.35]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* Flores */}
      {[[-2.5, 2], [3, 1.5], [-2, -2], [3.5, -1.5], [0.5, 3]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial color="#3fa34d" />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.28, 0.28, 0.28]} />
            <meshStandardMaterial color={['#ef476f', '#ffd166', '#9b5de5', '#4cc9f0', '#ff8fab'][i]} />
          </mesh>
        </group>
      ))}
      {/* Árboles del parque */}
      <TreeBlock x={-4} z={0} />
      <TreeBlock x={5} z={2} />
    </group>
  );
}

function TreeBlock({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[1.9, 1.4, 1.9]} />
        <meshStandardMaterial color="#3fa34d" />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[1.1, 0.8, 1.1]} />
        <meshStandardMaterial color="#5cc244" />
      </mesh>
    </group>
  );
}

function StreetTrees() {
  const spots: [number, number][] = [
    [-8, -4.5], [-18, -4.5], [8, -4.5], [18, -4.5],
    [-8, 4.5], [-18, 4.5], [8, 4.5], [18, 4.5],
    [-4.5, -18], [4.5, -18], [-4.5, 18], [4.5, 18],
  ];
  return (
    <group {...tappable('Un árbol. Da sombra fresquita.')}>
      {spots.map(([x, z], i) => (
        <TreeBlock key={i} x={x} z={z} />
      ))}
    </group>
  );
}

function Lamps() {
  const spots: [number, number][] = [
    [-3.8, -3.8], [3.8, -3.8], [-3.8, 3.8], [3.8, 3.8],
  ];
  return (
    <group {...tappable('Un farol. Ilumina la calle de noche.')}>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#37474f" />
          </mesh>
          <mesh position={[0, 2.9, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#fff3b0" emissive="#ffd166" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Fountain() {
  const star = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (star.current) {
      star.current.rotation.y = clock.elapsedTime * 1.5;
      star.current.position.y = 2.0 + Math.sin(clock.elapsedTime * 2) * 0.15;
    }
  });
  return (
    <group position={[-13, 0, 0.0]} {...tappable('La fuente de Villa Amparo. ¡Pide un deseo!')}>
      {/* La fuente está en la vereda ancha junto a la calle */}
      <mesh position={[0, 0.3, -6.5]}>
        <boxGeometry args={[3, 0.6, 3]} />
        <meshStandardMaterial color="#adb5bd" />
      </mesh>
      <mesh position={[0, 0.62, -6.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#4cc9f0" />
      </mesh>
      <mesh position={[0, 0.95, -6.5]}>
        <boxGeometry args={[0.4, 0.9, 0.4]} />
        <meshStandardMaterial color="#adb5bd" />
      </mesh>
      <mesh ref={star} position={[0, 2.0, -6.5]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, 0.5, 0.15]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
