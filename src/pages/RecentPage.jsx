import { History, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resources } from '../data/resources/index.js'
import { useApp } from '../hooks/useApp.js'
import ResourceGrid from '../components/ResourceGrid.jsx'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function RecentPage() {
  const { recent, clearRecent, notify } = useApp()

  const recentResources = recent
    .map((entry) => {
      const resource = resources.find((r) => r.id === entry.resourceId)
      return resource ? { ...resource, _visitedAt: entry.visitedAt } : null
    })
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl animate-page-in px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="History"
        title="Recently visited"
        description="Resources you have opened recently, tracked locally in your browser."
        actions={
          recentResources.length > 0 ? (
            <button
              onClick={() => {
                clearRecent()
                notify('Recent history cleared')
              }}
              className="btn-ghost"
            >
              <Trash2 size={14} /> Clear history
            </button>
          ) : null
        }
      />

      {recentResources.length > 0 && (
        <div className="mb-4 space-y-2">
          {recentResources.map((entry) => (
            <div key={entry.id} className="panel flex items-center gap-3 px-4 py-2.5">
              <History size={14} className="shrink-0 text-faint" />
              <span className="font-mono text-[11px] text-faint">
                {new Date(entry._visitedAt).toLocaleString()}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="truncate text-sm text-ink">{entry.name}</span>
                <Link
                  to={`/resource/${entry.id}`}
                  className="font-mono text-[11px] uppercase tracking-wider text-accent-soft hover:text-accent"
                >
                  open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ResourceGrid
        resources={recentResources.map(({ _visitedAt, ...r }) => r)}
        emptyTitle="Nothing visited yet"
        emptyDescription="Open any resource in the map and it will show up here."
      />
    </div>
  )
}