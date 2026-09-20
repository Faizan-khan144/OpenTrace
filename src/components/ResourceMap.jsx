import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories.js'
import { getByCategory, resources } from '../data/resources/index.js'
import CategoryIcon from './CategoryIcon.jsx'

function ResourceLink({ resource }) {
  return (
    <Link
      to={`/resource/${resource.id}`}
      className="group flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-[13px] text-sub transition-colors hover:border-line hover:bg-surface2 hover:text-ink"
    >
      <span className="h-1 w-1 rounded-full bg-line2 transition-colors group-hover:bg-accent-soft" />
      <span className="truncate">{resource.name}</span>
    </Link>
  )
}

function SubcategoryGroup({ category, subcategory, items }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left transition-colors hover:bg-surface2"
      >
        <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
          {subcategory.name}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-faint">
          {items.length}
          {open ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
        </span>
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 border-l border-line pl-3">
          {items.map((resource) => (
            <ResourceLink key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryPanel({ category, defaultOpen, index }) {
  const [open, setOpen] = useState(defaultOpen)
  const categoryResources = getByCategory(category.id)
  const count = categoryResources.length
  const tint = category.tint

  return (
    <div
      className="panel overflow-hidden transition-all duration-200 hover:border-line2"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface2"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
            style={{ borderColor: `${tint}33`, backgroundColor: `${tint}11`, color: tint }}
          >
            <CategoryIcon name={category.icon} size={17} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{category.name}</h3>
            <p className="truncate font-mono text-[11px] text-faint">
              {category.subcategories.length} subcategories
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-[11px] text-faint">{count}</span>
          {open ? (
            <ChevronDown size={15} className="text-faint" />
          ) : (
            <ChevronRight size={15} className="text-faint" />
          )}
        </div>
      </button>

      {open && (
        <div className="animate-fade-in border-t border-line px-3 py-3">
          <div className="grid gap-4 md:grid-cols-2">
            {category.subcategories.map((subcategory) => {
              const items = categoryResources.filter(
                (r) => r.subcategory === subcategory.id,
              )
              if (items.length === 0) return null
              return (
                <SubcategoryGroup
                  key={subcategory.id}
                  category={category}
                  subcategory={subcategory}
                  items={items}
                />
              )
            })}
          </div>
          <Link
            to={`/category/${category.id}`}
            className="mt-3 inline-block font-mono text-[11px] uppercase tracking-wider text-accent-soft transition-colors hover:text-accent"
          >
            View all {count} resources →
          </Link>
        </div>
      )}
    </div>
  )
}

export default function ResourceMap() {
  const total = resources.length
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
          Interactive resource map
        </p>
        <p className="font-mono text-[11px] text-faint">
          {categories.length} categories · {total} resources
        </p>
      </div>
      {categories.map((category, index) => (
        <CategoryPanel
          key={category.id}
          category={category}
          defaultOpen={index < 2}
          index={index}
        />
      ))}
    </div>
  )
}