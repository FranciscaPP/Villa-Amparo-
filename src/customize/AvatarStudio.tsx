import { Canvas } from '@react-three/fiber';
import { useGame, HairStyle, Accessory } from '../state';
import { narrate } from '../voice';
import AvatarModel from '../world/AvatarModel';

const SKINS = ['#ffcf9f', '#f1c27d', '#c68642', '#8d5524'];
const HAIR_COLORS = [
  { c: '#5c3a21', n: 'café' },
  { c: '#222222', n: 'negro' },
  { c: '#e8b04b', n: 'rubio' },
  { c: '#b3541e', n: 'colorín' },
  { c: '#9b5de5', n: 'morado' },
];
const HAIR_STYLES: { id: HairStyle; n: string; icon: string }[] = [
  { id: 'coletas', n: 'coletas', icon: '👧' },
  { id: 'corto', n: 'corto', icon: '💇' },
  { id: 'melena', n: 'melena larga', icon: '👱‍♀️' },
];
const SHIRTS = [
  { c: '#ff5c8a', n: 'rosada' },
  { c: '#ffd166', n: 'amarilla' },
  { c: '#06d6a0', n: 'verde' },
  { c: '#4cc9f0', n: 'celeste' },
  { c: '#9b5de5', n: 'morada' },
  { c: '#e63946', n: 'roja' },
];
const PANTS = [
  { c: '#3f6cff', n: 'azul' },
  { c: '#37474f', n: 'gris' },
  { c: '#ff8fab', n: 'rosado' },
  { c: '#81b29a', n: 'verde' },
];
const ACCESSORIES: { id: Accessory; n: string; icon: string }[] = [
  { id: 'ninguno', n: 'sin accesorio', icon: '✖️' },
  { id: 'gorro', n: 'gorro rojo', icon: '🧢' },
  { id: 'lentes', n: 'lentes morados', icon: '👓' },
  { id: 'mochila', n: 'mochila verde', icon: '🎒' },
];

/** Estudio de personalización: todo se narra al tocarlo. */
export default function AvatarStudio() {
  const look = useGame((s) => s.look);
  const setLook = useGame((s) => s.setLook);
  const saveLook = useGame((s) => s.saveLook);
  const savedLooks = useGame((s) => s.savedLooks);
  const applyLook = useGame((s) => s.applyLook);
  const setScreen = useGame((s) => s.setScreen);

  return (
    <div className="studio panel">
      <div className="studio-preview">
        <Canvas camera={{ fov: 35, position: [0, 1.4, 4.5] }} dpr={[1, 2]}>
          <color attach="background" args={['#b8e6ff']} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 8, 5]} intensity={1.1} />
          <group position={[0, -1.1, 0]} rotation={[0, 0.4, 0]}>
            <AvatarModel look={look} />
          </group>
        </Canvas>
      </div>
      <div className="studio-options">
        <h2>🧍 Mi avatar</h2>

        <div className="opt-row-label">🖐️ Piel</div>
        <div className="opt-row">
          {SKINS.map((c) => (
            <button
              key={c}
              className={`swatch ${look.skin === c ? 'sel' : ''}`}
              style={{ background: c }}
              onClick={() => {
                setLook({ skin: c });
                narrate('Color de piel');
              }}
            />
          ))}
        </div>

        <div className="opt-row-label">💇 Peinado</div>
        <div className="opt-row">
          {HAIR_STYLES.map((h) => (
            <button
              key={h.id}
              className={`swatch icon ${look.hairStyle === h.id ? 'sel' : ''}`}
              onClick={() => {
                setLook({ hairStyle: h.id });
                narrate(`Pelo ${h.n}`);
              }}
            >
              {h.icon}
            </button>
          ))}
          {HAIR_COLORS.map((h) => (
            <button
              key={h.c}
              className={`swatch ${look.hairColor === h.c ? 'sel' : ''}`}
              style={{ background: h.c }}
              onClick={() => {
                setLook({ hairColor: h.c });
                narrate(`Pelo ${h.n}`);
              }}
            />
          ))}
        </div>

        <div className="opt-row-label">👕 Polera</div>
        <div className="opt-row">
          {SHIRTS.map((s) => (
            <button
              key={s.c}
              className={`swatch ${look.shirt === s.c ? 'sel' : ''}`}
              style={{ background: s.c }}
              onClick={() => {
                setLook({ shirt: s.c });
                narrate(`Polera ${s.n}`);
              }}
            />
          ))}
        </div>

        <div className="opt-row-label">👖 Pantalón</div>
        <div className="opt-row">
          {PANTS.map((p) => (
            <button
              key={p.c}
              className={`swatch ${look.pants === p.c ? 'sel' : ''}`}
              style={{ background: p.c }}
              onClick={() => {
                setLook({ pants: p.c });
                narrate(`Pantalón ${p.n}`);
              }}
            />
          ))}
        </div>

        <div className="opt-row-label">🎒 Accesorios</div>
        <div className="opt-row">
          {ACCESSORIES.map((a) => (
            <button
              key={a.id}
              className={`swatch icon ${look.accessory === a.id ? 'sel' : ''}`}
              onClick={() => {
                setLook({ accessory: a.id });
                narrate(a.n);
              }}
            >
              {a.icon}
            </button>
          ))}
        </div>

        {savedLooks.length > 0 && (
          <>
            <div className="opt-row-label">💾 Mis looks guardados</div>
            <div className="opt-row">
              {savedLooks.map((l, i) => (
                <button
                  key={i}
                  className="swatch"
                  style={{ background: `linear-gradient(135deg, ${l.shirt} 50%, ${l.pants} 50%)` }}
                  onClick={() => {
                    applyLook(i);
                    narrate('¡Look aplicado!');
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="studio-actions">
          <button
            className="big-btn small"
            onClick={() => {
              saveLook();
              narrate('¡Look guardado!');
            }}
          >
            💾 GUARDAR LOOK
          </button>
          <button
            className="big-btn small"
            onClick={() => {
              narrate('¡Qué bien te ves!');
              setScreen('world');
            }}
          >
            ✅ LISTO
          </button>
        </div>
      </div>
    </div>
  );
}
