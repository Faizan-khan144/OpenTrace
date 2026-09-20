import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ExternalLink, Search, Sparkles } from 'lucide-react'
import { resources } from '../data/resources/index.js'
import { searchResources } from '../utils/search.js'
import { taskSearchResources } from '../utils/taskSearch.js'
import { hostnameOf } from '../utils/url.js'
import { getCategory } from '../data/categories.js'
import { useApp } from '../hooks/useApp.js'

export default function SearchBar({ autoFocus = false, size = 'default', onNavigate }) {
  const navigate = useNavigate()
  const { recent, touchResource } = useApp()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const keywordResults = useMemo(
    () => (query.trim() ? searchResources(resources, query).slice(0, 8) : []),
    [query],
  )

  const taskResults = useMemo(() => {
    const terms = query.trim().split(/\s+/).length
    if (!query.trim() || terms < 3) return []
    const results = taskSearchResources(resources, query)
    const keywordIds = new Set(keywordResults.slice(0, 4).map((r) => r.id))
    return results.filter((r) => !keywordIds.has(r.id)).slice(0, 4)
  }, [query, keywordResults])

  const recentResources = useMemo(
    () =>
      recent
        .map((entry) => resources.find((r) => r.id === entry.resourceId))
        .filter(Boolean)
        .slice(0, 5),
    [recent],
  )

  const grouped = useMemo(() => {
    const list = []
    if (keywordResults.length) {
      list.push({ label: 'Matches', items: keywordResults })
    }
    if (taskResults.length) {
      list.push({ label: 'Suggested for your task', items: taskResults, sparkle: true })
    }
    return list
  }, [keywordResults, taskResults])

  const emptyTerminal =
    recentResources.length > 0 && !query && open

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      } else if (e.key === '/' && !open && !e.target.closest('input, textarea')) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    const onOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [open])

  const navigateTo = (resource) => {
    touchResource(resource)
    setOpen(false)
    setQuery('')
    navigate(`/resource/${resource.id}`)
    onNavigate?.()
  }

  const visible = open && (grouped.length > 0 || emptyTerminal)

  const keyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % (keywordResults.length + taskResults.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const total = keywordResults.length + taskResults.length
      setActiveIndex((i) => (i - 1 + total) % (total || 1))
    } else if (e.key === 'Enter') {
      const item = [...keywordResults, ...taskResults][activeIndex]
      if (item) navigateTo(item)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const flatItems = [...keywordResults, ...taskResults]

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-xl border transition-all ${
          open && query ? 'border-accent/50 ring-2 ring-accent/10' : 'border-line bg-surface'
        }`}
      >
        <Search size={16} className="ml-3.5 shrink-0 text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={keyDown}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              if (flatItems.length === 0 && query.trim()) {
                navigate(`/explore?q=${encodeURIComponent(query.trim())}`)
                setOpen(false)
                onNavigate?.()
              }
            }
          }}
          placeholder="Search resources…  (press / or Ctrl+K)"
          className={`w-full bg-transparent text-ink placeholder:text-faint focus:outline-none ${
            size === 'large' ? 'py-3.5 text-base' : 'py-2.5 text-sm'
          }`}
          aria-label="Search resources"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="mr-2 rounded p-1 text-[11px] font-mono text-faint transition-colors hover:text-ink"
          >
            clear
          </button>
        )}
      </div>

      {visible && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/30 animate-pop-in">
          {emptyTerminal && (
            <div className="px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              Recently visited
            </div>
          )}
          {emptyTerminal &&
            recentResources.map((resource) => (
              <ResultRow
                key={resource.id}
                resource={resource}
                onPick={() => navigateTo(resource)}
              />
            ))}
          {grouped.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                {group.sparkle && <Sparkles size={11} className="text-accent-soft" />}
                {group.label}
                <span className="ml-auto text-line2">
                  {group.items.length}
                </span>
              </div>
              {group.items.map((resource) => (
                <ResultRow
                  key={resource.id}
                  resource={resource}
                  active={resource.id === flatItems[activeIndex]?.id}
                  onPick={() => navigateTo(resource)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ResultRow({ resource, active = false, onPick }) {
  const category = getCategory(resource.category)
  return (
    <button
      onClick={onPick}
      onMouseEnter={() => {}}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        active ? 'bg-surface2' : 'bg-transparent hover:bg-surface2'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-ink">{resource.name}</span>
          <ExternalLink size={11} className="shrink-0 text-faint" />
        </div>
        <p className="truncate font-mono text-[11px] text-faint">
          {hostnameOf(resource.url)} · {category?.name}
        </p>
      </div>
      <ArrowRight size={14} className={active ? 'text-accent-soft' : 'text-faint'} />
    </button>
  )
}