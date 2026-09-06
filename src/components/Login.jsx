import { useState } from 'react'
import { PLAYER_COLORS } from '../data/playerColors'

const MIN_PLAYERS = 2
const MAX_PLAYERS = 4

const Login = ({ onStartGame, onStudyMode, onPlayOnline, hasSavedGame, onResumeGame }) => {
  const [names, setNames] = useState(['', ''])
  const [errors, setErrors] = useState({})

  const updateName = (index, value) => {
    setNames(prev => prev.map((name, i) => (i === index ? value : name)))
  }

  const addPlayer = () => {
    if (names.length >= MAX_PLAYERS) return
    setNames(prev => [...prev, ''])
  }

  const removePlayer = (index) => {
    if (names.length <= MIN_PLAYERS) return
    setNames(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    const trimmed = names.map(name => name.trim())

    trimmed.forEach((name, index) => {
      if (!name) {
        newErrors[`player${index}`] = `Nome do Jogador ${index + 1} é obrigatório`
      }
    })

    const nonEmpty = trimmed.filter(Boolean)
    if (new Set(nonEmpty).size !== nonEmpty.length) {
      newErrors.duplicate = 'Os nomes dos jogadores devem ser diferentes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const players = names.map((name, index) => ({
        id: index + 1,
        name: name.trim(),
        color: PLAYER_COLORS[index].value,
        position: 0,
        score: 0,
        finished: false
      }))

      onStartGame(players)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-morphism rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Iniciar Jogo
        </h2>

        {hasSavedGame && (
          <button
            onClick={onResumeGame}
            className="w-full mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            ▶️ Retomar jogo salvo
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {names.map((name, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jogador {index + 1} ({PLAYER_COLORS[index].label})
                </label>
                {names.length > MIN_PLAYERS && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remover jogador ${index + 1}`}
                  >
                    Remover
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm shrink-0"
                  style={{ backgroundColor: PLAYER_COLORS[index].value }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Digite o nome do jogador ${index + 1}`}
                  maxLength={20}
                />
              </div>
              {errors[`player${index}`] && (
                <p className="mt-1 text-sm text-red-500">{errors[`player${index}`]}</p>
              )}
            </div>
          ))}

          {names.length < MAX_PLAYERS && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-all duration-200 text-sm font-semibold"
            >
              + Adicionar jogador ({names.length}/{MAX_PLAYERS})
            </button>
          )}

          {errors.duplicate && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.duplicate}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Começar Jogo
          </button>
        </form>

        <button
          onClick={onPlayOnline}
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          🌐 Jogar Online (cada um na sua casa)
        </button>

        <button
          onClick={onStudyMode}
          className="w-full mt-3 bg-white/50 dark:bg-slate-800/50 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 font-semibold py-3 px-6 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 transition-all duration-200"
        >
          📚 Modo Estudo (revisar perguntas sem jogar)
        </button>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-800/60 rounded-lg border border-blue-200 dark:border-slate-700">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Como Jogar:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• De 2 a 4 jogadores, no mesmo aparelho ou online</li>
            <li>• Cada casa é de uma área da Química (cor diferente)</li>
            <li>• Lance o dado e responda a pergunta da área em que caiu</li>
            <li>• Acertou? Role de novo e continue andando!</li>
            <li>• Errou (ou o tempo acabe)? A vez passa para o próximo</li>
            <li>• Primeiro a completar o tabuleiro vence!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
