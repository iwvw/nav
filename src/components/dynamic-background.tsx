'use client'

import { useState, useEffect } from 'react'

const backgrounds = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&h=1080&fit=crop',
]

export function DynamicBackground() {
  const [currentBg, setCurrentBg] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 30000) // 每30秒切换一次背景

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.src = backgrounds[currentBg]
  }, [currentBg])

  return (
    <>
      <div className="fixed inset-0 -z-10">
        {imageLoaded && (
          <img
            src={backgrounds[currentBg]}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </>
  )
}