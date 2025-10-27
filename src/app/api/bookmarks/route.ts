import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const bookmarks = await db.bookmark.findMany({
      orderBy: [
        { category: 'asc' },
        { position: 'asc' }
      ]
    })
    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, icon, category, position } = body

    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const bookmark = await db.bookmark.create({
      data: {
        title,
        url,
        icon,
        category,
        position: position || 0
      }
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 })
  }
}