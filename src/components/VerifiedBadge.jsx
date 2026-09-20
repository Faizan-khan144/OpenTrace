import { BadgeCheck } from 'lucide-react'

export default function VerifiedBadge({ verified = true, muted = false }) {
  if (!verified) return null
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${
        muted ? 'text-faint' : 'text-accent-soft'
      }`}
      title="Verified resource"
    >
      <BadgeCheck size={12} />
      Verified
    </span>
  )
}