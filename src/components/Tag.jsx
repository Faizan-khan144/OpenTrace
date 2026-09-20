export default function Tag({ label, active = false, onClick }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`chip transition-colors ${
          active
            ? 'border-accent bg-accent/10 text-accent-soft'
            : 'hover:border-line2 hover:text-ink'
        }`}
      >
        {label}
      </button>
    )
  }
  return <span className="chip">{label}</span>
}