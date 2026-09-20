import { MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function NotFoundPage() {
  useDocumentTitle('Page not found · OpenTrace')
  return (
    <div className="mx-auto flex max-w-3xl animate-page-in flex-col items-center px-4 py-24 text-center sm:px-6">
      <MapPinned size={40} className="text-accent-soft" strokeWidth={1.25} />
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-faint">
        404 · Off the map
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        This page does not exist
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-sub">
        The page you are looking for is not in the OpenTrace directory. It may have moved
        or never existed.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to the map
        </Link>
        <Link to="/explore" className="btn-ghost">
          Explore resources
        </Link>
      </div>
    </div>
  )
}