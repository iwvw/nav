'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Clock, Calendar, Cloud, Settings, Bookmark, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useTheme } from 'next-themes'
import { DynamicBackground } from '@/components/dynamic-background'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { DeploymentStatus } from '@/components/deployment-status'

interface BookmarkItem {
  id: string
  title: string
  url: string
  icon?: string
  category: string
  position: number
}

interface SearchEngine {
  id: string
  name: string
  url: string
  icon?: string
  position: number
}

interface UserSettings {
  id: string
  theme: string
  defaultEngine: string
  weatherEnabled: boolean
  bookmarksEnabled: boolean
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('google')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')
  const [weather, setWeather] = useState({ temp: '', condition: '' })
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([])
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  // 新增书签表单状态
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    icon: '',
    category: ''
  })
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      updateGreeting(now)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bookmarksRes, enginesRes, settingsRes] = await Promise.all([
        fetch('/api/bookmarks'),
        fetch('/api/search-engines'),
        fetch('/api/settings')
      ])

      if (bookmarksRes.ok) {
        const bookmarksData = await bookmarksRes.json()
        setBookmarks(bookmarksData)
      }

      if (enginesRes.ok) {
        const enginesData = await enginesRes.json()
        setSearchEngines(enginesData)
        if (enginesData.length > 0) {
          setSelectedEngine(enginesData[0].name.toLowerCase())
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
        setTheme(settingsData.theme)
        if (settingsData.weatherEnabled) {
          fetchWeather()
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateGreeting = (date: Date) => {
    const hour = date.getHours()
    if (hour < 6) setGreeting('凌晨好')
    else if (hour < 9) setGreeting('早上好')
    else if (hour < 12) setGreeting('上午好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 17) setGreeting('下午好')
    else if (hour < 19) setGreeting('傍晚好')
    else if (hour < 22) setGreeting('晚上好')
    else setGreeting('夜深了')
  }

  const fetchWeather = async () => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current_weather=true')
      const data = await response.json()
      if (data.current_weather) {
        setWeather({
          temp: `${data.current_weather.temperature}°C`,
          condition: '晴朗'
        })
      }
    } catch (error) {
      console.error('Weather fetch failed:', error)
      setWeather({ temp: '--°C', condition: '未知' })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const engine = searchEngines.find(e => e.name.toLowerCase() === selectedEngine)
    if (engine) {
      window.open(engine.url + encodeURIComponent(searchQuery), '_blank')
    }
  }

  const handleAddBookmark = async () => {
    if (!newBookmark.title || !newBookmark.url || !newBookmark.category) {
      return
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBookmark,
          position: bookmarks.filter(b => b.category === newBookmark.category).length
        }),
      })

      if (response.ok) {
        const bookmark = await response.json()
        setBookmarks([...bookmarks, bookmark])
        setNewBookmark({ title: '', url: '', icon: '', category: '' })
        setIsAddBookmarkOpen(false)
      }
    } catch (error) {
      console.error('Error adding bookmark:', error)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (date: Date) => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    return `${month}月${day}日 ${weekday}`
  }

  const bookmarksByCategory = useMemo(() => {
    return bookmarks.reduce((acc, bookmark) => {
      if (!acc[bookmark.category]) {
        acc[bookmark.category] = []
      }
      acc[bookmark.category].push(bookmark)
      return acc
    }, {} as Record<string, BookmarkItem[]>)
  }, [bookmarks])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <DynamicBackground />

      {/* 主内容 */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* 顶部工具栏 */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>设置</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>主题模式</Label>
                  <Select 
                    value={theme} 
                    onValueChange={(value) => {
                      setTheme(value)
                      handleUpdateSettings({ theme: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色模式</SelectItem>
                      <SelectItem value="dark">深色模式</SelectItem>
                      <SelectItem value="system">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weather">天气显示</Label>
                  <Switch
                    id="weather"
                    checked={settings?.weatherEnabled || false}
                    onCheckedChange={(checked) => handleUpdateSettings({ weatherEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bookmarks">书签功能</Label>
                  <Switch
                    id="bookmarks"
                    checked={settings?.bookmarksEnabled || false}
                    onCheckedChange={(checked) => handleUpdateSettings({ bookmarksEnabled: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>默认搜索引擎</Label>
                  <Select 
                    value={selectedEngine} 
                    onValueChange={(value) => {
                      setSelectedEngine(value)
                      handleUpdateSettings({ defaultEngine: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {searchEngines.map(engine => (
                        <SelectItem key={engine.id} value={engine.name.toLowerCase()}>
                          {engine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {settings?.bookmarksEnabled && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>书签管理</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <Tabs defaultValue={Object.keys(bookmarksByCategory)[0]} className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <TabsList>
                          {Object.keys(bookmarksByCategory).map(category => (
                            <TabsTrigger key={category} value={category}>
                              {category}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        <Dialog open={isAddBookmarkOpen} onOpenChange={setIsAddBookmarkOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              添加
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>添加书签</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="title">标题</Label>
                                <Input
                                  id="title"
                                  value={newBookmark.title}
                                  onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                                  placeholder="输入书签标题"
                                />
                              </div>
                              <div>
                                <Label htmlFor="url">网址</Label>
                                <Input
                                  id="url"
                                  value={newBookmark.url}
                                  onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                                  placeholder="https://example.com"
                                />
                              </div>
                              <div>
                                <Label htmlFor="icon">图标</Label>
                                <Input
                                  id="icon"
                                  value={newBookmark.icon}
                                  onChange={(e) => setNewBookmark({...newBookmark, icon: e.target.value})}
                                  placeholder="📚"
                                />
                              </div>
                              <div>
                                <Label htmlFor="category">分类</Label>
                                <Input
                                  id="category"
                                  value={newBookmark.category}
                                  onChange={(e) => setNewBookmark({...newBookmark, category: e.target.value})}
                                  placeholder="开发"
                                />
                              </div>
                              <Button onClick={handleAddBookmark} className="w-full">
                                添加书签
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {Object.entries(bookmarksByCategory).map(([category, items]) => (
                        <TabsContent key={category} value={category} className="space-y-2">
                          {items.map(bookmark => (
                            <div key={bookmark.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10">
                              <Button
                                variant="ghost"
                                className="flex-1 justify-start"
                                onClick={() => window.open(bookmark.url, '_blank')}
                              >
                                <span className="mr-2">{bookmark.icon || '🔗'}</span>
                                {bookmark.title}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBookmark(bookmark.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* 时间和天气 */}
        <div className={`absolute top-8 left-8 text-white transition-all duration-300 ${
          isSearchFocused ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-8 w-8" />
            <div className="text-4xl font-bold">{formatTime(currentTime)}</div>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
          {settings?.weatherEnabled && (
            <div className="flex items-center gap-2 text-white/80 mt-2">
              <Cloud className="h-4 w-4" />
              <span className="text-sm">{weather.condition} {weather.temp}</span>
            </div>
          )}
        </div>

        {/* 欢迎语 */}
        <div className={`text-center mb-8 transition-all duration-300 ${
          isSearchFocused ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {greeting}
          </h1>
          <p className="text-white/80">欢迎回到导航页面</p>
        </div>

        {/* 搜索框 */}
        <Card className={`w-full max-w-2xl transition-all duration-300 ${
          isSearchFocused ? 'shadow-2xl ring-2 ring-white/30' : 'shadow-lg'
        }`}>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="搜索任何内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="pl-10 pr-4 py-3 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/50 focus:border-white/40"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                >
                  搜索
                </Button>
              </div>
              
              {/* 搜索引擎选择 */}
              <div className="flex flex-wrap gap-2 justify-center">
                {searchEngines.map(engine => (
                  <Button
                    key={engine.id}
                    type="button"
                    variant={selectedEngine === engine.name.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEngine(engine.name.toLowerCase())}
                    className={`text-xs ${
                      selectedEngine === engine.name.toLowerCase() 
                        ? 'bg-white/20 text-white border-white/40' 
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {engine.icon} {engine.name}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 快捷书签 */}
        {settings?.bookmarksEnabled && bookmarks.length > 0 && (
          <div className={`mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-300 ${
            isSearchFocused ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {bookmarks.slice(0, 6).map(bookmark => (
              <Button
                key={bookmark.id}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto p-4 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => window.open(bookmark.url, '_blank')}
              >
                <span className="text-2xl">{bookmark.icon || '🔗'}</span>
                <span className="text-xs text-center">{bookmark.title}</span>
              </Button>
            ))}
          </div>
        )}
      </main>
      
      <DeploymentStatus />
    </div>
  )
}