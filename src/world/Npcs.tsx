import { Html } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import type { Look } from '../state';
import { joystick } from '../state';
import { narrate } from '../voice';

export interface TownNpc {
  id: string;
  name: string;
  position: [number, number, number];
  rotY: number;
  look: Look;
  tapText: string;
  mission: 'biblioteca' | 'escuela' | null;
}

export const TOWN_NPCS: TownNpc[] = [
  {
    id: 'beti',
    name: 'Beti',
    position: [12, 0, -7.5],
    rotY: Math.PI,
    look: {
      skin: '#f1c27d',
      hairStyle: 'melena',
      hairColor: '#8d5524',
      shirt: '#9b5de5',
      pants: '#37474f',
      accessory: 'lentes',
    },
    tapText: 'Beti, la bibliotecaria. Le encanta ordenar los libros por letra.',
    mission: 'biblioteca',
  },
  {
    id: 'pia',
    name: 'Profesora Pía',
    position: [-13, 0, -7.2],
    rotY: Math.PI,
    look: {
      skin: '#ffcf9f',
      hairStyle: 'corto',
      hairColor: '#222222',
      shirt: '#06d6a0',
      pants: '#e07a5f',
      accessory: 'ninguno',
    },
    tapText: 'La profesora Pía. Enseña las letras en la escuela con mucha alegría.',
    mission: 'escuela',
  },
];

export default function Npcs() {
  return (
    <>
      {TOWN_NPCS.map((n) => (
        <group
          key={n.id}
          position={n.position}
          rotation={[0, n.rotY, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (joystick.wasDrag) return;
            narrate(n.tapText);
          }}
        >
          <AvatarModel look={n.look} />
          {n.mission && (
            <Html position={[0, 2.9, 0]} center zIndexRange={[5, 0]}>
              <div className="exclaim">❗</div>
            </Html>
          )}
        </group>
      ))}
    </>
  );
}
