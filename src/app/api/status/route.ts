import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [bookmarkCount, engineCount] = await Promise.all([
      db.bookmark.count(),
      db.searchEngine.count()
    ])

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      data: {
        bookmarks: bookmarkCount,
        searchEngines: engineCount,
        version: '1.0.0'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get status'
    }, { status: 500 })
  }
}