import { tokenize } from './search.js'

const INTENT_MAP = {
  compress: ['compress', 'compression', 'shrink', 'optimize', 'optimization'],
  images: ['image', 'images', 'photo', 'photos', 'picture', 'jpg', 'png', 'webp'],
  convert: ['convert', 'conversion', 'transformer', 'transform'],
  pdf: ['pdf', 'document', 'documents', 'merge', 'split'],
  video: ['video', 'videos', 'edit', 'editing', 'clip'],
  audio: ['audio', 'music', 'sound', 'podcast', 'voice'],
  translate: ['translate', 'translation', 'language', 'languages'],
  code: ['code', 'coding', 'program', 'programming', 'develop'],
  api: ['api', 'apis', 'rest', 'backend', 'endpoint'],
  host: ['host', 'hosting', 'deploy', 'deployment'],
  learn: ['learn', 'learning', 'course', 'courses', 'tutorial', 'tutorials', 'study'],
  write: ['write', 'writing', 'write', 'grammar', 'proofread'],
  design: ['design', 'ui', 'ux', 'figma', 'mockup', 'wireframe'],
  icons: ['icon', 'icons'],
  fonts: ['font', 'fonts', 'typography'],
  colors: ['color', 'colors', 'palette', 'palette'],
  stock: ['stock', 'royalty', 'royalty-free', 'license-free'],
  job: ['job', 'jobs', 'hiring', 'career', 'freelance', 'freelancing'],
  remote: ['remote', 'work from home'],
  salary: ['salary', 'salaries', 'compensation', 'pay'],
  interview: ['interview', 'interviews', 'questions'],
  research: ['research', 'paper', 'papers', 'academic', 'scholar', 'journal'],
  archive: ['archive', 'archives', 'wayback', 'history'],
  security: ['security', 'cyber', 'hack', 'hacking', 'vulnerability', 'ctf', 'malware'],
  crypto: ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'coin'],
  finance: ['finance', 'bank', 'banking', 'budget', 'budgeting', 'invest', 'stocks', 'trade'],
  tracker: ['track', 'tracking', 'time'],
  email: ['email', 'mail', 'newsletter', 'newsletters'],
  marketing: ['marketing', 'seo', 'growth'],
  analytics: ['analytics', 'metric', 'metrics', 'statistics', 'stats'],
}

const TAG_SYNONYMS = {
  optimization: ['optimize', 'compress', 'compression', 'minify'],
  compression: ['compress', 'compress', 'optimize', 'shrink'],
  'image editing': ['photo', 'photoshop', 'edit photos'],
  editor: ['edit', 'editing'],
  download: ['download', 'downloads'],
  tutorial: ['learn', 'course', 'guide'],
}

function resolveIntents(terms) {
  const intents = new Set()
  for (const term of terms) {
    for (const [intent, keywords] of Object.entries(INTENT_MAP)) {
      if (keywords.includes(term) || keywords.some((k) => term.startsWith(k))) {
        intents.add(intent)
      }
    }
  }
  return intents
}

function expandTerm(term) {
  const expanded = [term]
  for (const synonyms of Object.values(TAG_SYNONYMS)) {
    if (synonyms.includes(term)) {
      expanded.push(...synonyms)
    }
  }
  return expanded
}

export function taskSearchResources(resources, query) {
  const terms = tokenize(query)
  if (terms.length === 0) return []

  const intents = resolveIntents(terms)
  const expandedTerms = terms.flatMap(expandTerm)

  const scored = resources.map((resource) => {
    const haystack = [
      resource.name,
      resource.description,
      resource.category,
      resource.subcategory,
      ...resource.tags,
    ]
      .join(' ')
      .toLowerCase()

    let score = 0
    for (const term of expandedTerms) {
      if (haystack.includes(term)) score += 2
    }
    for (const term of terms) {
      if (resource.name.toLowerCase().includes(term)) score += 4
      if (resource.tags.some((t) => t.includes(term))) score += 3
      if (resource.description.toLowerCase().includes(term)) score += 1
    }
    if (intents.size > 0) {
      score += intents.size * 0.5
    }
    return { resource, score }
  })

  return scored
    .filter((entry) => entry.score >= 4)
    .sort((a, b) => b.score - a.score)
    .map((entry) => ({ ...entry.resource, _score: Math.round(entry.score * 10) / 10 }))
}