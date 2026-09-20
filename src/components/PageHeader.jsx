export default function PageHeader({ eyebrow, title, description, actions, icon }) {
  return (
    <div className="mb-8 animate-page-in">
      {eyebrow && (
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent-soft">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {icon}
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sub sm:text-base">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}