import { useState } from 'react'
import { GitBranch, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'
import { resources } from '../data/resources/index.js'
import ResourceGrid from '../components/ResourceGrid.jsx'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Modal from '../components/Modal.jsx'

export default function CollectionsPage() {
  const {
    collections,
    createCollection,
    deleteCollection,
    toggleInCollection,
    notify,
  } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [expanded, setExpanded] = useState('')

  const create = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const created = createCollection(name.trim(), description.trim())
    setName('')
    setDescription('')
    setCreateOpen(false)
    setExpanded(created.id)
    notify('Collection created', 'success')
  }

  return (
    <div className="mx-auto max-w-7xl animate-page-in px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Organize"
        title="Collections"
        description="Group resources into personal collections that persist in your browser."
        actions={
          <button onClick={() => setCreateOpen(true)} className="btn-primary">
            New collection
          </button>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="No collections yet"
          description="Create collections like Frontend Development, Study Resources, or Useful Websites."
          action={
            <button onClick={() => setCreateOpen(true)} className="btn-primary">
              Create your first collection
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => {
            const items = collection.resourceIds
              .map((rid) => resources.find((r) => r.id === rid))
              .filter(Boolean)
            const open = expanded === collection.id
            return (
              <div key={collection.id} className="panel overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <button
                    onClick={() => setExpanded(open ? '' : collection.id)}
                    className="min-w-0 flex-1 text-left"
                    aria-expanded={open}
                  >
                    <h2 className="truncate text-[15px] font-semibold text-ink">
                      {collection.name}
                    </h2>
                    <p className="mt-0.5 font-mono text-[11px] text-faint">
                      {items.length} resource{items.length === 1 ? '' : 's'}
                      {collection.description || ' · No description'}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => setExpanded(open ? '' : collection.id)} className="btn-ghost px-3 py-1.5 text-[13px]">
                      {open ? 'Collapse' : 'Open'}
                    </button>
                    <button
                      onClick={() => {
                        deleteCollection(collection.id)
                        notify('Collection deleted')
                      }}
                      aria-label="Delete collection"
                      className="rounded-lg p-2 text-faint transition-colors hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {open && (
                  <div className="animate-fade-in border-t border-line bg-surface2/40 p-5">
                    {items.length === 0 ? (
                      <p className="text-sm text-sub">
                        No resources yet. Add some from any resource's "Collection" button.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {items.map((resource) => (
                          <div key={resource.id} className="panel flex flex-col gap-2 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-ink">
                                  {resource.name}
                                </h3>
                                <p className="truncate font-mono text-[11px] text-faint">
                                  {resource.category}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  toggleInCollection(collection.id, resource.id)
                                  notify('Removed from collection')
                                }}
                                aria-label="Remove from collection"
                                className="rounded p-1 text-faint transition-colors hover:text-red-400"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] font-medium text-accent-soft hover:text-accent"
                              >
                                Open website →
                              </a>
                              <Link
                                to={`/resource/${resource.id}`}
                                className="font-mono text-[11px] text-faint hover:text-ink"
                              >
                                details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New collection">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label htmlFor="col-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              Name
            </label>
            <input
              id="col-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Development"
              className="input-base"
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="col-desc" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              Description (optional)
            </label>
            <input
              id="col-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about this collection"
              className="input-base"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}