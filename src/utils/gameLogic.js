import { BOARD_SIZE } from '../data/boardPath'

export const POINTS_PER_HOUSE = 10

/**
 * Calcula o resultado de mover um jogador `diceValue` casas a partir de `position`.
 * O jogo em cadeia (estilo Perguntados): a cada resposta certa, o jogador rola de
 * novo e continua andando ate errar uma pergunta - so entao a vez passa.
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
