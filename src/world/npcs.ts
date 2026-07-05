import type { MissionId } from '../state';
import type { VoiceStyle } from '../voice';
import { BUHO } from '../voice';

export const RANA: VoiceStyle = { pitch: 1.5, rate: 1.08 };
export const TOMATE: VoiceStyle = { pitch: 0.6, rate: 0.95 };
export const COCO: VoiceStyle = { pitch: 1.25, rate: 1.0 };

export interface NpcDef {
  id: string;
  name: string;
  mission: MissionId;
  position: [number, number, number];
  voice: VoiceStyle;
  intro: string;
}

export const NPCS: NpcDef[] = [
  {
    id: 'buho',
    name: 'Doña Búho',
    mission: 'vocales',
    position: [-6.5, 0, -4],
    voice: BUHO,
    intro: '¡Hola! Soy Doña Búho. ¡Las vocales se escaparon en globos! ¿Me ayudas a atraparlas?',
  },
  {
    id: 'rana',
    name: 'Rana Rita',
    mission: 'silabas',
    position: [-9, 0, 9],
    voice: RANA,
    intro: '¡Croac croac! Soy Rita. ¡Mis sílabas se cayeron al río! ¡Ayúdame a fabricarlas de nuevo!',
  },
  {
    id: 'tomate',
    name: 'Don Tomate',
    mission: 'parejas',
    position: [9, 0, 5],
    voice: TOMATE,
    intro: '¡Ay no, ay no! Los carteles de mi mercado están todos revueltos. ¿Me ayudas a ponerlos con su dibujo?',
  },
  {
    id: 'coco',
    name: 'Cartero Coco',
    mission: 'completar',
    position: [1.5, 0, -11],
    voice: COCO,
    intro: '¡Uy uy uy! Soy Coco el cartero. ¡A mis cartas se les cayeron letras en el camino! ¿Me ayudas a completarlas?',
  },
];
