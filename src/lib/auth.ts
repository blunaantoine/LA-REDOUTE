import { NextRequest } from 'next/server'

/**
 * Check if the request is authenticated by verifying the admin-auth cookie.
 * Works in both development and production environments.
 */
export function checkAuth(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth')
  return !!(authCookie && authCookie.value === 'authenticated')
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
