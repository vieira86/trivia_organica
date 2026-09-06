import { useEffect, useState } from 'react'
import Board from './Board'
import Dice from './Dice'
import QuestionModal from './QuestionModal'
import ScoreBoard from './ScoreBoard'
import GameHistory from './GameHistory'
import Confetti from './Confetti'
import { BOARD_SIZE, getCellArea } from '../data/boardPath'
import { pickRandomQuestion, RECENT_QUESTIONS_WINDOW } from '../data/questions'
import { resolveMove, rollDice, updatePlayer } from '../utils/gameLogic'
import { saveGame, clearGame } from '../utils/storage'
import { playDiceRoll, playWin } from '../utils/sound'

const timestamp = () => new Date().toLocaleTimeString()

const GameBoard = ({ players: initialPlayers, initialState, onExit }) => {
  const [players, setPlayers] = useState(initialPlayers)
  const [currentPlayer, setCurrentPlayer] = useState(initialState?.currentPlayer ?? 0)
  const [diceValue, setDiceValue] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [recentQuestionIds, setRecentQuestionIds] = useState(initialState?.recentQuestionIds ?? [])
  const [gameHistory, setGameHistory] = useState(initialState?.gameHistory ?? [])
  const [canRoll, setCanRoll] = useState(true)

  const addHistory = (player, action) => {
    setGameHistory(prev => [...prev, { player, action, timestamp: timestamp() }])
  }

  const winner = players.find(player => player.finished)
  const gameEnded = Boolean(winner)

  useEffect(() => {
    if (gameEnded) {
      clearGame()
      return
    }
    saveGame({ players, currentPlayer, gameHistory, recentQuestionIds })
  }, [players, currentPlayer, gameHistory, recentQuestionIds, gameEnded])

  const nextTurn = () => {
    setCurrentPlayer(prev => (prev + 1) % players.length)
    setCanRoll(true)
  }

  const handleDiceRoll = async () => {
    if (!canRoll || isRolling) return

    setIsRolling(true)
    setCanRoll(false)
    playDiceRoll()

    await new Promise(resolve => setTimeout(resolve, 800))

    const value = rollDice()
    setDiceValue(value)
    addHistory(players[currentPlayer].name, `lançou o dado e tirou ${value}`)
    setIsRolling(false)

    setTimeout(() => {
      const landingCell = Math.min(players[currentPlayer].position + value, BOARD_SIZE)
      const area = getCellArea(landingCell)
      const question = pickRandomQuestion(recentQuestionIds, area)
      setCurrentQuestion(question)
      setRecentQuestionIds(prev => [...prev, question.id].slice(-RECENT_QUESTIONS_WINDOW))
      setShowQuestion(true)
    }, 1500)
  }

  const finishQuestionRound = () => {
    setShowQuestion(false)
    setCurrentQuestion(null)
    setDiceValue(null)
  }

  const handleQuestionAnswer = (correct) => {
    const player = players[currentPlayer]

    if (!correct || diceValue === null) {
      addHistory(player.name, 'errou a pergunta e perdeu a vez')
      finishQuestionRound()
      nextTurn()
      return
    }

    const oldPosition = player.position
    const result = resolveMove(oldPosition, diceValue)

    setPlayers(prev => updatePlayer(prev, currentPlayer, {
      position: result.position,
      scoreDelta: result.points,
      finished: result.won
    }))

    addHistory(player.name, `respondeu corretamente e moveu ${diceValue} casas (da ${oldPosition} para a ${result.position})`)

    if (result.won) {
      addHistory(player.name, 'venceu o jogo! 🎉')
      playWin()
      finishQuestionRound()
      return
    }

    // Cada jogador joga uma vez por rodada: acertando ou errando, a vez passa adiante.
    finishQuestionRound()
    nextTurn()
  }

  const handleExit = () => {
    if (window.confirm('Sair da partida atual? O progresso salvo será perdido.')) {
      clearGame()
      onExit()
    }
  }

  const handleNewGame = () => {
    clearGame()
    onExit()
  }

  if (gameEnded) {
    return (
      <div className="text-center relative">
        <Confetti />
        <div className="glass-morphism rounded-2xl p-8 max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🎉 Jogo Terminado! 🎉
          </h2>
          <p className="text-2xl mb-6 text-gray-800 dark:text-gray-100">
            <span style={{ color: winner.color }}>{winner.name}</span> venceu!
          </p>
          <div className="space-y-2 mb-6">
            {[...players].sort((a, b) => b.score - a.score).map(player => (
              <div key={player.id} className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span style={{ color: player.color }} className="font-semibold">{player.name}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{player.score} pontos</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleNewGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            Novo Jogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="glass-morphism rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tabuleiro</h2>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Vez de: <span style={{ color: players[currentPlayer].color }}>
                  {players[currentPlayer].name}
                </span>
              </div>
              <button
                onClick={handleExit}
                className="text-sm text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          <Board
            players={players}
            currentPlayer={currentPlayer}
          />

          <div className="flex justify-center mt-6">
            <Dice
              value={diceValue}
              isRolling={isRolling}
              onRoll={handleDiceRoll}
              canRoll={canRoll}
              showQuestion={showQuestion}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ScoreBoard players={players} boardSize={BOARD_SIZE} />
        <GameHistory history={gameHistory} />
      </div>

      {showQuestion && currentQuestion && (
        <QuestionModal
          key={currentQuestion.id}
          question={currentQuestion}
          onClose={() => handleQuestionAnswer(false)}
          onAnswer={handleQuestionAnswer}
        />
      )}
    </div>
  )
}

export default GameBoard
