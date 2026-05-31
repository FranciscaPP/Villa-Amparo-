# ARQUITECTURA TÉCNICA — VILLA AMPARO
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Arquitectura Frontend](#4-arquitectura-frontend)
5. [Arquitectura Backend (Supabase)](#5-arquitectura-backend-supabase)
6. [Sistema de IA (OpenAI)](#6-sistema-de-ia-openai)
7. [Sistema de Voz (TTS)](#7-sistema-de-voz-tts)
8. [Motor de Juego (Three.js)](#8-motor-de-juego-threejs)
9. [Sistema de Estado (Zustand)](#9-sistema-de-estado-zustand)
10. [Flujos de Datos](#10-flujos-de-datos)
11. [Seguridad](#11-seguridad)
12. [Performance](#12-performance)
13. [Deploy y DevOps](#13-deploy-y-devops)
14. [Variables de Entorno](#14-variables-de-entorno)

---

## 1. VISIÓN GENERAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  React 18    │  │  Three.js    │  │   Web Speech API     │  │
│  │  (UI/UX)     │  │  (3D World)  │  │   ElevenLabs TTS     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         └─────────────────┴──────────────────────┘             │
│                           │                                     │
│                    ┌──────┴───────┐                             │
│                    │   Zustand    │                             │
│                    │  (Estado)    │                             │
│                    └──────┬───────┘                             │
└───────────────────────────┼─────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
    ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
    │  Supabase   │  │  OpenAI     │  │ ElevenLabs  │
    │             │  │  GPT-4o     │  │    TTS      │
    │ • Auth      │  │             │  │             │
    │ • Database  │  │ • Adaptar   │  │ • Voz Lumi  │
    │ • Storage   │  │   contenido │  │ • Narración │
    │ • Realtime  │  │ • Generar   │  │ • Efectos   │
    │             │  │   desafíos  │  │             │
    └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 2. STACK TECNOLÓGICO

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 18.3 | Framework UI principal |
| Three.js | 0.165 | Motor 3D del mundo de juego |
| React Three Fiber | 8.x | Integración React + Three.js |
| Drei | 9.x | Helpers para R3F |
| Tailwind CSS | 3.4 | Estilos de UI (HUD, menús) |
| Zustand | 4.5 | Estado global del juego |
| React Router | 6.x | Navegación entre pantallas |
| Vite | 5.x | Build tool y dev server |
| TypeScript | 5.x | Tipado estático |

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Supabase | Latest | Backend as a Service |
| PostgreSQL | 15 | Base de datos principal |
| Supabase Auth | - | Autenticación (padres) |
| Supabase Storage | - | Assets del juego |
| Supabase Realtime | - | Progreso en tiempo real |
| Supabase Edge Functions | - | Lógica serverless |

### Servicios Externos

| Servicio | Propósito | Tier MVP |
|---------|-----------|---------|
| OpenAI GPT-4o mini | IA adaptativa | Pay-as-you-go |
| ElevenLabs | TTS de alta calidad | Starter ($5/mes) |
| Web Speech API | TTS fallback (gratis) | Incluido en browser |
| Vercel | Hosting frontend | Hobby (gratis) |
| Cloudflare | CDN de assets | Free tier |

### Herramientas de Desarrollo

| Tool | Propósito |
|------|-----------|
| ESLint + Prettier | Calidad de código |
| Husky | Pre-commit hooks |
| Vitest | Unit testing |
| Playwright | E2E testing |
| Storybook | Desarrollo de componentes |

---

## 3. ESTRUCTURA DEL PROYECTO

```
villa-amparo/
├── public/
│   ├── assets/
│   │   ├── models/          # Modelos 3D (.glb, .gltf)
│   │   │   ├── characters/  # Avatar, NPCs, mascotas
│   │   │   ├── world/       # Edificios, árboles, objetos
│   │   │   └── furniture/   # Muebles del hogar
│   │   ├── textures/        # Texturas para modelos 3D
│   │   ├── audio/
│   │   │   ├── music/       # BGM por zona
│   │   │   ├── sfx/         # Efectos de sonido
│   │   │   └── letters/     # Sonidos de cada letra
│   │   └── images/
│   │       ├── ui/          # Íconos, botones
│   │       └── objects/     # Imágenes de objetos para actividades
│   └── index.html
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── pages/               # Rutas principales
│   │   ├── Splash.tsx       # Pantalla de carga
│   │   ├── Login.tsx        # Login de padres
│   │   ├── PlayerSelect.tsx # Selección de jugador (niño)
│   │   ├── AvatarCreator.tsx# Creación de personaje
│   │   ├── Game.tsx         # Pantalla principal del juego
│   │   ├── Home.tsx         # Casa del jugador
│   │   ├── ParentDashboard.tsx # Panel de padres
│   │   └── Settings.tsx
│   │
│   ├── game/                # Lógica del motor de juego
│   │   ├── engine/
│   │   │   ├── GameEngine.ts      # Loop principal
│   │   │   ├── InputManager.ts    # Manejo de controles
│   │   │   ├── AudioManager.ts    # Sistema de audio
│   │   │   └── CameraController.ts
│   │   │
│   │   ├── world/
│   │   │   ├── WorldMap.tsx       # Mapa completo
│   │   │   ├── zones/
│   │   │   │   ├── VillaCenter.tsx
│   │   │   │   ├── LetterForest.tsx
│   │   │   │   ├── WordCity.tsx
│   │   │   │   ├── StoryMountain.tsx
│   │   │   │   ├── MathIsland.tsx
│   │   │   │   ├── UnderwaterWorld.tsx
│   │   │   │   ├── EducationalFarm.tsx
│   │   │   │   └── CreativityPark.tsx
│   │   │   └── objects/
│   │   │       ├── InteractableObject.tsx
│   │   │       ├── FloatingLetter.tsx
│   │   │       └── CollectibleItem.tsx
│   │   │
│   │   ├── characters/
│   │   │   ├── PlayerCharacter.tsx
│   │   │   ├── Lumi.tsx           # Guía de voz/visual
│   │   │   ├── NPCBase.tsx
│   │   │   └── npcs/
│   │   │       ├── OldTomas.tsx
│   │   │       ├── FarmerBerta.tsx
│   │   │       ├── PiratMax.tsx
│   │   │       └── LetterCharacters.tsx
│   │   │
│   │   ├── minigames/
│   │   │   ├── MinigameBase.tsx
│   │   │   ├── letter/
│   │   │   │   ├── LetterRecognition.tsx
│   │   │   │   ├── LetterTracing.tsx
│   │   │   │   ├── SyllableBuilder.tsx
│   │   │   │   └── WordBuilder.tsx
│   │   │   ├── reading/
│   │   │   │   ├── WordAssociation.tsx
│   │   │   │   ├── PhonicsGame.tsx
│   │   │   │   └── ComprehensionQuiz.tsx
│   │   │   └── math/
│   │   │       ├── CountingGame.tsx
│   │   │       ├── VisualAddition.tsx
│   │   │       ├── VisualSubtraction.tsx
│   │   │       └── PatternRecognition.tsx
│   │   │
│   │   └── systems/
│   │       ├── MissionSystem.ts
│   │       ├── RewardSystem.ts
│   │       ├── ProgressTracker.ts
│   │       └── AdaptiveAI.ts
│   │
│   ├── components/           # Componentes de UI
│   │   ├── hud/
│   │   │   ├── GameHUD.tsx
│   │   │   ├── CoinDisplay.tsx
│   │   │   ├── MissionTracker.tsx
│   │   │   └── LumiWidget.tsx
│   │   ├── avatar/
│   │   │   ├── AvatarBuilder.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── AccessorySelector.tsx
│   │   ├── home/
│   │   │   ├── RoomView.tsx
│   │   │   ├── FurniturePlacer.tsx
│   │   │   └── FurnitureCatalog.tsx
│   │   ├── minigame/
│   │   │   ├── MinigameContainer.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   ├── DragDropLetter.tsx
│   │   │   └── SuccessAnimation.tsx
│   │   └── ui/
│   │       ├── BigButton.tsx
│   │       ├── VoiceButton.tsx
│   │       ├── CoinAnimation.tsx
│   │       └── LoadingScreen.tsx
│   │
│   ├── stores/               # Estado global (Zustand)
│   │   ├── gameStore.ts      # Estado principal del juego
│   │   ├── playerStore.ts    # Datos del jugador
│   │   ├── progressStore.ts  # Progreso educativo
│   │   ├── inventoryStore.ts # Inventario de objetos
│   │   └── audioStore.ts     # Estado del audio
│   │
│   ├── services/             # Servicios externos
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── openai.ts         # Cliente OpenAI
│   │   ├── tts.ts            # Text-to-Speech
│   │   └── analytics.ts      # Analytics básico
│   │
│   ├── hooks/                # Custom React Hooks
│   │   ├── useGameLoop.ts
│   │   ├── useVoice.ts       # Hook de narración
│   │   ├── useProgress.ts
│   │   ├── useMissions.ts
│   │   └── useAdaptiveAI.ts
│   │
│   ├── data/                 # Datos estáticos del juego
│   │   ├── letters.ts        # Config de cada letra
│   │   ├── words.ts          # Vocabulario por nivel
│   │   ├── missions.ts       # Definición de misiones
│   │   ├── npcs.ts           # Config de NPCs
│   │   ├── furniture.ts      # Catálogo de muebles
│   │   └── curriculum.ts     # Secuencia educativa
│   │
│   ├── types/                # TypeScript types
│   │   ├── game.types.ts
│   │   ├── player.types.ts
│   │   ├── education.types.ts
│   │   └── supabase.types.ts
│   │
│   └── utils/
│       ├── audio.ts
│       ├── animations.ts
│       └── helpers.ts
│
├── supabase/
│   ├── migrations/           # Migraciones de BD
│   ├── functions/            # Edge Functions
│   │   ├── adaptive-ai/      # Motor de IA adaptativa
│   │   ├── generate-challenge/ # Generar desafíos
│   │   └── tts-proxy/        # Proxy para TTS
│   └── seed.sql              # Datos iniciales
│
├── docs/                     # Documentación
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. ARQUITECTURA FRONTEND

### Gestión de Estado con Zustand

```typescript
// stores/gameStore.ts
interface GameStore {
  // Estado del juego
  currentZone: ZoneId
  gamePhase: 'loading' | 'exploring' | 'minigame' | 'cutscene' | 'home'
  isPaused: boolean
  sessionStartTime: Date

  // Estado de Lumi
  lumiMessage: string | null
  lumiAnimation: LumiAnimation
  isLumiSpeaking: boolean

  // Acciones
  setZone: (zone: ZoneId) => void
  triggerMinigame: (minigame: MinigameConfig) => void
  lumiSpeak: (script: string, animation?: LumiAnimation) => void
}

// stores/playerStore.ts
interface PlayerStore {
  // Identidad
  playerId: string
  playerName: string
  avatarConfig: AvatarConfig

  // Progreso
  level: number
  experience: number
  coins: number
  unlockedZones: ZoneId[]

  // Acciones
  addCoins: (amount: number) => void
  addExperience: (amount: number) => void
  unlockZone: (zoneId: ZoneId) => void
}

// stores/progressStore.ts
interface ProgressStore {
  // Progreso educativo
  lettersLearned: Record<string, LetterProgress>
  wordsLearned: string[]
  mathLevel: number
  readingLevel: number

  // Métricas de sesión
  correctAnswers: number
  incorrectAnswers: number
  activitiesCompleted: number

  // IA adaptativa
  adaptiveLevel: AdaptiveProfile

  // Acciones
  recordAnswer: (correct: boolean, topic: EducationTopic) => void
  updateAdaptiveProfile: () => void
}
```

### Componente Principal del Juego

```typescript
// pages/Game.tsx
const Game: React.FC = () => {
  const { currentZone, gamePhase } = useGameStore()
  const { playerName } = usePlayerStore()
  const { isLumiSpeaking, lumiMessage } = useGameStore()

  return (
    <div className="game-container">
      {/* Canvas 3D del mundo */}
      <Canvas>
        <Suspense fallback={<LoadingScene />}>
          <WorldRenderer zone={currentZone} />
          <PlayerCharacter />
          <Lumi />
          <NPCLayer zone={currentZone} />
          <ObjectLayer zone={currentZone} />
        </Suspense>
        <CameraController />
        <Lighting />
      </Canvas>

      {/* HUD superpuesto */}
      <GameHUD />
      <LumiWidget />
      <MissionTracker />
      <CoinDisplay />

      {/* Mini-juegos (overlay) */}
      {gamePhase === 'minigame' && <MinigameOverlay />}

      {/* Cutscenes */}
      {gamePhase === 'cutscene' && <CutscenePlayer />}
    </div>
  )
}
```

### Sistema de Voz (Hook)

```typescript
// hooks/useVoice.ts
export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const currentAudio = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (
    text: string,
    options: SpeakOptions = {}
  ) => {
    // Cancelar audio anterior
    if (currentAudio.current) {
      currentAudio.current.pause()
    }

    setIsSpeaking(true)

    try {
      // Intentar ElevenLabs primero
      const audioUrl = await elevenLabsTTS(text, options.voice ?? 'lumi')
      const audio = new Audio(audioUrl)
      currentAudio.current = audio

      audio.onended = () => setIsSpeaking(false)
      await audio.play()
    } catch {
      // Fallback a Web Speech API
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.85
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause()
    }
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stopSpeaking, isSpeaking }
}
```

---

## 5. ARQUITECTURA BACKEND (SUPABASE)

### Configuración del Cliente

```typescript
// services/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: { eventsPerSecond: 10 }
    }
  }
)
```

### Edge Functions

#### 1. Función: `adaptive-ai`
```typescript
// supabase/functions/adaptive-ai/index.ts
// Analiza el progreso del niño y adapta el currículo
Deno.serve(async (req) => {
  const { playerId, sessionData } = await req.json()

  // Obtener historial de progreso
  const progressHistory = await getProgressHistory(playerId)

  // Llamar a OpenAI para análisis
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: ADAPTIVE_AI_SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify({ progressHistory, sessionData }) }
    ],
    response_format: { type: 'json_object' }
  })

  const adaptation = JSON.parse(response.choices[0].message.content)

  // Guardar perfil adaptado en BD
  await updateAdaptiveProfile(playerId, adaptation)

  return new Response(JSON.stringify(adaptation))
})
```

#### 2. Función: `tts-proxy`
```typescript
// supabase/functions/tts-proxy/index.ts
// Proxy seguro para ElevenLabs (oculta API key)
Deno.serve(async (req) => {
  const { text, voiceId } = await req.json()

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.75, similarity_boost: 0.85 }
      })
    }
  )

  const audioBuffer = await response.arrayBuffer()
  return new Response(audioBuffer, {
    headers: { 'Content-Type': 'audio/mpeg' }
  })
})
```

---

## 6. SISTEMA DE IA (AIProviderService — Agnóstico)

### AIProviderService — Arquitectura Agnóstica

El sistema de IA de Villa Amparo usa una capa central `AIProviderService` que permite intercambiar proveedores (Claude, OpenAI, Gemini, Azure AI, Ollama) sin modificar el resto de la aplicación.

**Ver documentación completa:** [AI_SERVICE.md](AI_SERVICE.md)

```typescript
// services/ai/index.ts — Punto de entrada único (toda la app usa esto)
import { aiService } from './services/ai'

// Generar desafío educativo
const challenge = await aiService.complete({
  type: 'generate_challenge',
  parameters: { topic: 'letter_M', difficulty: 1 }
}, playerProfile)

// Adaptar currículo
const adaptation = await aiService.complete({
  type: 'adapt_curriculum',
  parameters: {}
}, playerProfile)

// Generar historia personalizada
const story = await aiService.complete({
  type: 'generate_story',
  parameters: { educationalGoal: 'letter_M', setting: 'letter_forest' }
}, playerProfile)
```

### Proveedores Soportados

| Proveedor | Clase | Modelo por defecto |
|-----------|-------|-------------------|
| Claude (Anthropic) | `ClaudeProvider` | `claude-haiku-4-5-20251001` |
| OpenAI | `OpenAIProvider` | `gpt-4o-mini` |
| Google Gemini | `GeminiProvider` | `gemini-1.5-flash` |
| Azure AI | `OpenAIProvider` (con baseURL) | Configurable |
| Ollama (local) | `OllamaProvider` | `llama3.2:3b` |
| Custom | `CustomProvider` | Configurable |

---

## 7. SISTEMA DE VOZ (TTS)

### Arquitectura de Voz

```
Texto de narración
      │
      ▼
┌─────────────────┐
│  TTSManager     │
│                 │
│ 1. Verificar    │
│    caché local  │
└────────┬────────┘
         │ No en caché
         ▼
┌─────────────────┐     Éxito    ┌─────────────────┐
│  ElevenLabs     │ ──────────→  │  Reproducir     │
│  (via Supabase  │              │  audio MP3      │
│   Edge Function)│              └─────────────────┘
└────────┬────────┘
         │ Error / Sin conexión
         ▼
┌─────────────────┐     Éxito    ┌─────────────────┐
│  Web Speech API │ ──────────→  │  Reproducir     │
│  (Browser       │              │  síntesis local │
│   built-in)     │              └─────────────────┘
└────────┬────────┘
         │ No disponible
         ▼
┌─────────────────┐
│  Subtítulos     │
│  visuales       │
│  (fallback)     │
└─────────────────┘
```

### Caché de Audio

```typescript
class TTSCache {
  private cache: Map<string, string> = new Map()
  private maxSize = 100 // URLs de audio en memoria

  async get(text: string): Promise<string | null> {
    const key = this.hashText(text)
    return this.cache.get(key) ?? null
  }

  async preload(scripts: string[]): Promise<void> {
    // Precargar los audios más comunes al inicio
    const priorities = [
      '¡Muy bien!',
      '¡Buen intento!',
      '¡Increíble!',
      'Volvamos a intentarlo.',
      ...scripts
    ]
    for (const text of priorities) {
      const url = await this.fetchFromElevenLabs(text)
      this.cache.set(this.hashText(text), url)
    }
  }
}
```

---

## 8. MOTOR DE JUEGO (THREE.JS)

### Escena Principal

```typescript
// game/world/WorldMap.tsx
const WorldMap: React.FC<{ zone: ZoneId }> = ({ zone }) => {
  return (
    <>
      {/* Iluminación ambiental */}
      <ambientLight intensity={0.6} color="#ffe4b5" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Skybox */}
      <Environment preset="sunset" />

      {/* Terreno */}
      <Terrain zone={zone} />

      {/* Vegetación y decoración */}
      <ZoneDecoration zone={zone} />

      {/* Objetos interactivos */}
      <InteractableObjects zone={zone} />

      {/* Partículas mágicas */}
      <MagicParticles zone={zone} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={0.5} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </>
  )
}
```

### Personaje del Jugador

```typescript
// game/characters/PlayerCharacter.tsx
const PlayerCharacter: React.FC = () => {
  const { avatarConfig } = usePlayerStore()
  const { position, velocity } = useCharacterPhysics()
  const animations = useAnimations(avatarConfig)

  return (
    <group position={position}>
      {/* Modelo 3D del avatar */}
      <AvatarModel config={avatarConfig} />

      {/* Sombra */}
      <mesh receiveShadow>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>

      {/* Efecto de partículas al moverse */}
      {velocity.magnitude > 0.1 && <MovementParticles />}

      {/* Mascota acompañante */}
      <Pet petType={avatarConfig.pet} />
    </group>
  )
}
```

### Sistema de Colisiones (Simplificado)

```typescript
// Usamos un sistema de grid para colisiones (sin física compleja)
class SimpleCollisionSystem {
  private grid: boolean[][] // true = bloqueado

  canMoveTo(x: number, z: number): boolean {
    const gridX = Math.floor(x)
    const gridZ = Math.floor(z)
    return !this.grid[gridX]?.[gridZ]
  }

  // Para MVP: colisiones con cajas delimitadoras (AABB)
  checkAABB(obj1: BoundingBox, obj2: BoundingBox): boolean {
    return (
      Math.abs(obj1.x - obj2.x) < (obj1.width + obj2.width) / 2 &&
      Math.abs(obj1.z - obj2.z) < (obj1.depth + obj2.depth) / 2
    )
  }
}
```

---

## 9. SISTEMA DE ESTADO (ZUSTAND)

### Flujo de Estado del Juego

```
Acción del Jugador
       │
       ▼
  Store de Zustand ──→ Supabase (sync en background)
       │
       ▼
  React re-render
       │
       ▼
  Three.js update
```

### Persistencia

```typescript
// Zustand con persistencia en localStorage (sesión local)
// + sync a Supabase (persistencia cloud)

const usePlayerStore = create<PlayerStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // estado...
    })),
    {
      name: 'villa-amparo-player',
      // Solo guardar campos esenciales localmente
      partialize: (state) => ({
        playerId: state.playerId,
        playerName: state.playerName,
        coins: state.coins,
      })
    }
  )
)

// Sync a Supabase cada 30 segundos o en eventos clave
const syncToSupabase = debounce(async (state: PlayerStore) => {
  await supabase
    .from('player_progress')
    .upsert({
      player_id: state.playerId,
      coins: state.coins,
      level: state.level,
      updated_at: new Date().toISOString()
    })
}, 30000)
```

---

## 10. FLUJOS DE DATOS

### Flujo: Inicio de Sesión del Niño

```
1. Padre ingresa con email/password (Supabase Auth)
2. Panel muestra perfiles de niños de la familia
3. Niño selecciona su perfil (sin contraseña)
4. Carga del estado del jugador desde Supabase
5. Pantalla de inicio del juego
```

### Flujo: Actividad Educativa

```
1. Niño interactúa con objeto en el mundo
2. Sistema detecta oportunidad educativa
3. Supabase consulta: ¿qué ha aprendido este niño?
4. Motor adaptativo selecciona nivel apropiado
5. Se genera actividad (local o via OpenAI)
6. TTS narra las instrucciones
7. Niño responde
8. Sistema evalúa respuesta
9. Si correcto: animación + monedas + actualizar progreso
10. Si incorrecto: pista + reintento
11. Guardar resultado en Supabase (background)
```

### Flujo: Sincronización de Progreso

```
[En memoria - Zustand]
Respuestas → progressStore.recordAnswer()
                    │
                    ▼ (cada 30s o al cerrar sesión)
[Supabase - PostgreSQL]
INSERT INTO activity_logs (player_id, topic, correct, timestamp)
UPDATE player_progress SET letters_learned = ..., level = ...
```

---

## 11. SEGURIDAD

### Seguridad para Niños (COPPA Compliance)

1. **Sin datos personales del niño** — solo username/avatar
2. **Autenticación** — solo padres crean cuenta
3. **Sin chat en tiempo real** — juego single-player
4. **Sin publicidad** — modelo de suscripción
5. **Sin compras dentro del juego** — todo se desbloquea jugando
6. **Sin redes sociales** — no compartir en plataformas externas
7. **Sin fotos** — no acceso a cámara/micrófono (excepto si se implementa input de voz)

### Row Level Security (RLS) en Supabase

```sql
-- Los padres solo ven sus propios hijos
CREATE POLICY "parents_see_own_children"
ON players FOR ALL
USING (auth.uid() = parent_user_id);

-- El progreso solo es visible al dueño del perfil
CREATE POLICY "progress_own_player"
ON player_progress FOR ALL
USING (
  player_id IN (
    SELECT id FROM players
    WHERE parent_user_id = auth.uid()
  )
);
```

### Validación de Input

```typescript
// Sanitización de nombre de jugador
const sanitizePlayerName = (name: string): string => {
  return name
    .trim()
    .slice(0, 20) // máximo 20 caracteres
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '') // solo letras y espacios
}
```

---

## 12. PERFORMANCE

### Estrategia de Carga

```
Carga Inicial (< 5 segundos):
├── React + dependencias críticas
├── Assets del hub central (Villa Amparo)
├── Modelo del avatar del jugador
└── Sistema de audio básico

Carga Diferida:
├── Zonas adicionales del mundo
├── Modelos de NPCs secundarios
└── Mini-juegos no visitados

Precarga Inteligente:
└── Al acercarse a una zona → precargar sus assets
```

### Optimizaciones Three.js

```typescript
// 1. Instancing para objetos repetidos (árboles, flores)
const TreeInstances: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  // Renderizar 100 árboles con 1 draw call
  return (
    <instancedMesh ref={meshRef} args={[treeGeometry, treeMaterial, 100]}>
      {/* posiciones definidas en useEffect */}
    </instancedMesh>
  )
}

// 2. LOD (Level of Detail) para objetos lejanos
const DistantObject: React.FC = ({ position }) => {
  const { camera } = useThree()
  const distance = camera.position.distanceTo(position)
  return distance < 20 ? <DetailedModel /> : <SimpleModel />
}

// 3. Frustum culling automático de Three.js
// 4. Texturas comprimidas (KTX2 con Basis Universal)
// 5. Modelos optimizados (< 5000 polígonos para personajes)
```

### Targets de Performance

| Métrica | Target |
|---------|--------|
| FPS | 60 (desktop), 30 (tablet) |
| Tiempo de carga inicial | < 5 segundos |
| TTI (Time to Interactive) | < 3 segundos |
| Tamaño bundle inicial | < 2 MB |
| Assets por zona | < 10 MB |

---

## 13. DEPLOY Y DEVOPS

### Pipeline de CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
      - run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Ambientes

| Ambiente | Branch | URL | Supabase |
|----------|--------|-----|---------|
| Development | `develop` | localhost:5173 | Local |
| Staging | `staging` | staging.villaamparo.com | Staging project |
| Production | `main` | villaamparo.com | Production project |

---

## 14. VARIABLES DE ENTORNO

```bash
# .env.example

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Solo en Edge Functions (servidor, no expuesto al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...

# Configuración del juego
VITE_GAME_VERSION=1.0.0
VITE_DEBUG_MODE=false
VITE_ENABLE_AI=true
VITE_ENABLE_PREMIUM_TTS=true

# Analytics (opcional)
VITE_ANALYTICS_ID=...
```

---

*Arquitectura técnica de Villa Amparo — Versión 1.0*
