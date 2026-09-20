import { getCategory, subcategoryLabel } from '../data/categories.js'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'for', 'and', 'or', 'to', 'of', 'on', 'in', 'at', 'by',
  'with', 'i', 'need', 'want', 'my', 'is', 'are', 'we', 'you', 'that', 'this',
  'it', 'me', 'help', 'find', 'looking', 'something', 'website', 'site', 'which',
  'can', 'could', 'should', 'does', 'do', 'there', 'be', 'then', 'them', 'have',
  'has', 'some', 'any', 'about', 'from', 'use', 'using', 'used', 'make', 'makes',
  'get', 'got', 'best', 'good', 'great', 'please', 'know', 'show', 'see', 'how',
  'what', 'where', 'when', 'who', 'why', 'as', 'so', 'if', 'was', 'were',
])

const MAX_RESULTS = 0

export function tokenize(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s#.+-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

function buildBlob(resource) {
  const category = getCategory(resource.category)
  const sub = subcategoryLabel(resource.category, resource.subcategory)
  return {
    name: resource.name.toLowerCase(),
    description: resource.description.toLowerCase(),
    tags: resource.tags.map((t) => t.toLowerCase()),
    category: (category ? category.name : resource.category).toLowerCase(),
    subcategory: sub.toLowerCase(),
    type: resource.type.toLowerCase(),
    pricing: resource.pricing.toLowerCase(),
  }
}

function scoreResource(resource, terms) {
  const blob = buildBlob(resource)
  let score = 0
  for (const term of terms) {
    if (blob.name === term) score += 14
    else if (blob.name.includes(term)) score += 9
    if (blob.tags.some((t) => t === term)) score += 8
    else if (blob.tags.some((t) => t.startsWith(term))) score += 5
    if (blob.category === term || blob.category.includes(term)) score += 6
    if (blob.subcategory === term || blob.subcategory.includes(term)) score += 5
    if (blob.description.includes(term)) score += 2
    if (blob.type === term) score += 1
    if (blob.pricing.includes(term)) score += 1
  }
  return score
}

export function searchResources(resources, query) {
  const terms = tokenize(query)
  if (terms.length === 0) return resources

  const scored = resources
    .map((resource) => ({ resource, score: scoreResource(resource, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  return MAX_RESULTS > 0 ? scored.slice(0, MAX_RESULTS) : scored
    .map((entry) => ({ ...entry.resource, _score: entry.score }))
}

export function hasActiveQuery(query) {
  return tokenize(query).length > 0
}