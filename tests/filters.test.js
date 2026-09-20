import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyFilters, appliesFilters, filtersActive } from '../src/utils/filters.js'

const sample = [
  { id: 'a', category: 'development', subcategory: 'code-hosting', pricing: 'Free', platform: 'Web', type: 'platform', verified: true, featured: true },
  { id: 'b', category: 'design', subcategory: 'ui-design', pricing: 'Freemium', platform: 'Web', type: 'tool', verified: true, featured: false },
  { id: 'c', category: 'development', subcategory: 'apis', pricing: 'Paid', platform: 'Desktop', type: 'tool', verified: false, featured: false },
]

const EMPTY = {
  category: '',
  subcategory: '',
  pricing: [],
  platform: [],
  type: [],
  verified: false,
  featured: false,
}

test('empty filters pass everything', () => {
  assert.equal(applyFilters(sample, EMPTY).length, 3)
  assert.equal(filtersActive(EMPTY), false)
})

test('category filter narrows results', () => {
  const result = applyFilters(sample, { ...EMPTY, category: 'development' })
  assert.deepEqual(result.map((r) => r.id), ['a', 'c'])
})

test('category plus subcategory filter', () => {
  const result = applyFilters(sample, {
    ...EMPTY,
    category: 'development',
    subcategory: 'apis',
  })
  assert.deepEqual(result.map((r) => r.id), ['c'])
})

test('multi-value lists act as OR within a filter', () => {
  const result = applyFilters(sample, { ...EMPTY, pricing: ['Free', 'Paid'] })
  assert.deepEqual(result.map((r) => r.id), ['a', 'c'])
})

test('verified boolean filter', () => {
  const result = applyFilters(sample, { ...EMPTY, verified: true })
  assert.deepEqual(result.map((r) => r.id), ['a', 'b'])
})

test('combined filters intersect', () => {
  const result = applyFilters(sample, {
    ...EMPTY,
    platform: ['Web'],
    type: ['tool'],
    verified: true,
  })
  assert.deepEqual(result.map((r) => r.id), ['b'])
})

test('filtersActive detects any active filter', () => {
  assert.equal(filtersActive({ ...EMPTY, pricing: ['Free'] }), true)
  assert.equal(filtersActive({ ...EMPTY, verified: true }), true)
  assert.equal(filtersActive(EMPTY), false)
})

test('appliesFilters matches appliesFilters semantics', () => {
  assert.equal(appliesFilters(sample[0], EMPTY), true)
  assert.equal(appliesFilters(sample[0], { ...EMPTY, category: 'design' }), false)
})