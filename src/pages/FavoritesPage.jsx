import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resources } from '../data/resources/index.js'
import { useApp } from '../hooks/useApp.js'
import ResourceGrid from '../components/ResourceGrid.jsx'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function FavoritesPage() {
  const { favorites } = useApp()
  useDocumentTitle('Favorites · OpenTrace')
  const favoriteResources = favorites
    .map((id) => resources.find((r) => r.id === id))
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl animate-page-in px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Saved"
        title="Favorites"
        description="Resources you have starred. Stored privately in your browser."
        actions={
          <span className="chip">
            <Star size={11} className="text-accent-soft" /> {favoriteResources.length}
          </span>
        }
      />
      <ResourceGrid
        resources={favoriteResources}
        emptyTitle="No favorites yet"
        emptyDescription={
          <>
            Tap the star on any resource card to save it here.
          </>
        }
      />
      {favoriteResources.length === 0 && (
        <div className="mt-4">
          <Link to="/explore" className="btn-primary">
            Find resources to favorite
          </Link>
        </div>
      )}
    </div>
  )
}