import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'home' | 'world' | 'mission';

interface GameState {
  screen: Screen;
  stars: number;
  coins: number;
  nearNpc: boolean;
  setScreen: (s: Screen) => void;
  addRewards: (stars: number, coins: number) => void;
  setNearNpc: (v: boolean) => void;
}

export const useGame = create<GameState>()(
  persist(
    (set) => ({
      screen: 'home',
      stars: 0,
      coins: 0,
      nearNpc: false,
      setScreen: (screen) => set({ screen }),
      addRewards: (s, c) =>
        set((st) => ({ stars: st.stars + s, coins: st.coins + c })),
      setNearNpc: (nearNpc) => set({ nearNpc }),
    }),
    {
      name: 'villa-amparo',
      partialize: (s) => ({ stars: s.stars, coins: s.coins }),
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
