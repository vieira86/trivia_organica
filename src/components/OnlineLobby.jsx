import { useState } from 'react'
import { createRoom, joinRoom } from '../online/roomClient'

const ERROR_MESSAGES = {
  room_not_found: 'Sala não encontrada. Confira o código com quem te convidou.',
  room_already_started: 'Essa partida já começou. Peça um novo código.',
  room_full: 'Essa sala já está cheia (máximo de 4 jogadores).',
  name_taken: 'Já existe um jogador com esse nome nessa sala. Escolha outro.'
}

const OnlineLobby = ({ onReady, onBack }) => {
  const [mode, setMode] = useState('create') // 'create' | 'join'
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Digite seu nome.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { code: newCode, playerId } = await createRoom({ name: name.trim() })
      onReady({ code: newCode, playerId, name: name.trim() })
    } catch (err) {
      console.error(err)
      setError('Não foi possível criar a sala. Verifique sua conexão e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Digite seu nome.')
      return
    }
    if (!code.trim()) {
      setError('Digite o código da sala.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { code: joinedCode, playerId } = await joinRoom(code, { name: name.trim() })
      onReady({ code: joinedCode, playerId, name: name.trim() })
    } catch (err) {
      setError(ERROR_MESSAGES[err.message] ?? 'Não foi possível entrar na sala. Tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-morphism rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
        >
          ← Voltar
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Jogar Online
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Jogue com alguém de outra casa, cada um no seu computador ou celular.
        </p>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => { setMode('create'); setError('') }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'create' ? 'bg-white dark:bg-slate-700 shadow text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Criar sala
          </button>
          <button
            onClick={() => { setMode('join'); setError('') }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'join' ? 'bg-white dark:bg-slate-700 shadow text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Entrar em uma sala
          </button>
        </div>

        <form onSubmit={mode === 'create' ? handleCreate : handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código da sala
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={8}
                placeholder="Ex: A7K2M"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 tracking-widest font-mono text-lg text-center"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Aguarde...' : mode === 'create' ? 'Criar sala' : 'Entrar na sala'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-800/60 rounded-lg border border-blue-200 dark:border-slate-700">
          <p className="text-sm text-blue-700 dark:text-blue-200">
            {mode === 'create'
              ? 'Depois de criar, você recebe um código de 5 letras/números para mandar para o outro jogador.'
              : 'Peça o código de 5 letras/números para quem criou a sala.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnlineLobby
