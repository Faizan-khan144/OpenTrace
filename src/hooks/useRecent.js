import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export const RECENT_LIMIT = 60

export function useRecent() {
  const [recent, setRecent] = useLocalStorage('recent', [])

  const touchResource = useCallback(
    (resource) => {
      setRecent((prev) => {
        const without = prev.filter((entry) => entry.resourceId !== resource.id)
        const next = [
          { resourceId: resource.id, visitedAt: Date.now() },
          ...without,
        ]
        return next.slice(0, RECENT_LIMIT)
      })
    },
    [setRecent],
  )

  const clearRecent = useCallback(() => {
    setRecent([])
  }, [setRecent])

  return { recent, setRecent, touchResource, clearRecent }
}