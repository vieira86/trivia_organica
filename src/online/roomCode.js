// Codigo de sala: 5 caracteres, sem letras/numeros ambiguos (0/O, 1/I).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateRoomCode() {
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

export function normalizeRoomCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}
