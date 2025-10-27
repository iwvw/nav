import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.userSettings.findFirst()
    
    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          theme: 'system',
          defaultEngine: 'google',
          weatherEnabled: true,
          bookmarksEnabled: true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme, defaultEngine, weatherEnabled, bookmarksEnabled } = body

    let settings = await db.userSettings.findFirst()
    
    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          theme: theme || 'system',
          defaultEngine: defaultEngine || 'google',
          weatherEnabled: weatherEnabled !== undefined ? weatherEnabled : true,
          bookmarksEnabled: bookmarksEnabled !== undefined ? bookmarksEnabled : true
        }
      })
    } else {
      settings = await db.userSettings.update({
        where: { id: settings.id },
        data: {
          theme: theme !== undefined ? theme : settings.theme,
          defaultEngine: defaultEngine !== undefined ? defaultEngine : settings.defaultEngine,
          weatherEnabled: weatherEnabled !== undefined ? weatherEnabled : settings.weatherEnabled,
          bookmarksEnabled: bookmarksEnabled !== undefined ? bookmarksEnabled : settings.bookmarksEnabled
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}