const ScoreBoard = ({ players, boardSize }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Placar
      </h3>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`
              p-3 rounded-lg border-2 transition-all duration-300
              ${player.finished
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-lg dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-yellow-700'
                : 'bg-white/70 border-gray-200 hover:shadow-md dark:bg-slate-800/60 dark:border-slate-700'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300'}
                `}>
                  {index + 1}
                </div>

                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: player.color }}
                />

                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {player.name}
                </span>

                {player.finished && (
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-bold">
                    VENCEDOR
                  </span>
                )}
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                  {player.score}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  pontos
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{player.position}/{boardSize}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (player.position / boardSize) * 100)}%`,
                    backgroundColor: player.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {players.reduce((sum, p) => sum + p.score, 0)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Total Pontos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {players.filter(p => p.finished).length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Concluíram</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard
