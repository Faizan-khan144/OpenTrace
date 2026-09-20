import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', () =>
    prefersDark() ? 'dark' : 'dark',
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggleTheme, setTheme }
}