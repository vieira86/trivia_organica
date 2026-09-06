const SoundToggle = ({ muted, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={muted ? 'Ativar som' : 'Desativar som'}
    title={muted ? 'Ativar som' : 'Desativar som'}
    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 shadow-md hover:scale-110 transition-all duration-200 text-xl"
  >
    {muted ? '🔇' : '🔊'}
  </button>
)

export default SoundToggle
