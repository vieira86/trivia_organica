// Persistência simples do progresso da partida em localStorage.
const SAVE_KEY = 'ludo-organico-save-v1'
const THEME_KEY = 'ludo-organico-theme'

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — ignora silenciosamente
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignora
  }
}

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignora
  }
}
