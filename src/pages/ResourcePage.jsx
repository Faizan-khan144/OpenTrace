import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  Check,
  ExternalLink,
  FolderPlus,
  Globe,
  Plus,
  Save,
  ShieldAlert,
  Star,
} from 'lucide-react'
import { resources, getRelated } from '../data/resources/index.js'
import { getCategory, subcategoryLabel } from '../data/categories.js'
import { useApp } from '../hooks/useApp.js'
import { normalizeUrl, hostnameOf } from '../utils/url.js'
import Modal from '../components/Modal.jsx'
import Tag from '../components/Tag.jsx'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import ResourceGrid from '../components/ResourceGrid.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import EmptyState from '../components/EmptyState.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</dt>
      <dd className={`mt-1 text-sm text-ink ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}

const REPORT_TYPES = [
  'Broken URL',
  'Incorrect information',
  'Duplicate resource',
  'Wrong category',
  'Other',
]

export default function ResourcePage() {
  const { id } = useParams()
  const {
    favorites,
    toggleFavorite,
    collections,
    toggleInCollection,
    saveNote,
    getNote,
    touchResource,
    notify,
    addReport,
    submissions,
  } = useApp()

  const [noteText, setNoteText] = useState(getNote(id))
  const [prevNoteId, setPrevNoteId] = useState(id)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportType, setReportType] = useState('Broken URL')
  const [reportMessage, setReportMessage] = useState('')

  if (prevNoteId !== id) {
    setPrevNoteId(id)
    setNoteText(getNote(id))
  }

  const resource = useMemo(() => {
    const seeded = resources.find((r) => r.id === id)
    if (seeded) return { ...seeded, local: false }
    const local = submissions.find((s) => s.id === id)
    if (local) return { ...local, local: true }
    return null
  }, [id, submissions])

  useDocumentTitle(
    resource ? `${resource.name} · OpenTrace` : 'Resource not found · OpenTrace',
  )

  useEffect(() => {
    if (resource && !resource.local) {
      touchResource({ id: resource.id })
    }
  }, [resource, touchResource])

  const related = useMemo(() => {
    if (!resource) return []
    return resource.local
      ? resources.filter((r) => r.category === resource.category).slice(0, 4)
      : getRelated(resource)
  }, [resource])

  if (!resource) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShieldAlert}
          title="Resource not found"
          description="This resource does not exist in the directory. It may have been removed."
          action={
            <Link to="/explore" className="btn-primary">
              Back to explore
            </Link>
          }
        />
      </div>
    )
  }

  const category = getCategory(resource.category)
  const isFav = favorites.includes(resource.id)
  const saved = Boolean(getNote(resource.id))
  const note = getNote(resource.id)

  const toggleFav = () => {
    toggleFavorite(resource.id)
    notify(isFav ? 'Removed from favorites' : 'Added to favorites', 'success')
  }

  const toggleForCollection = (collectionId) => {
    const inCol = collections
      .find((c) => c.id === collectionId)
      ?.resourceIds.includes(resource.id)
    toggleInCollection(collectionId, resource.id)
    notify(inCol ? 'Removed from collection' : 'Added to collection', 'success')
  }

  const saveNoteAction = () => {
    saveNote(resource.id, noteText)
    notify(noteText.trim() ? 'Note saved' : 'Note cleared', 'success')
  }

  const submitReport = (e) => {
    e.preventDefault()
    addReport({
      resourceId: resource.id,
      resourceName: resource.name,
      type: reportType,
      message: reportMessage.trim(),
    })
    setReportOpen(false)
    setReportMessage('')
    notify('Report submitted locally', 'success')
  }

  return (
    <div className="mx-auto max-w-7xl animate-page-in px-4 py-10 sm:px-6">
      <Link
        to={category ? `/category/${category.id}` : '/explore'}
        className="mb-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Back to {category ? category.name : 'explore'}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {resource.name}
                  </h1>
                  {!resource.local && <VerifiedBadge verified={resource.verified} />}
                </div>
                <p className="mt-1 font-mono text-xs text-faint">{hostnameOf(resource.url)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFav}
                  className={`btn-ghost px-3 py-2 ${isFav ? 'border-accent/40 text-accent' : ''}`}
                >
                  <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Favorited' : 'Favorite'}
                </button>
                <button onClick={() => setPickerOpen(true)} className="btn-ghost px-3 py-2">
                  <FolderPlus size={15} /> Collection
                </button>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-sub">
              {resource.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              <Tag label={category ? category.name : resource.category} />
              <Tag label={subcategoryLabel(resource.category, resource.subcategory)} />
              {(resource.tags || []).map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={normalizeUrl(resource.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Open website <ExternalLink size={15} />
              </a>
              {resource.local && (
                <span className="chip border-amber-400/40 text-amber-400">
                  Locally submitted · not verified
                </span>
              )}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Personal note</h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Write a private note about this resource. Stored only in your browser."
              className="input-base resize-y"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="font-mono text-[11px] text-faint">
                {saved ? 'Saved earlier' : 'Not saved yet'}
              </p>
              <button onClick={saveNoteAction} className="btn-ghost px-3 py-1.5 text-[13px]">
                {saved ? <Save size={14} /> : <Save size={14} />} Save note
              </button>
            </div>
            {note?.updatedAt && (
              <p className="mt-2 font-mono text-[11px] text-faint">
                Updated {new Date(note.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="mb-4 text-sm font-semibold text-ink">Related resources</h2>
              <ResourceGrid resources={related} />
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="panel p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <BarChart3 size={14} className="text-accent-soft" /> Details
            </h2>
            <dl className="space-y-4">
              <Field label="Website" mono value={hostnameOf(resource.url)} />
              <Field label="Category" value={category ? category.name : resource.category} />
              <Field
                label="Subcategory"
                value={subcategoryLabel(resource.category, resource.subcategory)}
              />
              <Field label="Pricing" value={resource.pricing || 'Unknown'} />
              <Field label="Platform" value={resource.platform || 'Unknown'} />
              <Field label="Type" value={resource.type || 'resource'} />
              <Field
                label="Status"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    {resource.verified ? (
                      <>
                        <Check size={13} className="text-emerald-400" /> Verified
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={13} className="text-amber-400" /> Pending review
                      </>
                    )}
                  </span>
                }
              />
            </dl>

            <button
              onClick={() => setReportOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-accent-soft"
            >
              <ShieldAlert size={12} /> Report this resource
            </button>
          </div>

          {category && (
            <div className="panel p-5">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: `${category.tint}33`,
                    backgroundColor: `${category.tint}11`,
                    color: category.tint,
                  }}
                >
                  <CategoryIcon name={category.icon} size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{category.name}</p>
                  <p className="font-mono text-[11px] text-faint">
                    {category.subcategories.length} subcategories
                  </p>
                </div>
              </div>
              <Link to={`/category/${category.id}`} className="btn-ghost w-full">
                <Globe size={14} /> View category
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={`Add to collection — ${resource.name}`}
      >
        {collections.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No collections yet"
            description="Create a collection on the Collections page to start organizing."
            action={
              <Link
                to="/collections"
                className="btn-primary"
                onClick={() => setPickerOpen(false)}
              >
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
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      <Plus size={14} className={inCol ? 'text-accent' : 'text-faint'} />
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

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report this resource"
      >
        <form onSubmit={submitReport} className="space-y-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              Reason
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setReportType(t)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    reportType === t
                      ? 'border-accent/50 bg-accent/5 text-ink'
                      : 'border-line text-sub hover:border-line2'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              Additional details (optional)
            </p>
            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              rows={3}
              placeholder="Anything else we should know."
              className="input-base resize-y"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setReportOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}