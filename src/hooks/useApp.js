import { useContext } from 'react'
import { AppContext } from '../context/AppContext.js'

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}