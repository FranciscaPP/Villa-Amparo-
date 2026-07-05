import { useGame } from '../state';

export default function Hud() {
  const stars = useGame((s) => s.stars);
  const coins = useGame((s) => s.coins);
  return (
    <div className="hud">
      <div className="chip">⭐ {stars}</div>
      <div className="chip">🪙 {coins}</div>
    </div>
  );
}
