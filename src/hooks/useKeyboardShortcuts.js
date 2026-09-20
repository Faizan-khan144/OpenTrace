import { useEffect } from 'react'

const ROUTES = {
  h: '/',
  e: '/explore',
  f: '/favorites',
  c: '/collections',
  r: '/recent',
}

export default function useKeyboardShortcuts({ onToggleTheme, onNavigate, onToggleShortcuts }) {
  useEffect(() => {
    let pending = false
    let clearPending = null

    const onKey = (e) => {
      const isExclusive =
        !e.metaKey && !e.ctrlKey && !e.altKey
      const typing =
        e.target &&
        e.target.closest &&
        e.target.closest('input, textarea, select, [contenteditable]')
      const consumed = pending
      if (consumed) {
        pending = false
        if (clearPending) clearTimeout(clearPending)
        if (!typing && ROUTES[e.key] && isExclusive) {
          e.preventDefault()
          onNavigate(ROUTES[e.key])
        }
        return
      }
      if (typing) return
      if (e.key === '?' && isExclusive) {
        e.preventDefault()
        onToggleShortcuts()
        return
      }
      if (e.key === 't' && isExclusive) {
        e.preventDefault()
        onToggleTheme()
        return
      }
      if (e.key === 'g' && isExclusive) {
        pending = true
        if (clearPending) clearTimeout(clearPending)
        clearPending = setTimeout(() => {
          pending = false
        }, 800)
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (clearPending) clearTimeout(clearPending)
    }
  }, [onToggleTheme, onNavigate, onToggleShortcuts])
}