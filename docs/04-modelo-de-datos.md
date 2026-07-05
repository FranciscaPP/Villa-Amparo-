# Villa Amparo — Modelo de Datos de Progreso

Todo se guarda **localmente** (localStorage vía Zustand `persist`; IndexedDB si
crece). No hay cuentas ni backend en el MVP. La capa de persistencia queda detrás
de una interfaz (`progress/persistence.ts`) para poder enchufar Supabase después
sin tocar el juego.

## 1. Esquema (TypeScript)

```ts
// ── Perfil ────────────────────────────────────────────────
interface PlayerProfile {
  name: string;              // "Amparo" — usado por las voces
  createdAt: string;         // ISO date
  settings: {
    voiceRate: number;       // velocidad TTS (default 0.9, más lento que adulto)
    musicOn: boolean;
    sessionReminderMin: number; // aviso de descanso (default 20)
  };
}

// ── Contenido (banco de palabras) ─────────────────────────
interface WordEntry {
  id: string;                // "gato"
  text: string;              // "gato"
  syllables: string[];       // ["ga", "to"]
  image: string;             // "🐱" (emoji) o URL de imagen
  level: 1 | 2 | 3 | 4 | 5;
  source: 'builtin' | 'parent';  // la mamá puede agregar palabras
}

interface PhraseEntry {
  id: string;
  text: string;              // "La luna es blanca."
  image: string;             // escena correcta
  distractors: string[];     // imágenes incorrectas para elegir
  level: 4 | 5;
}

// ── Progreso ──────────────────────────────────────────────
type SkillType =
  | 'letters' | 'syllables' | 'wordMatch' | 'wordComplete'
  | 'phrases' | 'copy' | 'unscramble' | 'write';

interface SkillProgress {
  skill: SkillType;
  level: 1 | 2 | 3 | 4 | 5;      // nivel actual (adaptativo)
  levelLockedByParent: boolean;   // si la mamá fijó el nivel
  missionsCompleted: number;
}

interface MissionResult {
  id: string;
  skill: SkillType;
  npc: string;
  startedAt: string;
  rounds: RoundResult[];
  starsEarned: 0 | 1 | 2 | 3;
  coinsEarned: number;
}

interface RoundResult {
  itemId: string;            // palabra/letra/sílaba evaluada
  correctFirstTry: boolean;
  attempts: number;          // 1–3
  chosenWrong: string[];     // qué eligió mal (para el modo mamá)
}

// Estado de aprendizaje por ítem (para repaso espaciado)
interface ItemMastery {
  itemId: string;
  correctStreak: number;     // aciertos seguidos a la primera
  totalSeen: number;
  totalErrors: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  nextReviewAt: string | null;  // repaso espaciado
}

// ── Recompensas ───────────────────────────────────────────
interface Wallet {
  stars: number;             // acumulado histórico (nunca se gastan)
  coins: number;             // se gastan en la tienda
}

interface InventoryItem {
  id: string;                // "gorro-fiesta", "mascota-conejo", "sticker-arcoiris"
  kind: 'clothing' | 'pet' | 'sticker' | 'house-decor';
  unlockedAt: string;
  equipped: boolean;         // ropa puesta / mascota activa
}

// ── Modo mamá ─────────────────────────────────────────────
interface ParentConfig {
  pinHash: string | null;    // PIN de 4 dígitos (o gesto: mantener 3 seg + pregunta)
  customWords: WordEntry[];  // palabras agregadas (source: 'parent')
}
```

## 2. Qué puede ver el modo mamá con estos datos

| Vista | Fuente de datos |
|---|---|
| **Progreso general** — nivel por habilidad, misiones completadas, estrellas | `SkillProgress[]`, `Wallet` |
| **Palabras aprendidas** — dominadas vs. en aprendizaje | `ItemMastery` con `status: 'mastered'` |
| **¿En qué se equivocó?** — ítems con más errores y qué eligió en su lugar (ej: confunde b/d) | `RoundResult.chosenWrong` agregado por ítem |
| **Racha y tiempo** — días jugados, misiones por día | `MissionResult.startedAt` |
| **Agregar palabras** — formulario: palabra + sílabas (autodivididas, editables) + emoji + nivel | escribe en `ParentConfig.customWords` |
| **Fijar dificultad** — subir/bajar/bloquear nivel por habilidad | `SkillProgress.levelLockedByParent` |

## 3. Reglas de persistencia

- **Guardado automático** después de cada ronda (no al final de la misión):
  cerrar la app a mitad de misión nunca pierde progreso.
- **Exportar/importar respaldo:** botón en modo mamá que descarga un JSON con
  todo el estado (y otro para importarlo). Es el seguro contra borrar datos del
  navegador, y el puente futuro hacia la nube.
- **Versionado del esquema:** campo `schemaVersion` en la raíz + migraciones
  simples al cargar, para poder evolucionar el modelo sin perder el progreso.

## 4. Contenido inicial (builtin)

El MVP incluye un banco de contenido curado en `src/content/`:

- 27 letras con su fonema.
- ~40 sílabas directas (niveles 2–3).
- **~120 palabras** etiquetadas por nivel con emoji (mamá, oso, luna, gato,
  casa, pelota, camisa...).
- ~30 frases cortas (niveles 4–5).

Esto da semanas de contenido antes de necesitar que la mamá agregue palabras.
