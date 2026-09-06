import { useMemo, useState } from 'react'
import { AREAS, QUESTIONS, getArea } from '../data/questions'

const StudyMode = ({ onBack }) => {
  const [activeArea, setActiveArea] = useState('todas')

  const filteredQuestions = useMemo(() => {
    if (activeArea === 'todas') return QUESTIONS
    return QUESTIONS.filter(q => q.area === activeArea)
  }, [activeArea])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            📚 Modo Estudo
          </h2>
          <button
            onClick={onBack}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            ← Voltar
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Revise todo o conteúdo de Química cobrado no jogo, sem pressão de tempo ou penalidades.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveArea('todas')}
            className={`
              text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors
              ${activeArea === 'todas'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white/60 dark:bg-slate-800/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-purple-400'
              }
            `}
          >
            Todas
          </button>
          {AREAS.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className="text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors"
              style={
                activeArea === area.id
                  ? { backgroundColor: area.color, borderColor: area.color, color: 'white' }
                  : { borderColor: area.color, color: area.color }
              }
            >
              {area.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredQuestions.map(q => {
            const area = getArea(q.area)
            return (
              <div key={q.id} className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: area.color }}
                  >
                    {area.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                    {q.category}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{q.question}</p>
                <ul className="space-y-1 mb-2">
                  {q.options.map((option, index) => (
                    <li
                      key={index}
                      className={`text-sm px-3 py-1.5 rounded-lg ${
                        index === q.correct
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-semibold'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {index === q.correct ? '✓ ' : ''}{option}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StudyMode
