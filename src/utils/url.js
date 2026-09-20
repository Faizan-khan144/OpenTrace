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
  const value = (raw || '').trim()
  if (!value) return false
  try {
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value) && !/^https?:\/\//i.test(value)) {
      return false
    }
    const url = new URL(normalizeUrl(value))
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}