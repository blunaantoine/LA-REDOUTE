/**
 * Client-side authentication utilities.
 * Provides a dual auth mechanism: cookies + Bearer token.
 * The Bearer token is stored in localStorage as a fallback when cookies don't work
 * (e.g., production HTTPS with reverse proxy, SameSite restrictions).
 */

const AUTH_TOKEN_KEY = 'laredoute-admin-token'

/**
 * Save the auth token to localStorage
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

/**
 * Get the auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

/**
 * Clear the auth token from localStorage
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

/**
 * Check if user has an auth token stored
 */
export function hasAuthToken(): boolean {
  return !!getAuthToken()
}

/**
 * Get auth headers for fetch requests.
 * Returns an object with Authorization header if token exists.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

/**
 * Authenticated fetch wrapper.
 * Automatically adds:
 * - credentials: 'include' (for cookie-based auth)
 * - Authorization header (for Bearer token auth as fallback)
 * - Merges with any additional options
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()
  const headers = new Headers(options.headers || {})

  // Add Authorization header if we have a token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // Add Content-Type for JSON requests if not already set
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  })
}
