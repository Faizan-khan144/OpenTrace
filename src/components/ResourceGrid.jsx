import ResourceCard from './ResourceCard.jsx'
import EmptyState from './EmptyState.jsx'
import { SearchX } from 'lucide-react'

export default function ResourceGrid({ resources, emptyTitle = 'No resources found', emptyDescription = 'Try adjusting your search or filters.' }) {
  if (resources.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource, index) => (
        <ResourceCard key={resource.id} resource={resource} index={index} />
      ))}
    </div>
  )
}