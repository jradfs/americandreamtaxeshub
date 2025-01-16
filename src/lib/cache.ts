import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

interface CacheOptions {
  maxAge?: number; // Time in milliseconds
  maxSize?: number; // Maximum number of items
  staleWhileRevalidate?: number; // Time in milliseconds
}

interface CacheEntry {
  response: Response;
  createdAt: number;
  expiresAt: number;
}

const DEFAULT_OPTIONS: Required<CacheOptions> = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  staleWhileRevalidate: 60 * 1000, // 1 minute
};

class ResponseCache {
  private cache: LRUCache<string, CacheEntry>;
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.cache = new LRUCache({
      max: this.options.maxSize,
      ttl: this.options.maxAge + this.options.staleWhileRevalidate,
    });
  }

  private generateCacheKey(req: Request): string {
    const url = new URL(req.url);
    return `${req.method}:${url.pathname}${url.search}`;
  }

  private async cloneResponse(response: Response): Promise<Response> {
    const clonedResponse = response.clone();
    const body = await clonedResponse.blob();

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  }

  private isCacheable(req: Request, res: Response): boolean {
    // Only cache GET requests
    if (req.method !== "GET") return false;

    // Only cache successful responses
    if (!res.ok) return false;

    // Check cache-control headers
    const cacheControl = res.headers.get("cache-control");
    if (cacheControl?.includes("no-store")) return false;
    if (cacheControl?.includes("private")) return false;

    return true;
  }

  async get(req: Request): Promise<Response | null> {
    const key = this.generateCacheKey(req);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    const isStale = now > entry.expiresAt;

    // If the entry is stale but within staleWhileRevalidate window,
    // return stale data and trigger background refresh
    if (isStale && now < entry.expiresAt + this.options.staleWhileRevalidate) {
      this.backgroundRefresh(req, key);
    }

    return this.cloneResponse(entry.response);
  }

  async set(req: Request, res: Response): Promise<void> {
    if (!this.isCacheable(req, res)) return;

    const key = this.generateCacheKey(req);
    const now = Date.now();

    this.cache.set(key, {
      response: await this.cloneResponse(res),
      createdAt: now,
      expiresAt: now + this.options.maxAge,
    });
  }

  private async backgroundRefresh(req: Request, key: string): Promise<void> {
    try {
      const freshResponse = await fetch(req.clone());
      if (this.isCacheable(req, freshResponse)) {
        const now = Date.now();
        this.cache.set(key, {
          response: await this.cloneResponse(freshResponse),
          createdAt: now,
          expiresAt: now + this.options.maxAge,
        });
      }
    } catch (error) {
      console.error("Background refresh failed:", error);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  delete(req: Request): void {
    const key = this.generateCacheKey(req);
    this.cache.delete(key);
  }
}

// Create a singleton instance
export const responseCache = new ResponseCache();

// Middleware to handle caching
export async function withCache(
  req: Request,
  handler: () => Promise<Response>,
  options?: CacheOptions,
): Promise<Response> {
  // Try to get from cache
  const cachedResponse = await responseCache.get(req);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Get fresh response
  const response = await handler();

  // Cache the response if appropriate
  await responseCache.set(req, response);

  return response;
}
