import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'home' | 'world' | 'mission';
export type MissionId = 'vocales' | 'silabas' | 'parejas' | 'completar';

interface GameState {
  screen: Screen;
  activeMission: MissionId | null;
  stars: number;
  coins: number;
  progress: Record<MissionId, number>; // misiones completadas por tipo
  nearNpc: string | null;              // id del NPC cercano
  setScreen: (s: Screen) => void;
  startMission: (m: MissionId) => void;
  finishMission: (m: MissionId, stars: number, coins: number) => void;
  setNearNpc: (id: string | null) => void;
}

export const useGame = create<GameState>()(
  persist(
    (set) => ({
      screen: 'home',
      activeMission: null,
      stars: 0,
      coins: 0,
      progress: { vocales: 0, silabas: 0, parejas: 0, completar: 0 },
      nearNpc: null,
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
          progress: { ...st.progress, [m]: (st.progress[m] ?? 0) + 1 },
        })),
      setNearNpc: (nearNpc) => set({ nearNpc }),
    }),
    {
      name: 'villa-amparo',
      partialize: (s) => ({ stars: s.stars, coins: s.coins, progress: s.progress }),
    }
  )
);

// Posición del avatar fuera de React para que sobreviva al desmontar el
// canvas 3D mientras se juega una misión.
export const avatarState = { x: 0, z: 5, rot: 0 };

// Vector del joystick, compartido por referencia (sin re-renders).
export const joystick = { x: 0, y: 0, active: false };

// Gancho para pruebas automatizadas.
(window as any).__villa = { avatarState, joystick };
