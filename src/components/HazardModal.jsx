import { useEffect } from 'react'
import { playHazard } from '../utils/sound'

/**
 * Alerta de casa-armadilha. No modo local, espera o jogador confirmar (onConfirm).
 * No modo online, pode se fechar sozinha depois de `autoCloseMs` (informativa,
 * já que o efeito já foi aplicado no estado compartilhado).
 */
const HazardModal = ({ hazard, onConfirm, autoCloseMs = null }) => {
  useEffect(() => {
    playHazard()
  }, [])

  useEffect(() => {
    if (!autoCloseMs) return undefined
    const timer = setTimeout(() => onConfirm?.(), autoCloseMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCloseMs])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div
          className="p-6 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${hazard.color}, ${hazard.color}cc)` }}
        >
          <div className="text-5xl mb-2">{hazard.icon}</div>
          <h2 className="text-xl font-bold">{hazard.label}</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-800 dark:text-gray-100 font-semibold mb-3">{hazard.message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{hazard.description}</p>

          {!autoCloseMs && (
            <button
              onClick={onConfirm}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: hazard.color }}
            >
              Entendi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default HazardModal
