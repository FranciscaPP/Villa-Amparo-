import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SYSTEM_PROMPT = `Eres el motor educativo adaptativo de Villa Amparo,
un videojuego educativo para niños de 5 a 8 años de habla hispana.

Tu función es analizar el progreso educativo del niño y recomendar:
1. Qué letras necesitan más práctica (ordenadas por prioridad)
2. Qué tipo de actividades recomendar según las preferencias del niño
3. Si debe aumentar, mantener o reducir la dificultad
4. Cuáles son las áreas de fortaleza y debilidad

REGLAS ABSOLUTAS:
- Solo recomendar contenido apropiado para niños de 5-8 años
- Mantener una tasa de éxito esperada del 70-80% (zona de flujo)
- Si hay señales de frustración, SIEMPRE reducir dificultad
- Priorizar actividades preferidas del niño para aumentar el engagement
- Responder ÚNICAMENTE en formato JSON válido

Responde con este JSON exacto:
{
  "nextLetters": ["letra1", "letra2", "letra3"],
  "mathLevel": 1,
  "recommendedActivities": ["activity1", "activity2"],
  "difficultyAdjustment": "maintain",
  "focusAreas": ["area1", "area2"],
  "weakLetters": ["letra"],
  "strongLetters": ["letra1", "letra2"],
  "estimatedSessionMinutes": 20,
  "motivationalMessage": "mensaje corto y positivo para el niño"
}`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
    })
  }

  try {
    const { playerId } = await req.json()

    if (!playerId) {
      return new Response(JSON.stringify({ error: 'playerId required' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Recopilar datos del jugador
    const [progressResult, activitiesResult] = await Promise.all([
      supabase.from('player_progress').select('*').eq('player_id', playerId).single(),
      supabase.from('activity_logs')
        .select('activity_type, topic, is_correct, time_spent_ms, recorded_at')
        .eq('player_id', playerId)
        .order('recorded_at', { ascending: false })
        .limit(200)
    ])

    const progress = progressResult.data
    const activities = activitiesResult.data ?? []

    if (!progress) {
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 })
    }

    // Calcular métricas
    const consecutiveErrors = calculateConsecutiveErrors(activities)
    const recentSuccessRate = calculateRecentSuccessRate(activities.slice(0, 20))
    const favoriteActivities = detectFavoriteActivities(activities)

    const userMessage = JSON.stringify({
      lettersMastery: progress.letters_mastery,
      readingLevel: progress.reading_level,
      mathLevel: progress.math_level,
      streakDays: progress.streak_days,
      consecutiveErrors,
      recentSuccessRate,
      favoriteActivities,
      totalActivities: activities.length,
      adaptiveProfile: progress.adaptive_profile
    })

    // Llamar al proveedor de IA configurado
    const aiResponse = await callAIProvider(SYSTEM_PROMPT, userMessage)

    // Guardar perfil adaptativo
    const adaptation = JSON.parse(aiResponse)
    await supabase
      .from('player_progress')
      .update({ adaptive_profile: adaptation, updated_at: new Date().toISOString() })
      .eq('player_id', playerId)

    return new Response(JSON.stringify(adaptation), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    console.error('[adaptive-ai] Error:', error)
    // Fallback: perfil adaptativo por defecto
    return new Response(JSON.stringify(getDefaultAdaptation()), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})

async function callAIProvider(systemPrompt: string, userMessage: string): Promise<string> {
  const provider = Deno.env.get('AI_PROVIDER') ?? 'claude'

  if (provider === 'claude') {
    return await callClaude(systemPrompt, userMessage)
  } else if (provider === 'openai') {
    return await callOpenAI(systemPrompt, userMessage)
  } else if (provider === 'gemini') {
    return await callGemini(systemPrompt, userMessage)
  }

  throw new Error(`Unknown AI provider: ${provider}`)
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'x-api-key': Deno.env.get('CLAUDE_API_KEY')!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })

  const data = await response.json()
  return data.content[0].text
}

async function callOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
          maxOutputTokens: 400,
          responseMimeType: 'application/json'
        }
      })
    }
  )

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

function calculateConsecutiveErrors(activities: Array<{ is_correct: boolean }>): number {
  let count = 0
  for (const activity of activities) {
    if (!activity.is_correct) count++
    else break
  }
  return count
}

function calculateRecentSuccessRate(activities: Array<{ is_correct: boolean }>): number {
  if (activities.length === 0) return 0.75
  const correct = activities.filter(a => a.is_correct).length
  return correct / activities.length
}

function detectFavoriteActivities(activities: Array<{ activity_type: string }>): string[] {
  const counts = new Map<string, number>()
  activities.forEach(a => counts.set(a.activity_type, (counts.get(a.activity_type) ?? 0) + 1))
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type)
}

function getDefaultAdaptation() {
  return {
    nextLetters: ['A', 'E', 'I'],
    mathLevel: 1,
    recommendedActivities: ['letter_recognition', 'letter_phonics'],
    difficultyAdjustment: 'maintain',
    focusAreas: ['vowels', 'counting'],
    weakLetters: [],
    strongLetters: [],
    estimatedSessionMinutes: 15,
    motivationalMessage: '¡Cada día aprendes algo nuevo!'
  }
}
