# SISTEMA DE INTELIGENCIA ARTIFICIAL — VILLA AMPARO
## AIProviderService: Arquitectura Agnóstica de IA
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Filosofía del Sistema de IA](#1-filosofía-del-sistema-de-ia)
2. [AIProviderService — Capa Central](#2-aiprovidersservice--capa-central)
3. [Adaptadores por Proveedor](#3-adaptadores-por-proveedor)
4. [Perfil de Aprendizaje Dinámico](#4-perfil-de-aprendizaje-dinámico)
5. [Motor Adaptativo](#5-motor-adaptativo)
6. [Generación de Misiones](#6-generación-de-misiones)
7. [Generación de Historias](#7-generación-de-historias)
8. [Sistema de Motivación](#8-sistema-de-motivación)
9. [Análisis y Reportes para Padres](#9-análisis-y-reportes-para-padres)
10. [Seguridad y Restricciones](#10-seguridad-y-restricciones)
11. [Configuración y Cambio de Proveedor](#11-configuración-y-cambio-de-proveedor)

---

## 1. FILOSOFÍA DEL SISTEMA DE IA

### Principio Fundamental

La IA de Villa Amparo **NO es un chatbot libre**. Es un **tutor educativo inteligente y seguro** que opera exclusivamente dentro del contexto del juego.

### Lo que la IA HACE:
- Construye un perfil dinámico de aprendizaje para cada niño
- Adapta el contenido en tiempo real según el rendimiento
- Genera misiones personalizadas alineadas al nivel educativo
- Crea historias con el avatar y mundo del niño
- Monitorea la motivación y previene la frustración
- Genera reportes comprensibles para padres

### Lo que la IA NUNCA HACE:
- Conversaciones abiertas no estructuradas
- Generar contenido fuera del contexto del juego
- Mostrar información externa
- Interactuar con desconocidos
- Salirse del entorno educativo seguro

### Principio de Proveedor Agnóstico

Toda la aplicación se comunica **únicamente** con `AIProviderService`. Jamás directamente con Claude, OpenAI, Gemini u otro proveedor. Esto garantiza:

- Cambio de proveedor sin modificar la lógica de negocio
- Fallback automático si un proveedor falla
- Comparación de proveedores A/B
- Control de costos por proveedor
- Soporte para modelos locales/open-source

---

## 2. AIPROVIDERSSERVICE — CAPA CENTRAL

### Interfaz Base

```typescript
// services/ai/AIProviderService.ts

/**
 * Contrato que debe cumplir cualquier proveedor de IA.
 * Todos los proveedores implementan esta interfaz.
 */
export interface AIProvider {
  readonly name: string
  readonly isAvailable: () => Promise<boolean>

  complete: (request: AIRequest) => Promise<AIResponse>
  stream?: (request: AIRequest) => AsyncGenerator<string>
}

export interface AIRequest {
  systemPrompt: string
  userMessage: string
  context?: Record<string, unknown>
  maxTokens?: number
  temperature?: number
  responseFormat?: 'text' | 'json'
}

export interface AIResponse {
  content: string
  provider: string
  tokensUsed: number
  latencyMs: number
  cached: boolean
}
```

### Clase Principal: AIProviderService

```typescript
// services/ai/AIProviderService.ts

export class AIProviderService {
  private providers: Map<string, AIProvider> = new Map()
  private activeProviderName: string
  private fallbackOrder: string[]
  private cache: AIResponseCache
  private rateLimiter: RateLimiter
  private safetyFilter: SafetyFilter

  constructor(config: AIServiceConfig) {
    this.activeProviderName = config.defaultProvider
    this.fallbackOrder = config.fallbackOrder
    this.cache = new AIResponseCache(config.cacheConfig)
    this.rateLimiter = new RateLimiter(config.rateLimits)
    this.safetyFilter = new SafetyFilter(config.safetyRules)

    // Registrar proveedores configurados
    config.providers.forEach(p => this.registerProvider(p))
  }

  /**
   * Registra un nuevo proveedor de IA.
   * Permite agregar proveedores en tiempo de ejecución.
   */
  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider)
  }

  /**
   * Cambia el proveedor activo sin reiniciar el sistema.
   */
  setProvider(providerName: string): void {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider "${providerName}" not registered`)
    }
    this.activeProviderName = providerName
    console.log(`[AIProviderService] Switched to provider: ${providerName}`)
  }

  /**
   * Punto único de acceso para TODA la aplicación.
   * Implementa cache, rate limiting, fallback y safety filtering.
   */
  async complete(
    task: AITask,
    playerProfile?: LearningProfile
  ): Promise<AIResponse> {
    // 1. Construir el request con contexto educativo
    const request = this.buildRequest(task, playerProfile)

    // 2. Verificar cache (respuestas deterministas se cachean)
    const cached = await this.cache.get(request)
    if (cached) return { ...cached, cached: true }

    // 3. Rate limiting por sesión
    await this.rateLimiter.check(playerProfile?.playerId)

    // 4. Intentar con proveedor activo, fallback si falla
    const response = await this.executeWithFallback(request)

    // 5. Filtro de seguridad (nunca retorna contenido inapropiado)
    const safeResponse = this.safetyFilter.filter(response)

    // 6. Guardar en cache
    await this.cache.set(request, safeResponse)

    return safeResponse
  }

  private async executeWithFallback(request: AIRequest): Promise<AIResponse> {
    const providers = [
      this.activeProviderName,
      ...this.fallbackOrder.filter(p => p !== this.activeProviderName)
    ]

    for (const providerName of providers) {
      const provider = this.providers.get(providerName)
      if (!provider) continue

      try {
        const isAvailable = await provider.isAvailable()
        if (!isAvailable) continue

        const startTime = Date.now()
        const response = await provider.complete(request)

        return {
          ...response,
          provider: providerName,
          latencyMs: Date.now() - startTime,
          cached: false
        }
      } catch (error) {
        console.warn(`[AIProviderService] Provider ${providerName} failed:`, error)
        // Continuar con el siguiente proveedor
      }
    }

    // Si todos los proveedores fallan, usar respuesta predeterminada
    return this.getDefaultResponse(request)
  }

  private buildRequest(task: AITask, profile?: LearningProfile): AIRequest {
    const systemPrompt = SYSTEM_PROMPTS[task.type](profile)

    return {
      systemPrompt,
      userMessage: JSON.stringify({
        task: task.type,
        parameters: task.parameters,
        playerContext: profile ? this.summarizeProfile(profile) : null
      }),
      maxTokens: TASK_TOKEN_LIMITS[task.type] ?? 500,
      temperature: TASK_TEMPERATURES[task.type] ?? 0.7,
      responseFormat: TASK_RESPONSE_FORMATS[task.type] ?? 'json'
    }
  }

  /**
   * Respuesta predeterminada cuando todos los proveedores fallan.
   * El juego nunca se rompe por fallo de IA.
   */
  private getDefaultResponse(request: AIRequest): AIResponse {
    return {
      content: JSON.stringify(DEFAULT_RESPONSES[request.systemPrompt] ?? {}),
      provider: 'fallback_static',
      tokensUsed: 0,
      latencyMs: 0,
      cached: false
    }
  }
}
```

### Tipos de Tareas de IA

```typescript
// services/ai/tasks.types.ts

export type AITaskType =
  | 'adapt_curriculum'      // Adaptar plan educativo
  | 'generate_mission'      // Crear misión personalizada
  | 'generate_story'        // Crear historia corta
  | 'generate_challenge'    // Crear desafío educativo
  | 'generate_hint'         // Dar pista sin revelar respuesta
  | 'analyze_session'       // Analizar sesión de juego
  | 'generate_parent_report'// Reporte para padres
  | 'detect_frustration'    // Detectar frustración
  | 'motivational_message'  // Mensaje motivacional personalizado

export interface AITask {
  type: AITaskType
  parameters: Record<string, unknown>
}

// Límites de tokens por tarea (control de costos)
export const TASK_TOKEN_LIMITS: Record<AITaskType, number> = {
  adapt_curriculum:       300,
  generate_mission:       400,
  generate_story:         500,
  generate_challenge:     250,
  generate_hint:          150,
  analyze_session:        400,
  generate_parent_report: 800,
  detect_frustration:     200,
  motivational_message:   100
}

// Temperatura por tarea
export const TASK_TEMPERATURES: Record<AITaskType, number> = {
  adapt_curriculum:       0.3,  // Más determinista
  generate_mission:       0.8,  // Más creativo
  generate_story:         0.9,  // Muy creativo
  generate_challenge:     0.5,  // Balance
  generate_hint:          0.3,  // Determinista
  analyze_session:        0.2,  // Muy determinista
  generate_parent_report: 0.4,  // Bastante determinista
  detect_frustration:     0.2,  // Muy determinista
  motivational_message:   0.7   // Creativo
}
```

---

## 3. ADAPTADORES POR PROVEEDOR

### Adaptador: Claude (Anthropic)

```typescript
// services/ai/providers/ClaudeProvider.ts
import Anthropic from '@anthropic-ai/sdk'

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude'
  private client: Anthropic
  private model: string

  constructor(config: { apiKey: string; model?: string }) {
    this.client = new Anthropic({ apiKey: config.apiKey })
    this.model = config.model ?? 'claude-haiku-4-5-20251001' // Rápido y económico
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }]
      })
      return true
    } catch { return false }
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 500,
      system: request.systemPrompt,
      messages: [{ role: 'user', content: request.userMessage }],
      temperature: request.temperature ?? 0.7
    })

    return {
      content: message.content[0].type === 'text'
        ? message.content[0].text
        : '',
      provider: this.name,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      latencyMs: 0,
      cached: false
    }
  }
}
```

### Adaptador: OpenAI / Azure AI

```typescript
// services/ai/providers/OpenAIProvider.ts
import OpenAI from 'openai'

export class OpenAIProvider implements AIProvider {
  readonly name: string
  private client: OpenAI
  private model: string

  constructor(config: {
    apiKey: string
    model?: string
    baseURL?: string  // Permite Azure AI con el mismo adaptador
    name?: string
  }) {
    this.name = config.name ?? 'openai'
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL  // Para Azure: https://xxx.openai.azure.com/
    })
    this.model = config.model ?? 'gpt-4o-mini'
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      })
      return true
    } catch { return false }
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userMessage }
      ],
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      response_format: request.responseFormat === 'json'
        ? { type: 'json_object' }
        : { type: 'text' }
    })

    return {
      content: completion.choices[0].message.content ?? '',
      provider: this.name,
      tokensUsed: completion.usage?.total_tokens ?? 0,
      latencyMs: 0,
      cached: false
    }
  }
}
```

### Adaptador: Google Gemini

```typescript
// services/ai/providers/GeminiProvider.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini'
  private client: GoogleGenerativeAI
  private model: string

  constructor(config: { apiKey: string; model?: string }) {
    this.client = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model ?? 'gemini-1.5-flash' // Económico y rápido
  }

  async isAvailable(): Promise<boolean> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model })
      await model.generateContent('ping')
      return true
    } catch { return false }
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: request.systemPrompt
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: request.userMessage }] }],
      generationConfig: {
        maxOutputTokens: request.maxTokens,
        temperature: request.temperature,
        responseMimeType: request.responseFormat === 'json'
          ? 'application/json'
          : 'text/plain'
      }
    })

    return {
      content: result.response.text(),
      provider: this.name,
      tokensUsed: result.response.usageMetadata?.totalTokenCount ?? 0,
      latencyMs: 0,
      cached: false
    }
  }
}
```

### Adaptador: Modelos Open Source (Ollama / Local)

```typescript
// services/ai/providers/OllamaProvider.ts
// Para uso en desarrollo local o instancias privadas

export class OllamaProvider implements AIProvider {
  readonly name = 'ollama'
  private baseURL: string
  private model: string

  constructor(config: { baseURL?: string; model?: string }) {
    this.baseURL = config.baseURL ?? 'http://localhost:11434'
    this.model = config.model ?? 'llama3.2:3b'
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`)
      return response.ok
    } catch { return false }
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userMessage }
        ],
        stream: false,
        options: {
          temperature: request.temperature,
          num_predict: request.maxTokens
        }
      })
    })

    const data = await response.json()
    return {
      content: data.message.content,
      provider: this.name,
      tokensUsed: data.prompt_eval_count + data.eval_count,
      latencyMs: data.total_duration / 1_000_000,
      cached: false
    }
  }
}
```

### Adaptador: Proveedor Personalizado (Plantilla)

```typescript
// services/ai/providers/CustomProvider.ts
// Plantilla para integrar cualquier proveedor futuro

export class CustomProvider implements AIProvider {
  readonly name: string

  constructor(private config: {
    name: string
    endpoint: string
    apiKey: string
    headers?: Record<string, string>
    requestTransform: (req: AIRequest) => unknown
    responseTransform: (res: unknown) => string
  }) {
    this.name = config.name
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.config.endpoint, { method: 'HEAD' })
      return response.ok
    } catch { return false }
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const body = this.config.requestTransform(request)

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...this.config.headers
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return {
      content: this.config.responseTransform(data),
      provider: this.name,
      tokensUsed: 0,
      latencyMs: 0,
      cached: false
    }
  }
}
```

---

## 4. PERFIL DE APRENDIZAJE DINÁMICO

### Estructura del Perfil

```typescript
// types/learning.types.ts

export interface LearningProfile {
  playerId: string
  playerName: string
  age: number
  petName: string                // Para personalizar historias
  favoritePet: string
  favoriteZone: string           // Para contextualizar misiones

  // Lectura
  reading: {
    level: number                // 1-10
    lettersLearned: LetterMastery[]
    lettersInProgress: LetterMastery[]
    lettersDifficult: LetterMastery[]
    wordsLearned: string[]
    wordsInProgress: string[]
    frequentErrors: ErrorPattern[]
  }

  // Escritura
  writing: {
    level: number                // 1-10
    wordsMastered: string[]
    wordsInProgress: string[]
    commonMistakes: WritingError[]
  }

  // Matemáticas
  math: {
    level: number                // 1-10
    additionRange: number        // Sumas hasta qué número domina
    subtractionRange: number     // Restas hasta qué número domina
    conceptsMastered: string[]   // 'counting', 'addition', 'subtraction'...
    difficultConcepts: string[]
  }

  // Comprensión
  comprehension: {
    level: number                // 1-10
    avgCorrectRate: number       // % de preguntas correctas
    difficultQuestionTypes: string[] // 'who', 'what', 'sequence', 'inference'
  }

  // Velocidad y Atención
  attention: {
    avgResponseTimeMs: number    // Tiempo promedio de respuesta
    sustainedAttentionMinutes: number // Atención sostenida típica
    fatigueThresholdMinutes: number   // Cuándo se fatiga
    sessionCount: number
    totalPlaytimeMinutes: number
  }

  // Preferencias
  preferences: {
    favoriteActivities: string[]
    avoidedActivities: string[]
    bestPerformanceHour: number  // Hora del día (0-23)
    preferredRewardType: 'coins' | 'items' | 'celebration'
  }

  // Estado Emocional Actual
  currentState: {
    frustrationLevel: number     // 0-1
    engagementLevel: number      // 0-1
    consecutiveErrors: number
    lastActivitySuccess: boolean
    sessionDurationMinutes: number
  }

  updatedAt: Date
}

export interface LetterMastery {
  letter: string
  masteryScore: number           // 0.0 - 1.0
  timesEncountered: number
  avgResponseTimeMs: number
  confusedWith: string[]         // Letras con las que se confunde
}
```

### Construcción del Perfil

```typescript
// services/ai/LearningProfileBuilder.ts

export class LearningProfileBuilder {
  constructor(
    private supabase: SupabaseClient,
    private aiService: AIProviderService
  ) {}

  async build(playerId: string): Promise<LearningProfile> {
    // 1. Obtener datos de Supabase
    const [progress, activities, sessions] = await Promise.all([
      this.supabase.from('player_progress').select('*').eq('player_id', playerId).single(),
      this.supabase.from('activity_logs').select('*').eq('player_id', playerId).order('recorded_at', { ascending: false }).limit(500),
      this.supabase.from('player_sessions').select('*').eq('player_id', playerId).order('started_at', { ascending: false }).limit(20)
    ])

    // 2. Calcular métricas
    const letterMastery = this.calculateLetterMastery(activities.data ?? [])
    const mathMetrics = this.calculateMathMetrics(activities.data ?? [])
    const attentionMetrics = this.calculateAttentionMetrics(sessions.data ?? [])
    const preferences = this.detectPreferences(activities.data ?? [])

    // 3. Construir perfil base
    const profile = this.assembleProfile(
      playerId,
      progress.data,
      letterMastery,
      mathMetrics,
      attentionMetrics,
      preferences
    )

    // 4. Enriquecer con análisis de IA
    const enrichedProfile = await this.enrichWithAI(profile)

    return enrichedProfile
  }

  private calculateLetterMastery(activities: ActivityLog[]): LetterMastery[] {
    const letterMap = new Map<string, { correct: number; total: number; times_ms: number[] }>()

    activities
      .filter(a => a.activity_type === 'letter_recognition' || a.activity_type === 'letter_phonics')
      .forEach(a => {
        const letter = a.topic.replace('letter_', '').toUpperCase()
        const current = letterMap.get(letter) ?? { correct: 0, total: 0, times_ms: [] }
        current.total++
        if (a.is_correct) current.correct++
        if (a.time_spent_ms) current.times_ms.push(a.time_spent_ms)
        letterMap.set(letter, current)
      })

    return Array.from(letterMap.entries()).map(([letter, data]) => ({
      letter,
      masteryScore: data.total > 0 ? data.correct / data.total : 0,
      timesEncountered: data.total,
      avgResponseTimeMs: data.times_ms.length > 0
        ? data.times_ms.reduce((a, b) => a + b, 0) / data.times_ms.length
        : 0,
      confusedWith: [] // Calculado por IA
    }))
  }

  private async enrichWithAI(profile: LearningProfile): Promise<LearningProfile> {
    const response = await this.aiService.complete({
      type: 'adapt_curriculum',
      parameters: { profile }
    }, profile)

    const enrichment = JSON.parse(response.content) as AIProfileEnrichment
    return { ...profile, ...enrichment }
  }
}
```

---

## 5. MOTOR ADAPTATIVO

### Lógica de Adaptación

```typescript
// services/ai/AdaptiveEngine.ts

export class AdaptiveEngine {
  constructor(private aiService: AIProviderService) {}

  /**
   * Determina el siguiente contenido educativo óptimo para el niño.
   * Mantiene una tasa de éxito del 70-80% para máxima motivación.
   */
  async getNextContent(profile: LearningProfile): Promise<NextContentRecommendation> {
    const response = await this.aiService.complete({
      type: 'adapt_curriculum',
      parameters: {
        weakLetters: profile.reading.lettersDifficult.map(l => l.letter),
        strongLetters: profile.reading.lettersLearned.map(l => l.letter),
        mathLevel: profile.math.level,
        readingLevel: profile.reading.level,
        frustrationLevel: profile.currentState.frustrationLevel,
        favoriteActivities: profile.preferences.favoriteActivities,
        sessionDuration: profile.currentState.sessionDurationMinutes
      }
    }, profile)

    return JSON.parse(response.content) as NextContentRecommendation
  }

  /**
   * Ajusta la dificultad basado en el rendimiento reciente.
   * Se llama después de cada actividad completada.
   */
  adjustDifficulty(
    currentDifficulty: number,
    profile: LearningProfile
  ): DifficultyAdjustment {
    const { consecutiveErrors, frustrationLevel } = profile.currentState

    if (consecutiveErrors >= 3 || frustrationLevel > 0.7) {
      return {
        newDifficulty: Math.max(1, currentDifficulty - 1),
        visualSupportIncrease: true,
        audioSupportIncrease: true,
        rewardFrequencyIncrease: true,
        reason: 'frustration_detected'
      }
    }

    // Calcular tasa de éxito reciente (últimas 10 actividades)
    const recentSuccessRate = this.calculateRecentSuccessRate(profile)

    if (recentSuccessRate > 0.85) {
      return {
        newDifficulty: Math.min(5, currentDifficulty + 1),
        visualSupportIncrease: false,
        audioSupportIncrease: false,
        rewardFrequencyIncrease: false,
        reason: 'mastery_detected'
      }
    }

    return {
      newDifficulty: currentDifficulty,
      visualSupportIncrease: false,
      audioSupportIncrease: false,
      rewardFrequencyIncrease: false,
      reason: 'optimal_zone'
    }
  }
}
```

---

## 6. GENERACIÓN DE MISIONES

### Misiones Dinámicas por IA

```typescript
// services/ai/MissionGenerator.ts

export class MissionGenerator {
  constructor(private aiService: AIProviderService) {}

  async generatePersonalizedMission(
    profile: LearningProfile,
    zone: string
  ): Promise<GeneratedMission> {
    const response = await this.aiService.complete({
      type: 'generate_mission',
      parameters: {
        playerName: profile.playerName,
        petName: profile.favoritePet,
        currentZone: zone,
        educationalFocus: this.determineFocus(profile),
        targetLetters: profile.reading.lettersInProgress.slice(0, 3).map(l => l.letter),
        targetMathConcept: this.getNextMathConcept(profile),
        missionType: this.selectMissionType(profile),
        difficulty: this.determineDifficulty(profile)
      }
    }, profile)

    const mission = JSON.parse(response.content) as GeneratedMission

    // Validar que la misión sea apropiada (filtro de seguridad)
    return this.validateMission(mission)
  }

  private determineFocus(profile: LearningProfile): string {
    // Priorizar las habilidades más débiles
    if (profile.reading.lettersDifficult.length > 0) return 'reading'
    if (profile.math.level < 3) return 'math'
    if (profile.comprehension.level < profile.reading.level) return 'comprehension'
    return 'vocabulary'
  }
}

/* 
Ejemplo de misión generada por la IA:

{
  "title": "Los Tesoros de Memo",
  "narratorScript": "¡Hola Amparo! Memo, el guardián de la letra M, perdió sus tesoros. Busca 3 objetos que empiecen con M en el Bosque.",
  "objectives": [
    { "type": "find_letter_objects", "letter": "M", "count": 3 },
    { "type": "say_word", "words": ["manzana", "mariposa", "mesa"] }
  ],
  "educationalGoal": "letter_M_reinforcement",
  "estimatedMinutes": 5,
  "rewardCoins": 40,
  "completionScript": "¡Fantástico! ¡Encontraste todos los tesoros de Memo! ¡M de Maravilloso, igual que tú!"
}
*/
```

---

## 7. GENERACIÓN DE HISTORIAS

### Historias Personalizadas

```typescript
// services/ai/StoryGenerator.ts

export class StoryGenerator {
  constructor(private aiService: AIProviderService) {}

  async generateStory(
    profile: LearningProfile,
    educationalGoal: string
  ): Promise<GeneratedStory> {
    const response = await this.aiService.complete({
      type: 'generate_story',
      parameters: {
        protagonistName: profile.playerName,
        petName: profile.favoritePet,
        petType: profile.favoriteZone === 'letter_forest' ? 'perrito' : 'gatito',
        setting: profile.favoriteZone,
        educationalGoal,
        targetVocabulary: profile.reading.wordsInProgress.slice(0, 5),
        readingLevel: profile.reading.level,
        maxSentences: 5,
        language: 'es',
        tone: 'aventura_magica'
      }
    }, profile)

    return JSON.parse(response.content) as GeneratedStory
  }
}

/*
Ejemplo de historia generada:

{
  "title": "Amparo y la Caja Misteriosa",
  "sentences": [
    {
      "text": "Amparo y su gatito Nube encontraron una caja en el Bosque de las Letras.",
      "audioScript": "Amparo y su gatito Nube encontraron una CAJA en el Bosque de las Letras.",
      "highlightWords": ["caja"],
      "illustration": "girl_cat_box_forest"
    },
    {
      "text": "La caja tenía una letra M muy brillante.",
      "audioScript": "La CAJA tenía una letra M muy brillante.",
      "highlightWords": ["letra", "M"],
      "illustration": "glowing_M_box"
    }
  ],
  "comprehensionQuestions": [
    {
      "question": "¿Qué encontró Amparo?",
      "audioScript": "¿Qué encontró Amparo en el bosque?",
      "options": [
        { "text": "Una caja", "image": "box", "isCorrect": true },
        { "text": "Un árbol", "image": "tree", "isCorrect": false },
        { "text": "Una flor", "image": "flower", "isCorrect": false }
      ]
    }
  ],
  "vocabularyHighlights": ["caja", "letra", "brillante"],
  "moralLesson": "La curiosidad lleva a descubrimientos maravillosos."
}
*/
```

---

## 8. SISTEMA DE MOTIVACIÓN

### Detección de Frustración

```typescript
// services/ai/FrustrationDetector.ts

export class FrustrationDetector {
  constructor(private aiService: AIProviderService) {}

  /**
   * Analiza el comportamiento reciente para detectar frustración.
   * Usa reglas simples primero, IA solo para casos ambiguos.
   */
  async analyze(profile: LearningProfile): Promise<FrustrationAnalysis> {
    const { consecutiveErrors, sessionDurationMinutes, frustrationLevel } = profile.currentState

    // Reglas deterministas (sin costo de IA)
    if (consecutiveErrors >= 3) {
      return this.buildIntervention('high', 'consecutive_errors', profile)
    }

    if (sessionDurationMinutes > profile.attention.fatigueThresholdMinutes) {
      return this.buildIntervention('medium', 'fatigue', profile)
    }

    if (frustrationLevel > 0.6) {
      // Solo llamar a IA para análisis profundo en casos ambiguos
      const response = await this.aiService.complete({
        type: 'detect_frustration',
        parameters: {
          sessionDuration: sessionDurationMinutes,
          consecutiveErrors,
          recentActivities: profile.preferences.avoidedActivities
        }
      }, profile)

      return JSON.parse(response.content) as FrustrationAnalysis
    }

    return { level: 'none', interventionNeeded: false }
  }

  private buildIntervention(
    level: 'low' | 'medium' | 'high',
    reason: string,
    profile: LearningProfile
  ): FrustrationAnalysis {
    const interventions: Record<string, InterventionAction[]> = {
      consecutive_errors: [
        { type: 'reduce_difficulty', amount: 1 },
        { type: 'offer_hint', autoReveal: true },
        { type: 'switch_activity', targetActivity: profile.preferences.favoriteActivities[0] },
        { type: 'give_reward', rewardCoins: 10, message: '¡Buen intento! Sigue así.' }
      ],
      fatigue: [
        { type: 'suggest_break', message: '¿Quieres descansar un momento?' },
        { type: 'switch_to_passive', activity: 'explore_world' }
      ]
    }

    return {
      level,
      reason,
      interventionNeeded: true,
      recommendedActions: interventions[reason] ?? []
    }
  }
}
```

---

## 9. ANÁLISIS Y REPORTES PARA PADRES

```typescript
// services/ai/ParentReportGenerator.ts

export class ParentReportGenerator {
  constructor(
    private aiService: AIProviderService,
    private supabase: SupabaseClient
  ) {}

  async generateWeeklyReport(
    playerId: string,
    period: { start: Date; end: Date }
  ): Promise<ParentReport> {
    // 1. Recopilar datos del período
    const data = await this.collectPeriodData(playerId, period)

    // 2. Calcular métricas básicas (sin IA)
    const metrics = this.calculateMetrics(data)

    // 3. IA genera el resumen narrativo y recomendaciones
    const response = await this.aiService.complete({
      type: 'generate_parent_report',
      parameters: {
        playerName: data.playerName,
        period: 'weekly',
        totalSessionMinutes: metrics.totalMinutes,
        sessionsCount: metrics.sessionsCount,
        lettersLearned: metrics.newLettersLearned,
        wordsLearned: metrics.newWordsLearned,
        mathProgress: metrics.mathProgress,
        strongAreas: metrics.strongAreas,
        areasNeedingPractice: metrics.weakAreas,
        streakDays: metrics.streakDays
      }
    })

    const narrative = JSON.parse(response.content) as ReportNarrative

    return {
      playerId,
      period,
      metrics,
      narrative,
      generatedAt: new Date()
    }
  }
}

/*
Ejemplo de reporte generado:

{
  "summary": "¡Fue una semana fantástica para Amparo! Aprendió 3 letras nuevas y jugó 4 días seguidos.",
  "highlights": [
    "Dominó la letra M: la reconoció correctamente el 95% de las veces",
    "Aprendió 8 palabras nuevas como 'mamá', 'manzana' y 'mariposa'",
    "Completó 6 misiones de aventura"
  ],
  "areasToWork": [
    "La letra R todavía necesita práctica — Amparo la confunde con la L",
    "Las restas del 5 al 10 pueden reforzarse más"
  ],
  "recommendationsForParents": [
    "En casa, señalen objetos con la letra R y pronuncien su sonido juntos",
    "Al comer, contar los alimentos del plato es excelente para las restas"
  ],
  "nextWeekFocus": "Las sílabas con M y P — ¡Amparo está lista para este desafío!"
}
*/
```

---

## 10. SEGURIDAD Y RESTRICCIONES

### Filtro de Seguridad

```typescript
// services/ai/SafetyFilter.ts

export class SafetyFilter {
  private forbiddenTopics = [
    'violence', 'adult_content', 'personal_data',
    'external_websites', 'real_people', 'political',
    'religious_controversy', 'horror', 'fear'
  ]

  private requiredContext = [
    'villa_amparo',   // Debe estar en contexto del juego
    'educational',    // Debe ser educativo
    'child_friendly'  // Debe ser apropiado para niños
  ]

  filter(response: AIResponse): AIResponse {
    const content = response.content

    // 1. Detectar contenido prohibido
    if (this.containsForbiddenContent(content)) {
      console.warn('[SafetyFilter] Forbidden content detected, using fallback')
      return { ...response, content: this.getSafeFallback(response) }
    }

    // 2. Verificar que la respuesta sea JSON válido si se esperaba
    if (this.expectsJSON(response) && !this.isValidJSON(content)) {
      return { ...response, content: this.getSafeFallback(response) }
    }

    return response
  }

  private containsForbiddenContent(content: string): boolean {
    const lower = content.toLowerCase()
    return this.forbiddenTopics.some(topic => lower.includes(topic))
  }
}
```

### Prompts del Sistema (con restricciones de seguridad)

```typescript
// services/ai/systemPrompts.ts

export const SYSTEM_PROMPTS: Record<AITaskType, (profile?: LearningProfile) => string> = {
  generate_mission: (profile) => `
Eres el sistema de generación de misiones de Villa Amparo, 
un videojuego educativo para niños de 5 a 8 años.

REGLAS ABSOLUTAS (nunca violar):
- Solo generar contenido apropiado para niños de 5-8 años
- Todas las misiones deben ocurrir DENTRO del universo de Villa Amparo
- No mencionar personas reales, marcas, o referencias externas
- No generar contenido de miedo, violencia, o situaciones angustiantes
- Usar lenguaje simple y positivo en español neutro
- Si un objetivo no puede enseñarse de forma segura y divertida, omitirlo

CONTEXTO DEL JUGADOR:
- Nombre: ${profile?.playerName ?? 'el niño'}
- Mascota: ${profile?.favoritePet ?? 'su mascota'}
- Zona actual: ${profile?.favoriteZone ?? 'Villa Amparo'}
- Nivel de lectura: ${profile?.reading.level ?? 1}/10

FORMATO DE RESPUESTA: JSON válido únicamente.
`,

  generate_story: () => `
Eres el narrador de historias de Villa Amparo.
Creas historias CORTAS (máximo 5 oraciones) para niños de 5-8 años.

REGLAS:
- Historias de aventura mágica, nunca de miedo
- Los protagonistas son siempre el avatar del niño y su mascota
- Vocabulario: máximo nivel primaria básica en español
- Finalizar con un mensaje positivo
- Incluir máximo 3 palabras de vocabulario nuevo
- NUNCA incluir villanos que den miedo, solo travesuras amigables

FORMATO: JSON con estructura de historia definida.
`
}
```

---

## 11. CONFIGURACIÓN Y CAMBIO DE PROVEEDOR

### Inicialización del Servicio

```typescript
// services/ai/index.ts — Punto de entrada único

import { AIProviderService } from './AIProviderService'
import { ClaudeProvider } from './providers/ClaudeProvider'
import { OpenAIProvider } from './providers/OpenAIProvider'
import { GeminiProvider } from './providers/GeminiProvider'
import { OllamaProvider } from './providers/OllamaProvider'

// Crear el servicio con la configuración del entorno
export const aiService = new AIProviderService({
  defaultProvider: import.meta.env.VITE_AI_PROVIDER ?? 'claude',
  fallbackOrder: ['gemini', 'openai', 'ollama'],

  providers: [
    new ClaudeProvider({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      model: 'claude-haiku-4-5-20251001'
    }),
    new OpenAIProvider({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: 'gpt-4o-mini'
    }),
    new GeminiProvider({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      model: 'gemini-1.5-flash'
    }),
    new OllamaProvider({
      baseURL: 'http://localhost:11434',
      model: 'llama3.2:3b'
    })
  ],

  cacheConfig: {
    ttlSeconds: 3600,      // 1 hora de caché
    maxEntries: 1000
  },

  rateLimits: {
    requestsPerMinute: 20,  // Por sesión de jugador
    requestsPerDay: 200     // Por jugador por día
  },

  safetyRules: {
    enforceChildSafe: true,
    blockExternalReferences: true,
    requireEducationalContext: true
  }
})

// Para cambiar de proveedor en runtime (ejemplo: desde panel de admin)
// aiService.setProvider('gemini')
```

### Variables de Entorno por Proveedor

```bash
# .env.example — Configuración de IA

# Proveedor activo (claude | openai | gemini | azure | ollama)
VITE_AI_PROVIDER=claude

# Claude (Anthropic) — Recomendado para producción
VITE_CLAUDE_API_KEY=sk-ant-...

# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Google Gemini
VITE_GEMINI_API_KEY=AIza...

# Azure AI (usa adaptador OpenAI con baseURL personalizada)
VITE_AZURE_OPENAI_KEY=...
VITE_AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com/

# Ollama (local, para desarrollo sin costo)
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
```

### Costo Estimado por Proveedor (MVP — 100 niños activos/día)

| Proveedor | Modelo | Costo/1K tokens | Costo diario estimado |
|-----------|--------|-----------------|----------------------|
| Claude | Haiku 4.5 | $0.0008 | ~$2/día |
| OpenAI | GPT-4o mini | $0.0006 | ~$1.5/día |
| Gemini | 1.5 Flash | $0.0001 | ~$0.3/día |
| Ollama | Llama 3.2 | $0 (local) | Solo infra |
| Azure AI | GPT-4o mini | $0.0007 | ~$1.7/día |

*Estimado: 20 llamadas de IA por sesión × 100 sesiones × 200 tokens promedio = 400K tokens/día*

---

*Sistema de IA de Villa Amparo — Arquitectura Agnóstica de Proveedor*
*Versión 1.0 | Mayo 2026*
