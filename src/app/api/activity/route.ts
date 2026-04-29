import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const logs = await db.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des logs' },
      { status: 500 }
    )
  }
}
