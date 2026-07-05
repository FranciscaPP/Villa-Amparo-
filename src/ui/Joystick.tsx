import { useEffect, useState, useRef } from 'react';
import { joystick } from '../state';

const RADIUS = 55;
const DRAG_THRESHOLD = 12;

interface JoyVisual {
  ox: number;
  oy: number;
  kx: number;
  ky: number;
}

/**
 * Joystick global: escucha en toda la ventana (sin bloquear los toques
 * sobre el mundo 3D). Un toque corto es "tocar para escuchar";
 * arrastrar es caminar/manejar.
 */
export default function Joystick() {
  const [visual, setVisual] = useState<JoyVisual | null>(null);
  const state = useRef({ id: null as number | null, ox: 0, oy: 0 });

  useEffect(() => {
    const down = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      // Los botones y paneles de UI no activan el joystick
      if (el.closest('button, .panel, .hud')) return;
      if (state.current.id !== null) return;
      state.current = { id: e.pointerId, ox: e.clientX, oy: e.clientY };
      joystick.wasDrag = false;
    };
    const move = (e: PointerEvent) => {
      const s = state.current;
      if (e.pointerId !== s.id) return;
      let dx = e.clientX - s.ox;
      let dy = e.clientY - s.oy;
      if (!joystick.active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      joystick.active = true;
      joystick.wasDrag = true;
      const len = Math.hypot(dx, dy);
      if (len > RADIUS) {
        dx = (dx / len) * RADIUS;
        dy = (dy / len) * RADIUS;
      }
      joystick.x = dx / RADIUS;
      joystick.y = dy / RADIUS;
      setVisual({ ox: s.ox, oy: s.oy, kx: s.ox + dx, ky: s.oy + dy });
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== state.current.id) return;
      state.current.id = null;
      joystick.x = 0;
      joystick.y = 0;
      joystick.active = false;
      setVisual(null);
      // wasDrag se limpia un instante después, para que el click
      // que dispara Three.js sepa que fue un arrastre
      setTimeout(() => (joystick.wasDrag = false), 80);
    };
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <>
      {visual && (
        <>
          <div className="joy-base" style={{ left: visual.ox, top: visual.oy }} />
          <div className="joy-knob" style={{ left: visual.kx, top: visual.ky }} />
        </>
      )}
      {!visual && (
        <div className="joy-hint">👆 Arrastra para caminar · toca las cosas para escuchar</div>
      )}
    </>
  );
}
