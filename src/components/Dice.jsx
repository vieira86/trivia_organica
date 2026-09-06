import { useState } from 'react'

const Dice = ({ value, isRolling, onRoll, canRoll, showQuestion }) => {
  const [hovered, setHovered] = useState(false)

  const getDiceFace = (num) => {
    const dots = {
      1: [[50, 50]],
      2: [[30, 30], [70, 70]],
      3: [[30, 30], [50, 50], [70, 70]],
      4: [[30, 30], [30, 70], [70, 30], [70, 70]],
      5: [[30, 30], [30, 70], [50, 50], [70, 30], [70, 70]],
      6: [[30, 25], [30, 50], [30, 75], [70, 25], [70, 50], [70, 75]]
    }
    
    return dots[num] || []
  }

  const handleRoll = () => {
    if (canRoll && !isRolling) {
      onRoll()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleRoll}
        disabled={!canRoll || isRolling}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-slate-600
          flex items-center justify-center transition-all duration-300
          ${canRoll && !isRolling ? 'hover:scale-110 hover:shadow-3xl cursor-pointer' : ''}
          ${isRolling ? 'animate-dice-roll' : ''}
          ${!canRoll ? 'opacity-50 cursor-not-allowed' : ''}
          ${hovered && canRoll && !isRolling ? 'border-purple-400 dark:border-purple-500' : ''}
        `}
      >
        {value && !isRolling ? (
          <div className="relative w-full h-full p-2">
            {getDiceFace(value).map((dot, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-gray-800 dark:bg-gray-200 rounded-full"
                style={{
                  left: `${dot[0]}%`,
                  top: `${dot[1]}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        ) : isRolling ? (
          <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">?</div>
        ) : (
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600 dark:text-gray-300">Lançar</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">Dado</div>
          </div>
        )}
      </button>

      {value && !isRolling && !showQuestion && (
        <div className="text-center animate-bounce">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
            {value === 1 ? 'casa' : 'casas'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Preparando pergunta...
          </div>
        </div>
      )}

      {!canRoll && !isRolling && showQuestion && (
        <div className="text-sm text-purple-600 dark:text-purple-400 text-center max-w-xs font-semibold">
          🎯 Responda à pergunta para mover!
        </div>
      )}

      {!canRoll && !isRolling && !showQuestion && value && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Aguarde a pergunta aparecer...
        </div>
      )}

      {canRoll && !isRolling && !value && (
        <div className="text-sm text-green-600 dark:text-green-400 font-semibold animate-pulse">
          🎲 Clique para lançar o dado!
        </div>
      )}
    </div>
  )
}

export default Dice
