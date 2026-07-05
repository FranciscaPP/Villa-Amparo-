import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'home' | 'world' | 'studio' | 'mission';
export type MissionId = 'biblioteca' | 'escuela';

export type HairStyle = 'coletas' | 'corto' | 'melena';
export type Accessory = 'ninguno' | 'gorro' | 'lentes' | 'mochila';

export interface Look {
  skin: string;
  hairStyle: HairStyle;
  hairColor: string;
  shirt: string;
  pants: string;
  accessory: Accessory;
}

export const DEFAULT_LOOK: Look = {
  skin: '#ffcf9f',
  hairStyle: 'coletas',
  hairColor: '#5c3a21',
  shirt: '#ff5c8a',
  pants: '#3f6cff',
  accessory: 'ninguno',
};

interface GameState {
  screen: Screen;
  activeMission: MissionId | null;
  look: Look;
  savedLooks: Look[];
  stars: number;
  coins: number;
  missionsDone: Record<MissionId, number>;
  driving: boolean;
  nearThing: string | null; // id del objeto interactivo cercano
  setScreen: (s: Screen) => void;
  startMission: (m: MissionId) => void;
  finishMission: (m: MissionId, stars: number, coins: number) => void;
  setLook: (patch: Partial<Look>) => void;
  saveLook: () => void;
  applyLook: (i: number) => void;
  setDriving: (v: boolean) => void;
  setNearThing: (id: string | null) => void;
}

export const useGame = create<GameState>()(
  persist(
    (set) => ({
      screen: 'home',
      activeMission: null,
      look: DEFAULT_LOOK,
      savedLooks: [],
      stars: 0,
      coins: 0,
      missionsDone: { biblioteca: 0, escuela: 0 },
      driving: false,
      nearThing: null,
      setScreen: (screen) =>
        set((st) => ({
          screen,
          activeMission: screen === 'mission' ? st.activeMission : null,
        })),
      startMission: (m) => set({ screen: 'mission', activeMission: m }),
      finishMission: (m, s, c) =>
        set((st) => ({
          stars: st.stars + s,
          coins: st.coins + c,
          missionsDone: { ...st.missionsDone, [m]: (st.missionsDone[m] ?? 0) + 1 },
        })),
      setLook: (patch) => set((st) => ({ look: { ...st.look, ...patch } })),
      saveLook: () =>
        set((st) => ({ savedLooks: [...st.savedLooks.slice(-3), st.look] })),
      applyLook: (i) => set((st) => ({ look: st.savedLooks[i] ?? st.look })),
      setDriving: (driving) => set({ driving }),
      setNearThing: (nearThing) => set({ nearThing }),
    }),
    {
      name: 'villa-amparo-v2',
      partialize: (s) => ({
        look: s.look,
        savedLooks: s.savedLooks,
        stars: s.stars,
        coins: s.coins,
        missionsDone: s.missionsDone,
      }),
    }
  )
);

// Posiciones fuera de React (sobreviven al desmontar el canvas)
export const avatarState = { x: 2, z: 6, rot: 0 };
export const carState = { x: -4, z: 2.2, rot: Math.PI / 2 };

// Joystick compartido por referencia
export const joystick = { x: 0, y: 0, active: false, wasDrag: false };

(window as any).__villa = { avatarState, carState, joystick };
