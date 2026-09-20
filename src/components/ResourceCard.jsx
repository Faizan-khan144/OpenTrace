import { useEffect, useRef, useState } from 'react'
import { ExternalLink, FolderPlus } from 'lucide-react'
import { useApp } from '../hooks/useApp.js'
import Modal from './Modal.jsx'
import EmptyState from './EmptyState.jsx'
import VerifiedBadge from './VerifiedBadge.jsx'
import Tag from './Tag.jsx'
import { getCategory, subcategoryLabel } from '../data/categories.js'
import { hostnameOf } from '../utils/url.js'
import { Link } from 'react-router-dom'

export default function ResourceCard({ resource, index = 0 }) {
  const { favorites, toggleFavorite, toggleInCollection, notify, collections } = useApp()
  const isFav = favorites.includes(resource.id)
  const [pickerOpen, setPickerOpen] = useState(false)
  const cardRef = useRef(null)
  const inAnyCollection = collections.some((c) => c.resourceIds.includes(resource.id))

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.animationDelay = `${Math.min(index, 12) * 40}ms`
    }
  }, [index])

  const category = getCategory(resource.category)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(resource.id)
    notify(isFav ? 'Removed from favorites' : 'Added to favorites', 'success')
  }

  const toggleForCollection = (collectionId) => {
    const already = collections
      .find((c) => c.id === collectionId)
      ?.resourceIds.includes(resource.id)
    toggleInCollection(collectionId, resource.id)
    notify(
      already
        ? `Removed from collection`
        : `Added to collection`,
      'success',
    )
  }

  return (
    <>
      <Link
        ref={cardRef}
        to={`/resource/${resource.id}`}
        className={`group stagger-item relative flex flex-col rounded-xl border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line2 hover:shadow-lg hover:shadow-black/10 ${
          inAnyCollection ? 'border-amber-400/40' : 'border-line'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold text-ink">
                {resource.name}
              </h3>
              <VerifiedBadge verified={resource.verified} muted />
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-faint">
              {hostnameOf(resource.url)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {resource.featured && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-soft">
                Featured
              </span>
            )}
            <button
              onClick={handleFavorite}
              aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
              className={`rounded-md p-1.5 transition-colors ${
                isFav ? 'text-accent' : 'text-faint hover:text-accent-soft'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill={isFav ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                <path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3 1.1-6.5L2.6 9.6l6.5-.9z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="line-clamp-3 flex-1 text-[13px] leading-relaxed text-sub">
          {resource.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Tag label={category ? category.name : resource.category} />
          <Tag label={subcategoryLabel(resource.category, resource.subcategory)} />
          {resource.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
          <div className="flex items-center gap-3 font-mono text-[11px] text-faint">
            <span>{resource.pricing}</span>
            <span className="text-line2">•</span>
            <span>{resource.platform}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setPickerOpen(true)
              }}
              aria-label="Add to collection"
              className={`rounded-md p-1.5 transition-colors ${
                inAnyCollection
                  ? 'text-amber-400'
                  : 'text-faint hover:text-amber-400'
              }`}
            >
              <FolderPlus size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-faint transition-colors group-hover:border-accent/40 group-hover:text-accent-soft">
              <ExternalLink size={13} />
            </span>
          </div>
        </div>
      </Link>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={`Add to collection — ${resource.name}`}
      >
        {collections.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No collections yet"
            description="Create a collection to start organizing resources."
            action={
              <Link to="/collections" className="btn-primary">
                Go to collections
              </Link>
            }
          />
        ) : (
          <ul className="space-y-1.5">
            {collections.map((collection) => {
              const inCol = collection.resourceIds.includes(resource.id)
              return (
                <li key={collection.id}>
                  <button
                    onClick={() => toggleForCollection(collection.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-line px-4 py-3 text-left transition-colors hover:border-line2 hover:bg-surface2"
                  >
                    <span className="text-sm font-medium text-ink">
                      {collection.name}
                    </span>
                    <span className={`chip ${inCol ? 'border-accent text-accent-soft' : ''}`}>
                      {inCol ? 'Added' : 'Add'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Modal>
    </>
  )
}