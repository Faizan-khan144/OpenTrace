export function normalizeUrl(raw) {
  if (!raw) return ''
  let value = raw.trim()
  if (!/^https?:\/\//i.test(value)) {
    value = 'https://' + value
  }
  return value
}

export function hostnameOf(url) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function isValidHttpUrl(raw) {
  try {
    const url = new URL(normalizeUrl(raw))
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}