import { BOARD_SIZE } from '../data/boardPath'

export const POINTS_PER_HOUSE = 10

/**
 * Calcula o resultado de mover um jogador `diceValue` casas a partir de `position`.
 * Cada jogador tem uma jogada por rodada: rola o dado, responde a pergunta da
 * area em que cai e, acertando ou errando, a vez passa para o proximo jogador.
 */
export function resolveMove(position, diceValue) {
  const rawPosition = position + diceValue
  const newPosition = Math.min(rawPosition, BOARD_SIZE)
  const points = diceValue * POINTS_PER_HOUSE
  const won = newPosition >= BOARD_SIZE

  return { position: newPosition, points, won }
}

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

/** Aplica o efeito de uma casa-armadilha (hazards.js) a partir da posição de pouso. */
export function applyHazardEffect(landingPosition, hazard) {
  if (hazard.effect === 'start') return 0
  if (hazard.effect === 'back') return Math.max(0, landingPosition - hazard.amount)
  return landingPosition
}

export function updatePlayer(players, index, { position, scoreDelta = 0, finished }) {
  return players.map((player, i) => {
    if (i !== index) return player
    return {
      ...player,
      position,
      score: player.score + scoreDelta,
      ...(finished !== undefined ? { finished } : {})
    }
  })
}
