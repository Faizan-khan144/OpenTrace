import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../components/layout/TopNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import ToastStack from '../components/ToastStack.jsx'

export default function AppLayout() {
  const { pathname } = useLocation()

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
      <ToastStack />
    </div>
  )
}