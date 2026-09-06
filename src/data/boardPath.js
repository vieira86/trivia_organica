// Fonte unica do layout do tabuleiro (usada pelo Board visual e pela logica do jogo).
// Cada casa (exceto INICIO/FIM) pertence a uma area da quimica, que define sua cor
// e o tema da pergunta sorteada ao cair nela. As areas ciclam pela ordem de AREAS
// em data/questions.js: geral, inorganica, analitica, fisico-quimica, organica, bioquimica.
import { AREAS } from './questions'

export const BOARD_SIZE = 50

const AREA_CYCLE = AREAS.map(a => a.id)

function areaForCell(number) {
  return AREA_CYCLE[(number - 1) % AREA_CYCLE.length]
}

const RAW_POSITIONS = [
  { id: 'start', position: { row: 0, col: 0 }, type: 'start', number: 'INICIO' },

  { id: 1, position: { row: 0, col: 1 } }, { id: 2, position: { row: 0, col: 2 } },
  { id: 3, position: { row: 0, col: 3 } }, { id: 4, position: { row: 0, col: 4 } },
  { id: 5, position: { row: 0, col: 5 } }, { id: 6, position: { row: 0, col: 6 } },
  { id: 7, position: { row: 0, col: 7 } }, { id: 8, position: { row: 0, col: 8 } },
  { id: 9, position: { row: 0, col: 9 } },

  { id: 10, position: { row: 1, col: 9 } }, { id: 11, position: { row: 2, col: 9 } },
  { id: 12, position: { row: 3, col: 9 } }, { id: 13, position: { row: 4, col: 9 } },
  { id: 14, position: { row: 5, col: 9 } },

  { id: 15, position: { row: 5, col: 8 } }, { id: 16, position: { row: 5, col: 7 } },
  { id: 17, position: { row: 5, col: 6 } }, { id: 18, position: { row: 5, col: 5 } },
  { id: 19, position: { row: 5, col: 4 } }, { id: 20, position: { row: 5, col: 3 } },
  { id: 21, position: { row: 5, col: 2 } }, { id: 22, position: { row: 5, col: 1 } },
  { id: 23, position: { row: 5, col: 0 } },

  { id: 24, position: { row: 4, col: 0 } }, { id: 25, position: { row: 3, col: 0 } },
  { id: 26, position: { row: 2, col: 0 } }, { id: 27, position: { row: 1, col: 0 } },

  { id: 28, position: { row: 1, col: 1 } }, { id: 29, position: { row: 1, col: 2 } },
  { id: 30, position: { row: 1, col: 3 } }, { id: 31, position: { row: 1, col: 4 } },
  { id: 32, position: { row: 1, col: 5 } }, { id: 33, position: { row: 1, col: 6 } },
  { id: 34, position: { row: 1, col: 7 } }, { id: 35, position: { row: 1, col: 8 } },

  { id: 36, position: { row: 2, col: 8 } }, { id: 37, position: { row: 3, col: 8 } },
  { id: 38, position: { row: 4, col: 8 } },

  { id: 39, position: { row: 4, col: 7 } }, { id: 40, position: { row: 4, col: 6 } },
  { id: 41, position: { row: 4, col: 5 } }, { id: 42, position: { row: 4, col: 4 } },
  { id: 43, position: { row: 4, col: 3 } }, { id: 44, position: { row: 4, col: 2 } },
  { id: 45, position: { row: 4, col: 1 } },

  { id: 46, position: { row: 3, col: 1 } }, { id: 47, position: { row: 2, col: 1 } },

  { id: 48, position: { row: 2, col: 2 } }, { id: 49, position: { row: 2, col: 3 } },
  { id: 50, position: { row: 2, col: 4 } },

  { id: 'end', position: { row: 2, col: 5 }, type: 'end', number: 'FIM' }
]

export const BOARD_PATH = RAW_POSITIONS.map(cell => {
  if (cell.type === 'start' || cell.type === 'end') return cell
  return { ...cell, type: 'normal', number: cell.id, area: areaForCell(cell.id) }
})

export function getCellArea(cellId) {
  const cell = BOARD_PATH.find(c => c.id === cellId)
  return cell?.area ?? null
}
