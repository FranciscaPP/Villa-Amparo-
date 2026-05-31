import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const ELEVENLABS_LUMI_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Cambiar por voz de Lumi en producción
const ALLOWED_VOICE_IDS = new Set([ELEVENLABS_LUMI_VOICE_ID])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { text, voiceId = ELEVENLABS_LUMI_VOICE_ID } = await req.json()

    if (!text || typeof text !== 'string' || text.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid text' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Solo permitir voces autorizadas
    const safeVoiceId = ALLOWED_VOICE_IDS.has(voiceId) ? voiceId : ELEVENLABS_LUMI_VOICE_ID

    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'TTS not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${safeVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('[tts-proxy] Error:', error)
    return new Response(JSON.stringify({ error: 'TTS generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
