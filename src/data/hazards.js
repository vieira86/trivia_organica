// Casas-armadilha: sorteadas em posições novas a cada partida (ficam fixas
// durante aquele jogo, mas mudam de lugar da próxima vez que você começar
// um jogo novo). Ao cair em uma delas, o jogador sofre o efeito na hora,
// sem pergunta - a vez passa direto para o próximo jogador.
export const HAZARDS = [
  {
    id: 'sulfurico',
    label: 'Ácido Sulfúrico Concentrado',
    icon: '🧪',
    color: '#dc2626',
    effect: 'back',
    amount: 3,
    message: 'Você caiu numa casa de ácido sulfúrico concentrado (H₂SO₄)!',
    description: 'Altamente corrosivo e desidratante — provoca queimaduras graves ao contato. Volte 3 casas.'
  },
  {
    id: 'nitrico',
    label: 'Ácido Nítrico Concentrado',
    icon: '⚗️',
    color: '#f97316',
    effect: 'back',
    amount: 4,
    message: 'Você caiu numa casa de ácido nítrico concentrado (HNO₃)!',
    description: 'Forte agente oxidante, libera vapores tóxicos e ataca metais e tecido orgânico. Volte 4 casas.'
  },
  {
    id: 'radioativo',
    label: 'Contaminação Radioativa',
    icon: '☢️',
    color: '#84cc16',
    effect: 'start',
    message: 'Alerta! Você entrou em uma área com contaminação radioativa!',
    description: 'É preciso descontaminar tudo antes de continuar. Volte para a casa INÍCIO.'
  }
]

export function getHazard(hazardId) {
  return HAZARDS.find(h => h.id === hazardId) ?? null
}

const HAZARD_MIN_CELL = 4
const HAZARD_MAX_OFFSET = 3 // deixa as últimas casas antes do fim livres de armadilha

/**
 * Sorteia uma nova posição para cada tipo de armadilha, sem repetir casa.
 * Retorna um mapa { numeroDaCasa: hazardId }.
 */
export function generateHazardLayout(boardSize) {
  const maxCell = boardSize - HAZARD_MAX_OFFSET
  const usedCells = new Set()
  const layout = {}

  for (const hazard of HAZARDS) {
    let cell
    let attempts = 0
    do {
      cell = HAZARD_MIN_CELL + Math.floor(Math.random() * (maxCell - HAZARD_MIN_CELL + 1))
      attempts += 1
    } while (usedCells.has(cell) && attempts < 50)

    usedCells.add(cell)
    layout[cell] = hazard.id
  }

  return layout
}
