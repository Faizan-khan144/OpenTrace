import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resources } from '../src/data/resources/index.js'
import { searchResources, tokenize } from '../src/utils/search.js'

test('tokenize strips stopwords and noise', () => {
  assert.deepEqual(tokenize('I need a website to compress images'), [
    'compress',
    'images',
  ])
  assert.equal(tokenize('').length, 0)
})

test('empty query returns the full catalog', () => {
  assert.equal(searchResources(resources, '').length, resources.length)
  assert.equal(searchResources(resources, '   ').length, resources.length)
})

test('search matches resource names', () => {
  const byName = searchResources(resources, 'GitHub')
  assert.ok(byName.some((r) => r.id === 'github'))
  assert.deepEqual(byName[0].id, 'github')
})

test('search matches tags', () => {
  const byTag = searchResources(resources, 'malware')
  assert.ok(byTag.some((r) => r.id === 'virustotal'))
})

test('search matches categories', () => {
  const byCat = searchResources(resources, 'design')
  assert.ok(byCat.some((r) => r.id === 'figma'))
})

test('name matches rank above tag and description matches', () => {
  const results = searchResources(resources, 'crypto')
  const ranked = results.map((r) => r._score)
  for (let i = 1; i < ranked.length; i += 1) {
    assert.ok(ranked[i] <= ranked[i - 1], 'results are not ranked by score')
  }
})

test('partial prefix matching on tags works', () => {
  const results = searchResources(resources, 'pdf')
  assert.ok(
    results.some((r) => ['ilovepdf', 'smallpdf'].includes(r.id)),
    'expected a pdf tool in results',
  )
})