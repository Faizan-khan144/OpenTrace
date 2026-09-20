import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { categories, getCategory } from '../data/categories.js'
import { getByCategory, resources } from '../data/resources/index.js'
import { searchResources } from '../utils/search.js'
import CategoryIcon from '../components/CategoryIcon.jsx'
import Tag from '../components/Tag.jsx'
import ResourceGrid from '../components/ResourceGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = getCategory(categoryId)
  const [query, setQuery] = useState('')
  const [activeSub, setActiveSub] = useState('')

  const categoryResources = useMemo(
    () => (category ? getByCategory(category.id) : []),
    [category],
  )

  const filtered = useMemo(() => {
    let pool = categoryResources
    if (activeSub) pool = pool.filter((r) => r.subcategory === activeSub)
    if (query.trim()) pool = searchResources(pool, query)
    return pool
  }, [categoryResources, activeSub, query])

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Category not found"
          description="That category does not exist in the OpenTrace map."
          action={
            <Link to="/explore" className="btn-primary">
              Explore all categories
            </Link>
          }
        />
      </div>
    )
  }

  const total = categoryResources.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/explore"
        className="mb-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-ink"
      >
        <ChevronLeft size={13} /> Back to explore
      </Link>

      <div className="panel mb-8 animate-page-in p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border"
              style={{
                borderColor: `${category.tint}33`,
                backgroundColor: `${category.tint}11`,
                color: category.tint,
              }}
            >
              <CategoryIcon name={category.icon} size={26} />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent-soft">
                Category
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {category.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sub sm:text-base">
                {category.description}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-faint">
                {category.subcategories.length} subcategories · {total} resources
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.name} resources…`}
            className="input-base sm:max-w-xs"
            aria-label={`Search ${category.name} resources`}
          />
          <div className="flex flex-wrap gap-1.5">
            <Tag
              label="All"
              active={!activeSub}
              onClick={() => setActiveSub('')}
            />
            {category.subcategories.map((sub) => (
              <Tag
                key={sub.id}
                label={sub.name}
                active={activeSub === sub.id}
                onClick={() => setActiveSub(sub.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-sub">
        <span className="font-semibold text-ink">{filtered.length}</span> of {total} resources
      </p>

      <ResourceGrid
        resources={filtered}
        emptyTitle="No matching resources"
        emptyDescription="Try a different search term or subcategory."
      />
    </div>
  )
}