import { NextRequest } from 'next/server'

const ADMIN_TOKEN_PREFIX = 'laredoute-admin-'

/**
 * Check if the request is authenticated.
 * Supports DUAL authentication:
 * 1. Cookie-based auth (primary) - works when cookies are properly set/sent
 * 2. Bearer token auth (fallback) - works when cookies fail (production HTTPS, reverse proxy, etc.)
 */
export function checkAuth(request: NextRequest): boolean {
  // Method 1: Check cookie
  const authCookie = request.cookies.get('admin-auth')
  if (authCookie && authCookie.value === 'authenticated') {
    return true
  }

  // Method 2: Check Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    if (verifyToken(token)) {
      return true
    }
  }

  return false
}

/**
 * Generate an admin token from the password.
 * Uses a simple encoding scheme: prefix + base64(password)
 */
export function generateToken(password: string): string {
  return ADMIN_TOKEN_PREFIX + Buffer.from(password).toString('base64')
}

/**
 * Verify that a token is valid by decoding and checking against the admin password.
 */
export function verifyToken(token: string): boolean {
  if (!token.startsWith(ADMIN_TOKEN_PREFIX)) {
    return false
  }

  try {
    const encoded = token.slice(ADMIN_TOKEN_PREFIX.length)
    const decodedPassword = Buffer.from(encoded, 'base64').toString()
    const adminPassword = process.env.ADMIN_PASSWORD || 'laredoute2024'
    return decodedPassword === adminPassword
  } catch {
    return false
  }
}

/**
 * Returns a standard 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Non autorisé. Veuillez vous connecter.' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
