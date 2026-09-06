// Efeitos sonoros sintetizados via Web Audio API (sem dependências externas).
let audioCtx = null
const MUTE_KEY = 'ludo-organico-muted'

function getContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function isMuted() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(MUTE_KEY) === 'true'
}

export function setMuted(muted) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MUTE_KEY, String(muted))
}

function playTone({ frequency, duration = 0.15, type = 'sine', delay = 0, volume = 0.15 }) {
  if (isMuted()) return
  const ctx = getContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.value = volume

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const startTime = ctx.currentTime + delay
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playDiceRoll() {
  playTone({ frequency: 220, duration: 0.08, type: 'square' })
  playTone({ frequency: 330, duration: 0.08, type: 'square', delay: 0.1 })
  playTone({ frequency: 440, duration: 0.1, type: 'square', delay: 0.2 })
}

export function playCorrect() {
  playTone({ frequency: 523.25, duration: 0.12, type: 'sine' })
  playTone({ frequency: 659.25, duration: 0.18, type: 'sine', delay: 0.12 })
}

export function playIncorrect() {
  playTone({ frequency: 220, duration: 0.25, type: 'sawtooth', volume: 0.12 })
}

export function playAcid() {
  playTone({ frequency: 180, duration: 0.2, type: 'sawtooth', volume: 0.12 })
  playTone({ frequency: 140, duration: 0.3, type: 'sawtooth', delay: 0.15, volume: 0.12 })
}

export function playWin() {
  ;[523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    playTone({ frequency, duration: 0.3, type: 'sine', delay: index * 0.15, volume: 0.15 })
  })
}

export function playYourTurn() {
  playTone({ frequency: 392.0, duration: 0.12, type: 'sine', volume: 0.16 })
  playTone({ frequency: 587.33, duration: 0.22, type: 'sine', delay: 0.13, volume: 0.16 })
}
