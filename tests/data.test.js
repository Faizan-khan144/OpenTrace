import { test } from 'node:test'
import assert from 'node:assert/strict'
import { categories } from '../src/data/categories.js'
import {
  resources,
  getResource,
  getByCategory,
  getBySubcategory,
  getFeatured,
  getRelated,
} from '../src/data/resources/index.js'

const PRICING = new Set(['Free', 'Free tier', 'Freemium', 'Paid'])
const TYPES = new Set(['tool', 'platform', 'service', 'resource', 'community'])
const PLATFORMS = new Set(['Web', 'Mobile', 'Desktop', 'Browser extension'])

test('directory has a substantial catalog', () => {
  assert.ok(resources.length >= 180, `expected >= 180 resources, got ${resources.length}`)
  assert.equal(categories.length, 21)
})

test('every resource id is unique', () => {
  const ids = resources.map((r) => r.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)))
})

test('every resource belongs to a valid category', () => {
  const catIds = new Set(categories.map((c) => c.id))
  for (const r of resources) {
    assert.ok(catIds.has(r.category), `invalid category ${r.category} for ${r.id}`)
  }
})

test('every resource belongs to a valid subcategory of its category', () => {
  for (const r of resources) {
    const category = categories.find((c) => c.id === r.category)
    const subIds = category.subcategories.map((s) => s.id)
    assert.ok(
      subIds.includes(r.subcategory),
      `invalid subcategory ${r.subcategory} in ${r.category} for ${r.id}`,
    )
  }
})

test('every resource url is http(s)', () => {
  for (const r of resources) {
    assert.match(r.url, /^https?:\/\//, `bad url for ${r.id}: ${r.url}`)
  }
})

test('controlled vocabulary fields are valid', () => {
  for (const r of resources) {
    assert.ok(PRICING.has(r.pricing), `bad pricing for ${r.id}: ${r.pricing}`)
    assert.ok(TYPES.has(r.type), `bad type for ${r.id}: ${r.type}`)
    assert.ok(PLATFORMS.has(r.platform), `bad platform for ${r.id}: ${r.platform}`)
    assert.ok(Array.isArray(r.tags) && r.tags.length >= 1, `missing tags for ${r.id}`)
  }
})

test('featured resources are also verified', () => {
  for (const r of resources) {
    if (r.featured) {
      assert.equal(r.verified, true, `featured ${r.id} must be verified`)
    }
  }
})

test('lookup helpers behave', () => {
  assert.equal(getResource('github').name, 'GitHub')
  assert.equal(getResource('nope'), null)
  assert.ok(getByCategory('development').length > 10)
  assert.ok(getBySubcategory('development', 'code-hosting').length >= 3)
  assert.ok(getFeatured().every((r) => r.featured))
  const github = getResource('github')
  const related = getRelated(github, 2)
  assert.ok(related.length <= 2)
  assert.ok(related.every((r) => r.id !== 'github'))
})