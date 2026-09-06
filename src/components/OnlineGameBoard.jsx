import { useEffect, useRef, useState } from 'react'
import Board from './Board'
import Dice from './Dice'
import QuestionModal from './QuestionModal'
import ScoreBoard from './ScoreBoard'
import GameHistory from './GameHistory'
import Confetti from './Confetti'
import { BOARD_SIZE } from '../data/boardPath'
import { subscribeRoom, startGame, rollForTurn, submitAnswer, getQuestionById } from '../online/roomClient'
import { playWin, playYourTurn } from '../utils/sound'

const OnlineGameBoard = ({ code, playerId, onExit }) => {
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const wasMyTurnRef = useRef(false)
  const titleFlashRef = useRef(null)
  const originalTitleRef = useRef(document.title)

  useEffect(() => {
    const unsubscribe = subscribeRoom(
      code,
      (data) => setRoom(data),
      () => setError('A sala não foi encontrada, ou a conexão caiu. Tente entrar de novo.')
    )
    return () => unsubscribe()
  }, [code])

  const myIndex = room?.players.findIndex(p => p.id === playerId) ?? -1
  const isHost = room?.players[0]?.id === playerId
  const isMyTurn = room?.status === 'playing' && room.currentPlayerIndex === myIndex

  // Notifica (som + título piscando + notificação do navegador) quando a vez vira para mim.
  useEffect(() => {
    if (isMyTurn && !wasMyTurnRef.current) {
      playYourTurn()
      if (document.hidden) {
        let flashOn = true
        titleFlashRef.current = setInterval(() => {
          document.title = flashOn ? '🔴 Sua vez! — Elementar' : originalTitleRef.current
          flashOn = !flashOn
        }, 1000)
        const stopFlash = () => {
          clearInterval(titleFlashRef.current)
          document.title = originalTitleRef.current
          document.removeEventListener('visibilitychange', stopFlash)
        }
        document.addEventListener('visibilitychange', stopFlash)

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            new Notification('Elementar — O Quiz de Química', { body: 'É a sua vez de jogar!' })
          } catch { /* ambiente sem suporte a notificações — ignora */ }
        }
      }
    }
    wasMyTurnRef.current = isMyTurn
  }, [isMyTurn])

  useEffect(() => {
    if (room?.status === 'finished' && room.winnerId === playerId) {
      playWin()
    }
  }, [room?.status, room?.winnerId, playerId])

  const handleEnableNotifications = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  const handleRoll = async () => {
    if (!isMyTurn || room?.question || isRolling) return
    setIsRolling(true)
    await rollForTurn(code, playerId)
    setTimeout(() => setIsRolling(false), 700)
  }

  const handleAnswer = (correct) => {
    submitAnswer(code, playerId, correct)
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center glass-morphism rounded-2xl p-8">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <button
          onClick={onExit}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Voltar
        </button>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        Conectando à sala {code}...
      </div>
    )
  }

  if (room.status === 'waiting') {
    return (
      <div className="max-w-md mx-auto">
        <div className="glass-morphism rounded-2xl p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Sala de espera</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Mande esse código para o outro jogador:</p>
          <div className="text-4xl font-mono font-bold tracking-widest bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 py-4 rounded-xl mb-6">
            {room.code}
          </div>

          <div className="space-y-2 mb-6">
            {room.players.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                <span className="w-4 h-4 rounded-full border-2 border-white shadow" style={{ backgroundColor: p.color }} />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{p.name}</span>
                {p.id === playerId && <span className="text-xs text-gray-400">(você)</span>}
              </div>
            ))}
          </div>

          {isHost ? (
            <button
              onClick={() => startGame(code)}
              disabled={room.players.length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {room.players.length < 2 ? 'Aguardando outro jogador...' : 'Iniciar partida'}
            </button>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Aguardando o anfitrião iniciar a partida...
            </p>
          )}

          <button
            onClick={onExit}
            className="w-full mt-4 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Sair da sala
          </button>
        </div>
      </div>
    )
  }

  if (room.status === 'finished') {
    const winner = room.players.find(p => p.id === room.winnerId)
    return (
      <div className="text-center relative">
        <Confetti />
        <div className="glass-morphism rounded-2xl p-8 max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🎉 Jogo Terminado! 🎉
          </h2>
          <p className="text-2xl mb-6 text-gray-800 dark:text-gray-100">
            <span style={{ color: winner?.color }}>{winner?.name}</span> venceu!
          </p>
          <div className="space-y-2 mb-6">
            {[...room.players].sort((a, b) => b.score - a.score).map(player => (
              <div key={player.id} className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span style={{ color: player.color }} className="font-semibold">{player.name}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{player.score} pontos</span>
              </div>
            ))}
          </div>
          <button
            onClick={onExit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  const activeQuestion = room.question ? getQuestionById(room.question.id) : null
  const questionIsMine = room.question?.forPlayerId === playerId
  const currentPlayer = room.players[room.currentPlayerIndex]
  const mappedHistory = (room.history || []).map(h => ({
    player: '',
    action: h.message,
    timestamp: new Date(h.at).toLocaleTimeString()
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="glass-morphism rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Sala {room.code}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {isMyTurn ? (
                  <span className="text-green-600 dark:text-green-400 animate-pulse">🎯 Sua vez!</span>
                ) : (
                  <>Vez de: <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span></>
                )}
              </div>
              {notifPermission === 'default' && (
                <button
                  onClick={handleEnableNotifications}
                  className="text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  title="Receber um aviso quando for sua vez, mesmo com a aba em segundo plano"
                >
                  🔔 Ativar avisos
                </button>
              )}
              <button
                onClick={onExit}
                className="text-sm text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          <Board players={room.players} currentPlayer={room.currentPlayerIndex} />

          <div className="flex justify-center mt-6">
            <Dice
              value={room.diceValue}
              isRolling={isRolling}
              onRoll={handleRoll}
              canRoll={isMyTurn && !room.question}
              showQuestion={Boolean(room.question)}
            />
          </div>

          {!isMyTurn && !room.question && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 animate-pulse">
              Aguardando {currentPlayer.name} jogar...
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <ScoreBoard players={room.players} boardSize={BOARD_SIZE} />
        <GameHistory history={mappedHistory} />
      </div>

      {activeQuestion && (
        <QuestionModal
          key={activeQuestion.id}
          question={activeQuestion}
          readOnly={!questionIsMine}
          waitingLabel={`Aguardando ${currentPlayer.name} responder...`}
          onClose={() => handleAnswer(false)}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  )
}

export default OnlineGameBoard
