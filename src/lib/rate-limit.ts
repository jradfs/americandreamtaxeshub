import { AUTH_ERRORS, RATE_LIMITS } from './constants'

type RateLimitRecord = {
  count: number
  resetTime: number
}

export class RateLimitError extends Error {
  constructor(retryAfter: number) {
    super(AUTH_ERRORS.RATE_LIMITED)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
  retryAfter: number
}

// Use Map instead of LRUCache for Edge Runtime compatibility
const tokenCache = new Map<string, RateLimitRecord>()

// Cleanup function to remove expired entries
const cleanup = () => {
  const now = Date.now()
  for (const [key, record] of tokenCache.entries()) {
    if (now >= record.resetTime) {
      tokenCache.delete(key)
    }
  }
}

export const rateLimit = {
  check: async (limit: number, token: string) => {
    cleanup()
    const now = Date.now()
    const record = tokenCache.get(token)

    if (!record) {
      tokenCache.set(token, {
        count: 1,
        resetTime: now + RATE_LIMITS.API.DEFAULT.interval
      })
      return
    }

    if (now >= record.resetTime) {
      tokenCache.set(token, {
        count: 1,
        resetTime: now + RATE_LIMITS.API.DEFAULT.interval
      })
      return
    }

    record.count++
    tokenCache.set(token, record)

    if (record.count > limit) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      throw new RateLimitError(retryAfter)
    }
  },

  resetToken: (token: string) => {
    tokenCache.delete(token)
  },

  getRemainingRequests: (token: string) => {
    cleanup()
    const record = tokenCache.get(token)
    if (!record) return RATE_LIMITS.API.DEFAULT.limit
    return Math.max(0, RATE_LIMITS.API.DEFAULT.limit - record.count)
  }
}

export const middlewareRateLimit = rateLimit 