export const PRICING_OPTIONS = ['Free', 'Free tier', 'Freemium', 'Paid']

export const TYPE_OPTIONS = ['tool', 'platform', 'service', 'resource', 'community']

export function appliesFilters(resource, filters) {
  if (filters.category && resource.category !== filters.category) return false
  if (filters.subcategory && resource.subcategory !== filters.subcategory) return false
  if (filters.pricing && !filters.pricing.includes(resource.pricing)) return false
  if (filters.platform && !filters.platform.includes(resource.platform)) return false
  if (filters.type && !filters.type.includes(resource.type)) return false
  if (filters.verified && !resource.verified) return false
  if (filters.featured && !resource.featured) return false
  return true
}

export function applyFilters(resources, filters) {
  return resources.filter((r) => appliesFilters(r, filters))
}

export function filtersActive(filters) {
  return Boolean(
    filters.category ||
      filters.subcategory ||
      (filters.pricing && filters.pricing.length) ||
      (filters.platform && filters.platform.length) ||
      (filters.type && filters.type.length) ||
      filters.verified ||
      filters.featured,
  )
}