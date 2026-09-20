import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resources } from '../src/data/resources/index.js'
import { taskSearchResources } from '../src/utils/taskSearch.js'

test('empty or trivial queries return nothing', () => {
  assert.deepEqual(taskSearchResources(resources, ''), [])
  assert.deepEqual(taskSearchResources(resources, 'i need a'), [])
})

test('image compression task surfaces image tools', () => {
  const ids = taskSearchResources(resources, 'I need a website to compress images').map(
    (r) => r.id,
  )
  assert.ok(ids.includes('tinypng'), `expected tinypng, got: ${ids.join(', ')}`)
  assert.ok(ids.includes('squoosh'), `expected squoosh, got: ${ids.join(', ')}`)
})

test('learning to code task surfaces coding platforms', () => {
  const ids = taskSearchResources(resources, 'best website to learn coding').map(
    (r) => r.id,
  )
  assert.ok(
    ids.includes('freecodecamp') || ids.includes('codecademy'),
    `expected a coding course, got: ${ids.join(', ')}`,
  )
})

test('translate task surfaces translation tools', () => {
  const ids = taskSearchResources(resources, 'translate a document to english').map(
    (r) => r.id,
  )
  assert.ok(
    ids.includes('google-translate') || ids.includes('deepl'),
    `expected a translator, got: ${ids.join(', ')}`,
  )
})

test('results are ranked by descending score', () => {
  const results = taskSearchResources(resources, 'host a website for free')
  const scores = results.map((r) => r._score)
  for (let i = 1; i < scores.length; i += 1) {
    assert.ok(scores[i] <= scores[i - 1], 'scores must be non-increasing')
  }
  assert.ok(results.length > 0)
})