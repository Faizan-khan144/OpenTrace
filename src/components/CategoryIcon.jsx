import {
  Briefcase,
  CheckSquare,
  Clapperboard,
  Code2,
  Database,
  FileText,
  GitFork,
  Globe,
  GraduationCap,
  Handshake,
  Megaphone,
  MessagesSquare,
  Palette,
  PenLine,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  UserRound,
  Wrench,
} from 'lucide-react'

const ICONS = {
  Briefcase,
  CheckSquare,
  Clapperboard,
  Code2,
  Database,
  FileText,
  GitFork,
  Globe,
  GraduationCap,
  Handshake,
  Megaphone,
  MessagesSquare,
  Palette,
  PenLine,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  UserRound,
  Wrench,
}

export default function CategoryIcon({ name, size = 18, className, strokeWidth = 1.75 }) {
  const Icon = ICONS[name] || Globe
  return <Icon size={size} className={className} strokeWidth={strokeWidth} />
}