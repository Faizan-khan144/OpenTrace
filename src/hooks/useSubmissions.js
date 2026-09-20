import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage('submissions', [])

  const addSubmission = useCallback(
    (submission) => {
      const next = {
        id: createId(),
        ...submission,
        createdAt: Date.now(),
        verified: false,
      }
      setSubmissions((prev) => [next, ...prev])
      return next
    },
    [setSubmissions],
  )

  const removeSubmission = useCallback(
    (id) => {
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    },
    [setSubmissions],
  )

  return { submissions, setSubmissions, addSubmission, removeSubmission }
}