import { Link } from 'react-router-dom'
import { categories } from '../../data/categories.js'
import { LogoMark } from './TopNav.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={24} />
              <span className="text-[15px] font-semibold text-ink">OpenTrace</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-sub">
              A structured map of useful websites and resources across the web.
              Find the right website for anything.
            </p>
            <p className="mt-4 font-mono text-[11px] text-faint">
              {categories.reduce((n, c) => n + c.subcategories.length, 0)} subcategories ·
              continuously expanding
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-sub transition-colors hover:text-ink" to="/explore">Explore all resources</Link></li>
              <li><Link className="text-sub transition-colors hover:text-ink" to="/favorites">Favorites</Link></li>
              <li><Link className="text-sub transition-colors hover:text-ink" to="/collections">Collections</Link></li>
              <li><Link className="text-sub transition-colors hover:text-ink" to="/recent">Recently visited</Link></li>
              <li><Link className="text-sub transition-colors hover:text-ink" to="/submit">Submit a resource</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
              Top categories
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link
                    className="text-sub transition-colors hover:text-ink"
                    to={`/category/${c.id}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="text-[13px] text-faint">
            © {new Date().getFullYear()} OpenTrace. All resources link to their respective websites.
          </p>
          <Link to="/about" className="font-mono text-[11px] uppercase tracking-wider text-sub transition-colors hover:text-ink">
            About OpenTrace →
          </Link>
        </div>
      </div>
    </footer>
  )
}