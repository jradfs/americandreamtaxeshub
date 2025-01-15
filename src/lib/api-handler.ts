import { withPerformanceMonitoring } from './performance'
import { logger } from './logger'
import { rateLimit } from './rate-limit'
import { sanitizeRequest } from './sanitize'
import { ResponseCache } from './cache'

const cache = new ResponseCache()

export function createApiHandler(options: {
  requireAuth?: boolean
  requiredRole?: string
  rateLimitKey?: string
  cacheKey?: string
  cacheTtl?: number
}) {
  return function(handler: (req: Request) => Promise<Response>) {
    return withPerformanceMonitoring(async (req: Request) => {
      try {
        // Rate limiting check
        if (options.rateLimitKey) {
          await rateLimit(options.rateLimitKey)
        }

        // Check cache
        if (options.cacheKey) {
          const cached = await cache.get(options.cacheKey)
          if (cached) {
            return cached
          }
        }

        // Sanitize request data
        const sanitizedReq = await sanitizeRequest(req.clone())

        // Handle the request
        const response = await handler(sanitizedReq)

        // Cache the response if needed
        if (options.cacheKey && options.cacheTtl) {
          await cache.set(options.cacheKey, response.clone(), options.cacheTtl)
        }

        return response
      } catch (error) {
        logger.error('API request failed', { error })
        
        const status = error instanceof Error && 'status' in error 
          ? (error as any).status 
          : 500
          
        return new Response(
          JSON.stringify({ 
            error: error instanceof Error ? error.message : 'Internal server error'
          }),
          { status }
        )
      }
    })
  }
} 