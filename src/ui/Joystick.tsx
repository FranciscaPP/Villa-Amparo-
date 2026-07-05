import { useRef, useState, useCallback } from 'react';
import { joystick } from '../state';

const RADIUS = 55;

interface JoyVisual {
  ox: number;
  oy: number;
  kx: number;
  ky: number;
}

/**
 * Joystick flotante: aparece donde la niña apoya el dedo,
 * en cualquier parte de la pantalla.
 */
export default function Joystick() {
  const [visual, setVisual] = useState<JoyVisual | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const pointerId = useRef<number | null>(null);

  const update = useCallback((cx: number, cy: number) => {
    let dx = cx - origin.current.x;
    let dy = cy - origin.current.y;
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    joystick.x = dx / RADIUS;
    joystick.y = dy / RADIUS;
    setVisual({
      ox: origin.current.x,
      oy: origin.current.y,
      kx: origin.current.x + dx,
      ky: origin.current.y + dy,
    });
  }, []);

  const onDown = (e: React.PointerEvent) => {
    if (pointerId.current !== null) return;
    pointerId.current = e.pointerId;
    origin.current = { x: e.clientX, y: e.clientY };
    joystick.active = true;
    update(e.clientX, e.clientY);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerId.current) return;
    update(e.clientX, e.clientY);
  };

  const end = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerId.current) return;
    pointerId.current = null;
    joystick.x = 0;
    joystick.y = 0;
    joystick.active = false;
    setVisual(null);
  };

  return (
    <div
      className="joy-layer"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {visual && (
        <>
          <div className="joy-base" style={{ left: visual.ox, top: visual.oy }} />
          <div className="joy-knob" style={{ left: visual.kx, top: visual.ky }} />
        </>
      )}
      {!visual && <div className="joy-hint">👆 Toca y arrastra para caminar</div>}
    </div>
  );
}
