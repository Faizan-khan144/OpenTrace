import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeUrl, hostnameOf, isValidHttpUrl } from '../src/utils/url.js'

test('normalizeUrl adds https when missing', () => {
  assert.equal(normalizeUrl('example.com'), 'https://example.com')
  assert.equal(normalizeUrl('http://example.com'), 'http://example.com')
  assert.equal(normalizeUrl('  example.com  '), 'https://example.com')
  assert.equal(normalizeUrl(''), '')
})

test('hostnameOf strips protocol and www', () => {
  assert.equal(hostnameOf('https://www.github.com'), 'github.com')
  assert.equal(hostnameOf('https://developer.mozilla.org'), 'developer.mozilla.org')
  assert.equal(hostnameOf('not a url'), '')
})

test('isValidHttpUrl only accepts http(s)', () => {
  assert.equal(isValidHttpUrl('https://example.com'), true)
  assert.equal(isValidHttpUrl('http://example.com'), true)
  assert.equal(isValidHttpUrl('ftp://example.com'), false)
  assert.equal(isValidHttpUrl('example.com'), true)
  assert.equal(isValidHttpUrl(''), false)
})