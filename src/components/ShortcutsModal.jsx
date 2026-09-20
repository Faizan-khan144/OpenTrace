import Modal from './Modal.jsx'

const SHORTCUTS = [
  { keys: ['/'], label: 'Focus search' },
  { keys: ['Ctrl', 'K'], label: 'Focus search' },
  { keys: ['Enter'], label: 'Open the highlighted result' },
  { keys: ['Esc'], label: 'Close menu or modal' },
  { keys: ['?'], label: 'Toggle this panel' },
  { keys: ['g', 'h'], label: 'Go to home' },
  { keys: ['g', 'e'], label: 'Go to explore' },
  { keys: ['g', 'f'], label: 'Go to favorites' },
  { keys: ['g', 'c'], label: 'Go to collections' },
  { keys: ['g', 'r'], label: 'Go to recently visited' },
  { keys: ['t'], label: 'Toggle dark / light theme' },
]

function Key({ label }) {
  return (
    <kbd className="min-w-6 rounded border border-line2 bg-surface2 px-1.5 py-0.5 text-center font-mono text-[11px] text-ink">
      {label}
    </kbd>
  )
}

export default function ShortcutsModal({ onClose }) {
  return (
    <Modal open onClose={onClose} title="Keyboard shortcuts" width="max-w-md">
      <p className="mb-4 text-[13px] text-sub">
        Shortcuts work anywhere except while typing in an input.
      </p>
      <ul className="space-y-2">
        {SHORTCUTS.map((shortcut) => (
          <li
            key={shortcut.label + shortcut.keys.join('-')}
            className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5"
          >
            <span className="text-[13px] text-ink">{shortcut.label}</span>
            <span className="flex items-center gap-1">
              {shortcut.keys.map((key) => (
                <Key key={key} label={key} />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}