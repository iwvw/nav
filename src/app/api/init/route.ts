import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('开始初始化数据库...')

    // 检查是否已有数据
    const existingBookmarks = await prisma.bookmark.count()
    const existingEngines = await prisma.searchEngine.count()
    const existingSettings = await prisma.userSettings.count()

    if (existingBookmarks === 0) {
      console.log('创建默认书签...')
      const bookmarks = [
        { title: 'GitHub', url: 'https://github.com', icon: '🐙', category: '开发', position: 0 },
        { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚', category: '开发', position: 1 },
        { title: 'MDN', url: 'https://developer.mozilla.org', icon: '📖', category: '开发', position: 2 },
        { title: 'YouTube', url: 'https://youtube.com', icon: '📺', category: '娱乐', position: 0 },
        { title: 'Twitter', url: 'https://twitter.com', icon: '🐦', category: '社交', position: 0 },
        { title: 'Reddit', url: 'https://reddit.com', icon: '🤖', category: '社交', position: 1 },
        { title: 'Netflix', url: 'https://netflix.com', icon: '🎬', category: '娱乐', position: 1 },
        { title: 'Spotify', url: 'https://spotify.com', icon: '🎵', category: '娱乐', position: 2 },
      ]

      for (const bookmark of bookmarks) {
        await prisma.bookmark.create({ data: bookmark })
      }
    }

    if (existingEngines === 0) {
      console.log('创建默认搜索引擎...')
      const searchEngines = [
        { name: 'Google', url: 'https://www.google.com/search?q=', icon: '🔍', position: 0 },
        { name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '🔍', position: 1 },
        { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: '🔍', position: 2 },
        { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: '🦆', position: 3 },
        { name: 'GitHub', url: 'https://github.com/search?q=', icon: '🐙', position: 4 },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=', icon: '📚', position: 5 },
      ]

      for (const engine of searchEngines) {
        await prisma.searchEngine.create({ data: engine })
      }
    }

    if (existingSettings === 0) {
      console.log('创建默认设置...')
      await prisma.userSettings.create({
        data: {
          theme: 'dark',
          defaultEngine: 'google',
          weatherEnabled: true,
          bookmarksEnabled: true
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: '数据库初始化完成',
      data: {
        bookmarks: await prisma.bookmark.count(),
        engines: await prisma.searchEngine.count(),
        settings: await prisma.userSettings.count()
      }
    })
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return NextResponse.json({ 
      success: false, 
      message: '数据库初始化失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}