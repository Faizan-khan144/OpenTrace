import { SlidersHorizontal, X } from 'lucide-react'
import { categories } from '../data/categories.js'
import { PRICING_OPTIONS, TYPE_OPTIONS } from '../utils/filters.js'

function Toggle({
  label,
  count,
  on,
  onToggle,
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
        on ? 'border-accent/50 bg-accent/5 text-ink' : 'border-line text-sub hover:border-line2'
      }`}
    >
      <span>{label}</span>
      <span className="font-mono text-[11px] text-faint">{count}</span>
    </button>
  )
}

export default function FiltersPanel({ filters, setFilters, counts, onClose }) {
  const set = (patch) => setFilters((prev) => ({ ...prev, ...patch }))

  const toggleInList = (key, value) =>
    set((prev) => {
      const list = prev[key] || []
      return {
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      }
    })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal size={14} /> Filters
        </h2>
        <button
          onClick={() => {
            setFilters({
              category: '',
              subcategory: '',
              pricing: [],
              platform: [],
              type: [],
              verified: false,
              featured: false,
            })
          }}
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-accent-soft"
        >
          <X size={12} /> Reset
        </button>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          Category
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {categories.map((c) => (
            <Toggle
              key={c.id}
              label={c.name}
              count={counts?.byCategory?.[c.id] ?? 0}
              on={filters.category === c.id}
              onToggle={() =>
                set({
                  category: filters.category === c.id ? '' : c.id,
                  subcategory: '',
                })
              }
            />
          ))}
        </div>
      </div>

      {filters.category && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
            Subcategory
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {categories
              .find((c) => c.id === filters.category)
              ?.subcategories.map((s) => (
                <Toggle
                  key={s.id}
                  label={s.name}
                  count={counts?.bySubcategory?.[s.id] ?? 0}
                  on={filters.subcategory === s.id}
                  onToggle={() =>
                    set({ subcategory: filters.subcategory === s.id ? '' : s.id })
                  }
                />
              ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          Pricing
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRICING_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleInList('pricing', option)}
              className={`chip transition-colors ${
                (filters.pricing || []).includes(option)
                  ? 'border-accent bg-accent/10 text-accent-soft'
                  : 'hover:border-line2 hover:text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          Platform
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['Web', 'Mobile', 'Desktop', 'Browser extension'].map((option) => (
            <button
              key={option}
              onClick={() => toggleInList('platform', option)}
              className={`chip transition-colors ${
                (filters.platform || []).includes(option)
                  ? 'border-accent bg-accent/10 text-accent-soft'
                  : 'hover:border-line2 hover:text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          Resource type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleInList('type', option)}
              className={`chip transition-colors ${
                (filters.type || []).includes(option)
                  ? 'border-accent bg-accent/10 text-accent-soft'
                  : 'hover:border-line2 hover:text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Toggle
          label="Verified only"
          count={counts?.verified ?? 0}
          on={Boolean(filters.verified)}
          onToggle={() => set({ verified: !filters.verified })}
        />
        <Toggle
          label="Featured only"
          count={counts?.featured ?? 0}
          on={Boolean(filters.featured)}
          onToggle={() => set({ featured: !filters.featured })}
        />
      </div>

      {onClose && (
        <button onClick={onClose} className="btn-ghost w-full">
          Apply filters
        </button>
      )}
    </div>
  )
}