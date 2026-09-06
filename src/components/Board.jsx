import { BOARD_PATH, BOARD_SIZE } from '../data/boardPath'
import { AREAS, getArea } from '../data/questions'
import { getHazard } from '../data/hazards'

// Mistura a cor da area com branco/preto para gerar um tom de fundo suave e legivel
function tintColor(hex, amount, mode = 'light') {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  const mix = mode === 'light' ? 255 : 0
  const nr = Math.round(r + (mix - r) * amount)
  const ng = Math.round(g + (mix - g) * amount)
  const nb = Math.round(b + (mix - b) * amount)
  return `rgb(${nr}, ${ng}, ${nb})`
}

const Board = ({ players, currentPlayer, hazards = {} }) => {
  const getPlayersInCell = (cellId) => {
    return players.filter(player => {
      if (cellId === 'start') return player.position === 0
      if (cellId === 'end') return player.position >= BOARD_SIZE
      return player.position === cellId
    })
  }

  const getCellStyle = (cell) => {
    if (cell.type === 'start') {
      return { background: 'linear-gradient(135deg, #bbf7d0, #86efac)', borderColor: '#22c55e' }
    }
    if (cell.type === 'end') {
      return { background: 'linear-gradient(135deg, #fed7aa, #fca5a5)', borderColor: '#ef4444' }
    }
    const area = getArea(cell.area)
    return {
      background: `linear-gradient(135deg, ${tintColor(area.color, 0.75)}, ${tintColor(area.color, 0.6)})`,
      borderColor: area.color
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-950 rounded-xl p-3 sm:p-6 shadow-inner overflow-x-auto">
      <div
        className="grid gap-1.5 sm:gap-2 min-w-[560px]"
        style={{
          gridTemplateColumns: 'repeat(10, minmax(36px, 1fr))',
          aspectRatio: '10/6'
        }}
      >
        {Array.from({ length: 6 }, (_, row) => (
          Array.from({ length: 10 }, (_, col) => {
            const cell = BOARD_PATH.find(c => c.position.row === row && c.position.col === col)

            if (!cell) {
              return <div key={`${row}-${col}`} className="aspect-square" />
            }

            const playersInCell = getPlayersInCell(cell.id)
            const area = cell.area ? getArea(cell.area) : null
            const hazard = typeof cell.id === 'number' ? getHazard(hazards[cell.id]) : null

            return (
              <div
                key={cell.id}
                className="rounded-lg border-2 flex items-center justify-center relative p-1 shadow-sm transition-all duration-200 hover:scale-105"
                style={{ aspectRatio: '1/1', ...getCellStyle(cell) }}
                title={hazard ? hazard.label : area ? area.label : cell.number}
              >
                <span className="font-bold text-sm text-gray-800/80 dark:text-gray-900/70">
                  {cell.number}
                </span>

                {hazard && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white shadow flex items-center justify-center text-[10px] leading-none"
                    style={{ backgroundColor: hazard.color }}
                  >
                    {hazard.icon}
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {playersInCell.map((player, index) => (
                    <div
                      key={player.id}
                      className={`
                        absolute rounded-full border-2 border-white shadow-lg
                        transition-all duration-500 transform hover:scale-110 pointer-events-auto
                        ${currentPlayer === players.indexOf(player) ? 'animate-bounce-gentle z-10' : ''}
                      `}
                      style={{
                        backgroundColor: player.color,
                        width: '60%',
                        height: '60%',
                        top: '20%',
                        left: '20%',
                        transform: `translate(${(index % 2) * 14 - 7}px, ${Math.floor(index / 2) * 14 - 7}px)`
                      }}
                      title={player.name}
                    >
                      <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                        {player.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )).flat()}
      </div>

      <div className="flex justify-center mt-4 gap-3 text-xs flex-wrap">
        {AREAS.map(area => (
          <div key={area.id} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border-2" style={{ backgroundColor: tintColor(area.color, 0.7), borderColor: area.color }} />
            <span className="text-gray-600 dark:text-gray-400">{area.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-2 gap-3 text-xs flex-wrap">
        <span className="text-gray-400 dark:text-gray-500">Casas-armadilha (mudam a cada partida):</span>
        {Object.values(hazards).length > 0 && [...new Set(Object.values(hazards))].map(hazardId => {
          const hazard = getHazard(hazardId)
          if (!hazard) return null
          return (
            <div key={hazardId} className="flex items-center gap-1.5">
              <span>{hazard.icon}</span>
              <span className="text-gray-600 dark:text-gray-400">{hazard.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Board
