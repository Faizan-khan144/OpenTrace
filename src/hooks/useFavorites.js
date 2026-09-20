import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const isFavorite = useCallback(
    (resourceId) => favorites.includes(resourceId),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (resourceId) => {
      setFavorites((prev) =>
        prev.includes(resourceId)
          ? prev.filter((id) => id !== resourceId)
          : [resourceId, ...prev],
      )
    },
    [setFavorites],
  )

  return { favorites, isFavorite, toggleFavorite }
}