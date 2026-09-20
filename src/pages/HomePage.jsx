import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  Compass,
  FolderOpen,
  Layers,
  Timer,
} from 'lucide-react'
import { categories } from '../data/categories.js'
import { getFeatured, resources } from '../data/resources/index.js'
import SearchBar from '../components/SearchBar.jsx'
import ResourceGrid from '../components/ResourceGrid.jsx'
import ResourceMap from '../components/ResourceMap.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import { useApp } from '../hooks/useApp.js'

function PopularResources({ limit = 6 }) {
  const { favorites, recent } = useApp()

  const ranked = resources
    .map((resource) => {
      const favScore = favorites.includes(resource.id) ? 10 : 0
      const recentScore = recent.some((r) => r.resourceId === resource.id) ? 6 : 0
      const featuredScore = resource.featured ? 4 : 0
      return { resource, score: favScore + recentScore + featuredScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.resource)

  return (
    <ResourceGrid
      resources={ranked}
      emptyTitle="Nothing here yet"
      emptyDescription="Visit a few resources to see the most popular picks here."
    />
  )
}

export default function HomePage() {
  const { submissions, recent } = useApp()
  const featured = getFeatured().slice(0, 6)
  const latest = resources.slice(-6).reverse()
  const subcategoryCount = categories.reduce((n, c) => n + c.subcategories.length, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="animate-page-in border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent-soft">
            OpenTrace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Find the right website
            <span className="text-sub"> for anything.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sub sm:text-base">
            A structured map of useful websites and resources across the web —
            organized into categories, subcategories, and instantly searchable entries.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="large" />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-faint">
            <span className="flex items-center gap-1.5"><Layers size={12} /> {categories.length} categories</span>
            <span className="flex items-center gap-1.5"><FolderOpen size={12} /> {subcategoryCount} subcategories</span>
            <span className="flex items-center gap-1.5"><Compass size={12} /> {resources.length} resources</span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">Featured resources</h2>
          <Link to="/explore" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-accent-soft hover:text-accent">
            Explore all <ArrowRight size={13} />
          </Link>
        </div>
        <ResourceGrid resources={featured} />
      </section>

      <section className="py-10 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">Popular now</h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-wider text-faint sm:block">
            Ranked by your visits and favorites
          </p>
        </div>
        <PopularResources />
      </section>

      {recent.length > 0 && (
        <section className="py-10 sm:py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-ink sm:text-xl">
              <Timer size={18} className="text-accent-soft" /> Continue where you left off
            </h2>
            <Link to="/recent" className="font-mono text-[11px] uppercase tracking-wider text-accent-soft hover:text-accent">
              View all →
            </Link>
          </div>
          <ResourceGrid
            resources={recent
              .slice(0, 6)
              .map((entry) => resources.find((r) => r.id === entry.resourceId))
              .filter(Boolean)}
          />
        </section>
      )}

      {submissions.length > 0 && (
        <section className="py-10 sm:py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-ink sm:text-xl">
              <Bookmark size={18} className="text-accent-soft" /> Your submissions
            </h2>
            <Link to="/submit" className="font-mono text-[11px] uppercase tracking-wider text-accent-soft hover:text-accent">
              Manage →
            </Link>
          </div>
          <ResourceGrid
            resources={submissions.slice(0, 6).map((s) => ({
              id: s.id,
              name: s.name,
              url: s.url,
              description: s.description,
              category: s.category,
              subcategory: s.subcategory,
              tags: s.tags,
              pricing: 'Local',
              platform: 'Pending review',
              type: 'resource',
              featured: false,
              verified: false,
            }))}
            emptyTitle="No submissions"
          />
        </section>
      )}

      {latest.length > 0 && (
        <section className="py-10 sm:py-12">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink sm:text-xl">Latest in the directory</h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
              The most recent entries added to the map
            </p>
          </div>
          <ResourceGrid resources={latest} />
        </section>
      )}

      <section className="py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">Browse the map</h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-wider text-faint sm:block">
            Categories → subcategories → resources
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group panel flex items-center gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line2"
              style={{ animationDelay: `${category.id.length}ms` }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `${category.tint}33`,
                  backgroundColor: `${category.tint}11`,
                  color: category.tint,
                }}
              >
                <CategoryIcon name={category.icon} size={17} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink">
                  {category.name}
                </span>
                <span className="block font-mono text-[11px] text-faint">
                  {category.subcategories.length} subcategories
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">Interactive map</h2>
          <p className="mt-1 max-w-xl text-sm text-sub">
            Expand a category to drill into its subcategories and resources. Tap any entry to open its details.
          </p>
        </div>
        <ResourceMap />
      </section>

      <section className="py-12">
        <div className="panel flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-14">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">
            Know a great website that belongs here?
          </h2>
          <p className="max-w-md text-sm text-sub">
            Submit it to your personal directory so you always have it one search away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/submit" className="btn-primary">
              Submit a resource <ArrowRight size={15} />
            </Link>
            <Link to="/explore" className="btn-ghost">
              Start exploring
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}