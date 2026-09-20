import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useApp } from '../../hooks/useApp.js'
import SearchBar from '../SearchBar.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Map', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/collections', label: 'Collections' },
  { to: '/recent', label: 'Recent' },
  { to: '/submit', label: 'Submit' },
]

export function LogoMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--color-surface2)" stroke="var(--color-line)" />
      <circle cx="10" cy="16" r="4" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="22" cy="11" r="3" fill="var(--color-accent)" />
      <circle cx="22" cy="21" r="3" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M14 16h5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function TopNav() {
  const { theme, toggleTheme } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMobile}>
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            OpenTrace
          </span>
        </Link>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                  isActive ? 'text-ink' : 'text-sub hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-sub transition-colors hover:bg-surface2 hover:text-ink"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-sub transition-colors hover:bg-surface2 hover:text-ink lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-line bg-canvas lg:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
            <SearchBar onNavigate={closeMobile} />
            <nav className="grid gap-1">
              {NAV_LINKS.map((link) => {
                const active =
                  link.end
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-surface2 font-medium text-ink'
                        : 'text-sub hover:bg-surface2 hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}