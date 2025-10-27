'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DeploymentStatus {
  status: 'healthy' | 'error' | 'loading'
  message: string
  data?: {
    bookmarks: number
    searchEngines: number
    version: string
  }
}

export function DeploymentStatus() {
  const [status, setStatus] = useState<DeploymentStatus>({
    status: 'loading',
    message: '检查部署状态...'
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status')
        const data = await response.json()
        
        if (data.status === 'healthy') {
          setStatus({
            status: 'healthy',
            message: '部署正常',
            data: data.data
          })
        } else {
          setStatus({
            status: 'error',
            message: '部署异常'
          })
        }
      } catch (error) {
        setStatus({
          status: 'error',
          message: '无法连接到服务器'
        })
      }
    }

    checkStatus()
  }, [])

  const getStatusIcon = () => {
    switch (status.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'loading':
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge className={`flex items-center gap-2 px-3 py-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs">{status.message}</span>
        {status.data && (
          <span className="text-xs opacity-75">
            v{status.data.version}
          </span>
        )}
      </Badge>
    </div>
  )
}