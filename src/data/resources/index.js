import development from './development.js'
import ai from './ai.js'
import design from './design.js'
import education from './education.js'
import productivity from './productivity.js'
import writing from './writing.js'
import media from './media.js'
import business from './business.js'
import finance from './finance.js'
import security from './security.js'
import research from './research.js'
import utilities from './utilities.js'
import search from './search.js'
import marketing from './marketing.js'
import socialMedia from './social-media.js'
import communication from './communication.js'
import data from './data.js'
import career from './career.js'
import freelancing from './freelancing.js'
import openSource from './open-source.js'
import documentation from './documentation.js'

export const resources = [
  ...development,
  ...ai,
  ...design,
  ...education,
  ...productivity,
  ...writing,
  ...media,
  ...business,
  ...finance,
  ...security,
  ...research,
  ...utilities,
  ...search,
  ...marketing,
  ...socialMedia,
  ...communication,
  ...data,
  ...career,
  ...freelancing,
  ...openSource,
  ...documentation,
]

export const resourceById = Object.fromEntries(resources.map((r) => [r.id, r]))

export function getResource(id) {
  return resourceById[id] || null
}

export function getByCategory(categoryId) {
  return resources.filter((r) => r.category === categoryId)
}

export function getBySubcategory(categoryId, subcategoryId) {
  return resources.filter(
    (r) => r.category === categoryId && r.subcategory === subcategoryId,
  )
}

export function getFeatured() {
  return resources.filter((r) => r.featured)
}

export function getRelated(resource, limit = 4) {
  const sameSub = resources.filter(
    (r) =>
      r.id !== resource.id &&
      r.category === resource.category &&
      r.subcategory === resource.subcategory,
  )
  const sameCat = resources.filter(
    (r) => r.id !== resource.id && r.category === resource.category,
  )
  const union = [...sameSub, ...sameCat.filter((r) => !sameSub.includes(r))]
  return union.slice(0, limit)
}