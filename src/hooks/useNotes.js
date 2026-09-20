import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes', {})

  const getNote = useCallback(
    (resourceId) => notes[resourceId] || '',
    [notes],
  )

  const saveNote = useCallback(
    (resourceId, text) => {
      setNotes((prev) => {
        const next = { ...prev }
        if (text.trim()) {
          next[resourceId] = { text, updatedAt: Date.now() }
        } else {
          delete next[resourceId]
        }
        return next
      })
    },
    [setNotes],
  )

  return { notes, getNote, saveNote }
}