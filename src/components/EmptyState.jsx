export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line2 bg-surface/40 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface2 text-faint">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-sub">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}