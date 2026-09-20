import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `col-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useCollections() {
  const [collections, setCollections] = useLocalStorage('collections', [])

  const createCollection = useCallback(
    (name, description = '') => {
      const collection = {
        id: createId(),
        name,
        description,
        createdAt: Date.now(),
        resourceIds: [],
      }
      setCollections((prev) => [collection, ...prev])
      return collection
    },
    [setCollections],
  )

  const deleteCollection = useCallback(
    (collectionId) => {
      setCollections((prev) => prev.filter((c) => c.id !== collectionId))
    },
    [setCollections],
  )

  const renameCollection = useCallback(
    (collectionId, name) => {
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, name } : c)),
      )
    },
    [setCollections],
  )

  const isInCollection = useCallback(
    (collectionId, resourceId) => {
      const collection = collections.find((c) => c.id === collectionId)
      return Boolean(collection && collection.resourceIds.includes(resourceId))
    },
    [collections],
  )

  const toggleInCollection = useCallback(
    (collectionId, resourceId) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                resourceIds: c.resourceIds.includes(resourceId)
                  ? c.resourceIds.filter((id) => id !== resourceId)
                  : [...c.resourceIds, resourceId],
              }
            : c,
        ),
      )
    },
    [setCollections],
  )

  return {
    collections,
    createCollection,
    deleteCollection,
    renameCollection,
    isInCollection,
    toggleInCollection,
  }
}