import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  readStorage,
  writeStorage,
  removeStorage,
  storageKey,
} from '../src/utils/storage.js'

function memoryStore() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  }
}

beforeEach(() => {
  globalThis.localStorage = memoryStore()
})

test('writeStorage and readStorage round-trip values', () => {
  writeStorage('favorites', ['a', 'b'])
  assert.deepEqual(readStorage('favorites', []), ['a', 'b'])
})

test('readStorage returns fallback for missing keys', () => {
  assert.deepEqual(readStorage('missing', { n: 1 }), { n: 1 })
})

test('removeStorage deletes the key', () => {
  writeStorage('notes', { x: 1 })
  removeStorage('notes')
  assert.deepEqual(readStorage('notes', null), null)
})

test('storageKey prefixes with the app namespace', () => {
  assert.equal(storageKey('theme'), 'opentrace:theme')
})

test('corrupt json falls back safely', () => {
  localStorage.setItem('opentrace:theme', '{bad json')
  assert.equal(readStorage('theme', 'dark'), 'dark')
})