import { Suspense, lazy, useState } from 'react'
import Login from './components/Login'
import GameBoard from './components/GameBoard'
import StudyMode from './components/StudyMode'
import ThemeToggle from './components/ThemeToggle'
import SoundToggle from './components/SoundToggle'
import { useTheme } from './hooks/useTheme'
import { loadGame, clearGame } from './utils/storage'
import { isMuted, setMuted } from './utils/sound'
import './index.css'

// Carregados sob demanda: assim quem so joga localmente nao baixa o SDK do
// Firebase, usado apenas no modo online.
const OnlineLobby = lazy(() => import('./components/OnlineLobby'))
const OnlineGameBoard = lazy(() => import('./components/OnlineGameBoard'))

const OnlineLoading = () => (
  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
    Carregando modo online...
  </div>
)

function App() {
  // 'login', 'playing', 'study', 'online-lobby', 'online-playing'
  const [gameState, setGameState] = useState('login')
  const [players, setPlayers] = useState([])
  const [onlineRoom, setOnlineRoom] = useState(null) // { code, playerId, name }
  const [savedGame, setSavedGame] = useState(() => loadGame())
  const [muted, setMutedState] = useState(() => isMuted())
  const { theme, toggleTheme } = useTheme()

  const handleStartGame = (playerData) => {
    clearGame()
    setSavedGame(null)
    setPlayers(playerData)
    setGameState('playing')
  }

  const handleResumeGame = () => {
    if (!savedGame?.players?.length) return
    setPlayers(savedGame.players)
    setGameState('playing')
  }

  const handleExitGame = () => {
    setPlayers([])
    setSavedGame(null)
    setGameState('login')
  }

  const handleOnlineReady = (roomInfo) => {
    setOnlineRoom(roomInfo)
    setGameState('online-playing')
  }

  const handleExitOnline = () => {
    setOnlineRoom(null)
    setGameState('login')
  }

  const handleToggleMuted = () => {
    setMutedState(prev => {
      const next = !prev
      setMuted(next)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30 dark:bg-slate-900/70 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl shadow-md shadow-purple-500/20 shrink-0">
                ⚛️
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-none">
                  Elementar
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-1">
                  O quiz de Química: todas as áreas em um só tabuleiro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SoundToggle muted={muted} onToggle={handleToggleMuted} />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {gameState === 'login' && (
          <Login
            onStartGame={handleStartGame}
            onStudyMode={() => setGameState('study')}
            onPlayOnline={() => setGameState('online-lobby')}
            hasSavedGame={Boolean(savedGame?.players?.length)}
            onResumeGame={handleResumeGame}
          />
        )}

        {gameState === 'study' && (
          <StudyMode onBack={() => setGameState('login')} />
        )}

        {gameState === 'playing' && (
          <GameBoard
            players={players}
            initialState={savedGame}
            onExit={handleExitGame}
          />
        )}

        {gameState === 'online-lobby' && (
          <Suspense fallback={<OnlineLoading />}>
            <OnlineLobby
              onReady={handleOnlineReady}
              onBack={() => setGameState('login')}
            />
          </Suspense>
        )}

        {gameState === 'online-playing' && onlineRoom && (
          <Suspense fallback={<OnlineLoading />}>
            <OnlineGameBoard
              code={onlineRoom.code}
              playerId={onlineRoom.playerId}
              onExit={handleExitOnline}
            />
          </Suspense>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Elementar</h3>
                    <p className="text-gray-400">
                        Plataforma gamificada para aprendizado de Química, cobrindo todas as grandes áreas, tornando o estudo divertido e interativo.
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
                    <ul className="space-y-2">
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                        <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Como Funciona</a></li>
                        <li><a href="https://github.com/vieira86" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4">Sobre o Autor</h4>

                    <div className="flex items-center space-x-4">
                        <img src="https://github.com/vieira86.png"
                            alt="Rafael Vieira"
                            className="w-16 h-16 rounded-full border-2 border-purple-500 shadow-lg" />

                        <div>
                            <p className="font-semibold text-white">Prof. Rafael Vieira</p>
                            <p className="text-sm text-gray-400">Química</p>
                            <p className="text-sm text-gray-400">rafael.vieira@ifro.edu.br</p>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-4">
                        <a href="https://github.com/vieira86" target="_blank" rel="noreferrer"
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.423 3.297-1.423.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 8.524-6.89 8.524-1.271 0-2.471-.267-3.564-.748l1.416-2.409c1.004.335 2.084.515 3.207.515 5.406 0 9.799-4.393 9.799-9.799 0-5.406-4.393-9.799-9.799-9.799z"/>
                            </svg>
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400 text-sm">
                    © 2026 Elementar — O Quiz de Química - Código aberto e gratuito para educação química.
                </p>
            </div>
        </div>
      </footer>
    </div>
  )
}

export default App
