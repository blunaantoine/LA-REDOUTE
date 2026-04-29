import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    const isProduction = process.env.NODE_ENV === 'production'

    // Clear the auth cookie
    response.cookies.set('admin-auth', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    // Note: Client-side code must also clear localStorage token
    // This is handled by the clearAuthToken() function in auth-client.ts

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
