import { useCallback } from 'react'

const SANITIZERS = {
  theme: (v) => (v === 'dark' || v === 'light' ? v : 'dark'),
  favorites: (v) => Array.isArray(v) && v.every((id) => typeof id === 'string'),
  collections: (v) =>
    Array.isArray(v) &&
    v.every((c) => c && typeof c.id === 'string' && Array.isArray(c.resourceIds)),
  recent: (v) =>
    Array.isArray(v) && v.every((e) => e && typeof e.resourceId === 'string'),
  notes: (v) => v && typeof v === 'object' && !Array.isArray(v),
  submissions: (v) => Array.isArray(v) && v.every((s) => s && typeof s.id === 'string'),
  reports: (v) => Array.isArray(v) && v.every((r) => r && typeof r.id === 'string'),
}

const DEFAULTS = {
  theme: 'dark',
  favorites: [],
  collections: [],
  recent: [],
  notes: {},
  submissions: [],
  reports: [],
}

export function useDataManager(api) {
  const exportData = useCallback(() => {
    return {
      app: 'opentrace',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        theme: api.theme,
        favorites: api.favorites,
        collections: api.collections,
        recent: api.recent,
        notes: api.notes,
        submissions: api.submissions,
        reports: api.reports,
      },
    }
  }, [api])

  const importData = useCallback(
    (raw) => {
      let parsed
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw)
        } catch {
          return { ok: false, reason: 'The file is not valid JSON.' }
        }
      } else {
        parsed = raw
      }
      if (!parsed || parsed.app !== 'opentrace' || !parsed.data || typeof parsed.data !== 'object') {
        return { ok: false, reason: 'This does not look like an OpenTrace backup file.' }
      }
      const d = parsed.data
      const active = Object.keys(api).filter((key) => key in SANITIZERS)
      let restored = 0
      for (const key of active) {
        const rawValue = d[key]
        const sanitizer = SANITIZERS[key]
        if (rawValue === undefined) continue
        if (!sanitizer(rawValue)) continue
        API_SETTERS[key](api, sanitizer(rawValue))
        restored += 1
      }
      return { ok: true, restored }
    },
    [api],
  )

  const clearData = useCallback(() => {
    for (const key of Object.keys(DEFAULTS)) {
      API_SETTERS[key](api, DEFAULTS[key])
    }
  }, [api])

  return { exportData, importData, clearData }
}

const API_SETTERS = {
  theme: (api, value) => api.setTheme(value),
  favorites: (api, value) => api.setFavorites(value),
  collections: (api, value) => api.setCollections(value),
  recent: (api, value) => api.setRecent(value),
  notes: (api, value) => api.setNotes(value),
  submissions: (api, value) => api.setSubmissions(value),
  reports: (api, value) => api.setReports(value),
}