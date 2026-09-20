import { Link } from 'react-router-dom'
import {
  Archive,
  Bookmark,
  Compass,
  FileText,
  FolderOpen,
  HardDrive,
  Map as MapIcon,
  Palette,
  Search,
  Shield,
  Smile,
  Star,
  Timer,
} from 'lucide-react'
import { categories } from '../data/categories.js'
import { resources } from '../data/resources/index.js'
import { LogoMark } from '../components/layout/TopNav.jsx'

const FEATURES = [
  {
    icon: MapIcon,
    title: 'Structured resource map',
    text: 'Explore categories expanded into subcategories, each holding hand-curated resources.',
  },
  {
    icon: Search,
    title: 'Instant search',
    text: 'Search across names, descriptions, categories, subcategories, and tags — or describe a task and let OpenTrace suggest the right fit.',
  },
  {
    icon: Star,
    title: 'Favorites',
    text: 'Star the resources you rely on and keep them one click away.',
  },
  {
    icon: FolderOpen,
    title: 'Collections',
    text: 'Group resources into personal collections like Frontend Development or Study Resources.',
  },
  {
    icon: Timer,
    title: 'Recently visited',
    text: 'OpenTrace remembers the resources you explore so you can always pick up where you left off.',
  },
  {
    icon: FileText,
    title: 'Personal notes',
    text: 'Keep private notes on any resource, stored entirely in your browser.',
  },
  {
    icon: Bookmark,
    title: 'Submit & report',
    text: 'Add resources to your directory and flag broken links or incorrect details.',
  },
  {
    icon: Palette,
    title: 'Dark & light themes',
    text: 'A serious, low-glare interface that works in either mode.',
  },
]

const PRIVACY = [
  { icon: HardDrive, title: 'Local-first', text: 'Everything — favorites, collections, notes, history, submissions, reports — is stored in your browser via localStorage. No account, no server.' },
  { icon: Shield, title: 'Privacy by design', text: 'Nothing leaves your device except the external websites you choose to open.' },
  { icon: Archive, title: 'Curated directory', text: 'The seeded directory is hand-checked. Resource claims describe what sites actually provide.' },
]

export default function AboutPage() {
  const subcategoryCount = categories.reduce((n, c) => n + c.subcategories.length, 0)

  return (
    <div className="mx-auto max-w-4xl animate-page-in px-4 py-12 sm:px-6">
      <section className="panel p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex w-fit items-center justify-center">
          <LogoMark size={44} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          A structured map of the useful web
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-sub sm:text-base">
          OpenTrace is a directory of useful websites, organized the way a map is organized —
          categories lead to subcategories, and subcategories lead to resources. Instead of
          hoarding bookmarks, explore a structured, searchable directory of the web's most
          useful places.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          <span className="flex items-center gap-1.5"><Compass size={12} /> {categories.length} categories</span>
          <span className="flex items-center gap-1.5"><FolderOpen size={12} /> {subcategoryCount} subcategories</span>
          <span className="flex items-center gap-1.5"><Smile size={12} /> {resources.length} resources</span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-lg font-semibold text-ink">What it does</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="panel p-5">
                <Icon size={18} className="text-accent-soft" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-lg font-semibold text-ink">Why it&apos;s different</h2>
        <p className="mb-4 text-sm leading-relaxed text-sub">
          OpenTrace is inspired by the discovery style of structured research directories:
          disciplined organization, focused scoping, and searchability. It is its own product
          with its own design — no gimmicks, no clutter, just a clear path from a question to
          the right website.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRIVACY.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="panel p-5">
                <Icon size={18} className="text-accent-soft" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-10 text-center">
        <h2 className="text-lg font-semibold text-ink">Start exploring</h2>
        <p className="max-w-md text-sm text-sub">
          Open the map, search for something specific, or describe the task you need done.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            Open the map
          </Link>
          <Link to="/explore" className="btn-ghost">
            Explore resources
          </Link>
        </div>
      </section>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-faint">
        OpenTrace · Find the right website for anything.
      </p>
    </div>
  )
}