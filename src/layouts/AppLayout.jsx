import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import TopNav from '../components/layout/TopNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import ToastStack from '../components/ToastStack.jsx'
import BackToTop from '../components/BackToTop.jsx'
import ShortcutsModal from '../components/ShortcutsModal.jsx'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts.js'
import { useApp } from '../hooks/useApp.js'

export default function AppLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { toggleTheme } = useApp()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useKeyboardShortcuts({
    onToggleTheme: toggleTheme,
    onToggleShortcuts: () => setShortcutsOpen((open) => !open),
    onNavigate: navigate,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <ToastStack />
      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
    </div>
  )
}