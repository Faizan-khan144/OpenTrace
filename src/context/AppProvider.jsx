import { useCallback, useMemo, useRef, useState } from 'react'
import { AppContext } from './AppContext.js'
import { useTheme } from '../hooks/useTheme.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { useCollections } from '../hooks/useCollections.js'
import { useRecent } from '../hooks/useRecent.js'
import { useNotes } from '../hooks/useNotes.js'
import { useSubmissions } from '../hooks/useSubmissions.js'
import { useReports } from '../hooks/useReports.js'
import { useDataManager } from '../hooks/useDataManager.js'

export function AppProvider({ children }) {
  const themeApi = useTheme()
  const favoritesApi = useFavorites()
  const collectionsApi = useCollections()
  const recentApi = useRecent()
  const notesApi = useNotes()
  const submissionsApi = useSubmissions()
  const reportsApi = useReports()

  const dataApi = {
    theme: themeApi.theme,
    setTheme: themeApi.setTheme,
    favorites: favoritesApi.favorites,
    setFavorites: favoritesApi.setFavorites,
    collections: collectionsApi.collections,
    setCollections: collectionsApi.setCollections,
    recent: recentApi.recent,
    setRecent: recentApi.setRecent,
    notes: notesApi.notes,
    setNotes: notesApi.setNotes,
    submissions: submissionsApi.submissions,
    setSubmissions: submissionsApi.setSubmissions,
    reports: reportsApi.reports,
    setReports: reportsApi.setReports,
  }
  const { exportData, importData, clearData } = useDataManager(dataApi)

  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message, type = 'info') => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}`
      setToasts((prev) => [...prev, { id, message, type }])
      const timer = setTimeout(() => dismissToast(id), 3200)
      timers.current.set(id, timer)
      return id
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      ...themeApi,
      ...favoritesApi,
      ...collectionsApi,
      ...recentApi,
      ...notesApi,
      ...submissionsApi,
      ...reportsApi,
      toasts,
      notify,
      dismissToast,
      exportData,
      importData,
      clearData,
    }),
    [
      themeApi,
      favoritesApi,
      collectionsApi,
      recentApi,
      notesApi,
      submissionsApi,
      reportsApi,
      toasts,
      notify,
      dismissToast,
      exportData,
      importData,
      clearData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}