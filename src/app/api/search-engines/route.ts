import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const searchEngines = await db.searchEngine.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    })
    return NextResponse.json(searchEngines)
  } catch (error) {
    console.error('Error fetching search engines:', error)
    return NextResponse.json({ error: 'Failed to fetch search engines' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, icon, position } = body

    if (!name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const searchEngine = await db.searchEngine.create({
      data: {
        name,
        url,
        icon,
        position: position || 0
      }
    })

    return NextResponse.json(searchEngine)
  } catch (error) {
    console.error('Error creating search engine:', error)
    return NextResponse.json({ error: 'Failed to create search engine' }, { status: 500 })
  }
}