import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-lg shadow-black/20 transition-colors hover:border-accent/50 hover:text-accent-soft animate-page-in"
    >
      <ArrowUp size={18} strokeWidth={1.75} />
    </button>
  )
}