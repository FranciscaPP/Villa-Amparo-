import { useCallback, useRef } from 'react'

export function useVoice() {
  const utteranceRef = useRef(null)

  const speak = useCallback((text, { rate = 0.85, pitch = 1.1 } = {}) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1

    // Try to find a good Spanish voice
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find(v => v.lang.startsWith('es')) || voices[0]
    if (spanishVoice) utterance.voice = spanishVoice

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
