import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { resources, getByCategory } from '../data/resources/index.js'
import { categories } from '../data/categories.js'
import { searchResources } from '../utils/search.js'
import { taskSearchResources } from '../utils/taskSearch.js'
import { applyFilters, filtersActive } from '../utils/filters.js'
import SearchBar from '../components/SearchBar.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
import ResourceGrid from '../components/ResourceGrid.jsx'
import PageHeader from '../components/PageHeader.jsx'

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Top match' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'verified', label: 'Verified first' },
  { id: 'featured', label: 'Featured first' },
]

const EMPTY_FILTERS = {
  category: '',
  subcategory: '',
  pricing: [],
  platform: [],
  type: [],
  verified: false,
  featured: false,
}

export default function ExplorePage() {
  const [params] = useSearchParams()
  const urlQuery = params.get('q') || ''

  const [query, setQuery] = useState(urlQuery)
  const [sort, setSort] = useState('relevance')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const counts = useMemo(
    () => ({
      byCategory: Object.fromEntries(
        categories.map((c) => [c.id, getByCategory(c.id).length]),
      ),
      bySubcategory: (() => {
        const map = {}
        for (const c of categories) {
          for (const s of c.subcategories) {
            map[s.id] = resources.filter(
              (r) => r.category === c.id && r.subcategory === s.id,
            ).length
          }
        }
        return map
      })(),
      verified: resources.filter((r) => r.verified).length,
      featured: resources.filter((r) => r.featured).length,
    }),
    [],
  )

  const results = useMemo(() => {
    let pool = resources
    if (filtersActive(filters)) {
      pool = applyFilters(pool, filters)
    }
    if (query.trim()) {
      const keyword = searchResources(pool, query)
      if (keyword.length >= 3 || pool.length <= 3) {
        pool = keyword
      } else {
        const task = taskSearchResources(resources, query)
        const keywordIds = new Set(keyword.map((r) => r.id))
        const extra = task.filter((r) => !keywordIds.has(r.id))
        pool = [...keyword, ...extra]
      }
    }
    const sorted = [...pool]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'verified':
        sorted.sort((a, b) => Number(b.verified) - Number(a.verified) || a.name.localeCompare(b.name))
        break
      case 'featured':
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => (b._score || 0) - (a._score || 0))
    }
    return sorted
  }, [query, sort, filters])

  const hasFilters = filtersActive(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Explore"
        title="Browse the directory"
        description="Search by name, description, category, or tags — or describe the task and OpenTrace will suggest the right resources."
      />

      <div className="mb-8 max-w-2xl">
        <SearchBar
          autoFocus
          large
        />
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          Try: "I need a website to compress images"
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20">
            <FiltersPanel filters={filters} setFilters={setFilters} counts={counts} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-sub">
              <span className="font-semibold text-ink">{results.length}</span> resource{results.length === 1 ? '' : 's'}
              {hasFilters && ' · filtered'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="btn-ghost px-3 py-1.5 text-[13px] lg:hidden"
              >
                <SlidersHorizontal size={14} /> Filters
                {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-base w-auto py-1.5 font-mono text-[11px] uppercase tracking-wider"
                aria-label="Sort results"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ResourceGrid resources={results} />

          {query.trim() && results.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-accent-soft"
            >
              <X size={12} /> Clear search
            </button>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto border-l border-line bg-canvas p-5 animate-fade-in">
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              counts={counts}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}