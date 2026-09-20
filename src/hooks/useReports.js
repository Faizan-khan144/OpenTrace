import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `rep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useReports() {
  const [reports, setReports] = useLocalStorage('reports', [])

  const addReport = useCallback(
    (report) => {
      const next = {
        id: createId(),
        ...report,
        createdAt: Date.now(),
      }
      setReports((prev) => [next, ...prev])
      return next
    },
    [setReports],
  )

  return { reports, setReports, addReport }
}