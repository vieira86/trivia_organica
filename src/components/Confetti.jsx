import { useState } from 'react'

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ec4899']

function generatePieces(pieceCount) {
  return Array.from({ length: pieceCount }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    color: COLORS[index % COLORS.length],
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 1.5,
    rotate: Math.random() * 360
  }))
}

const Confetti = ({ pieceCount = 80 }) => {
  // Gerado uma única vez via inicializador preguiçoso do useState — useMemo não
  // é garantia de execução única (React pode descartar o cache), então uma
  // fonte de aleatoriedade não pode viver ali.
  const [pieces] = useState(() => generatePieces(pieceCount))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]" aria-hidden="true">
      {pieces.map(piece => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
