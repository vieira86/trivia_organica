import { useEffect, useRef } from 'react'

const GameHistory = ({ history }) => {
  const historyEndRef = useRef(null)

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const getActionIcon = (action) => {
    if (action.includes('lançou')) {
      return '🎲'
    }
    if (action.includes('respondeu corretamente')) {
      return '✓'
    }
    if (action.includes('errou')) {
      return '✗'
    }
    if (action.includes('venceu')) {
      return '🏆'
    }
    return '📍'
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Histórico
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Nenhuma jogada ainda</p>
            <p className="text-xs mt-1">O jogo começará em breve!</p>
          </div>
        ) : (
          history.map((entry, index) => (
            <div
              key={index}
              className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-sm"
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg">
                  {getActionIcon(entry.action)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    <span className="font-semibold">{entry.player}</span>
                    {' '}{entry.action}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {entry.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={historyEndRef} />
      </div>

      {/* Resumo Rápido */}
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {history.length} jogadas registradas
          </div>
        </div>
      )}
    </div>
  )
}

export default GameHistory
