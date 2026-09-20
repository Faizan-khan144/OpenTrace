import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useApp } from '../hooks/useApp.js'

const STYLES = {
  success: { icon: CheckCircle2, className: 'border-emerald-400/30 text-emerald-400' },
  info: { icon: Info, className: 'border-line2 text-sub' },
  error: { icon: XCircle, className: 'border-red-400/30 text-red-400' },
}

export default function ToastStack() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.info
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface px-4 py-3 shadow-lg shadow-black/20 animate-pop-in ${style.className}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm text-ink">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              className="rounded p-0.5 text-faint transition-colors hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}