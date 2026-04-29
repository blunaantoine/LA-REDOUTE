'use client'

import { useEffect, useState } from 'react'

export default function LoadingSkeleton() {
  const [dots, setDots] = useState('')

  // Pulsing dots animation for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-screen hero-gradient flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-white/10 rounded-full skeleton-pulse" />
              <div className="h-16 w-96 bg-white/10 rounded-lg skeleton-pulse" />
              <div className="h-8 w-24 bg-white/10 rounded-lg skeleton-pulse" />
              <div className="h-20 w-full max-w-xl bg-white/10 rounded-lg skeleton-pulse" />
              {/* Counter skeletons */}
              <div className="flex gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg skeleton-pulse" />
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-white/10 rounded skeleton-pulse" />
                      <div className="h-3 w-24 bg-white/10 rounded skeleton-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-white/10 rounded-lg skeleton-pulse" />
                <div className="h-12 w-40 bg-white/10 rounded-lg skeleton-pulse" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-80 h-80 mx-auto bg-white/10 rounded-3xl skeleton-pulse" />
            </div>
          </div>
          {/* Loading text with pulsing dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-wider">
            Chargement{dots}
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="h-6 w-32 mx-auto bg-gray-200 rounded-full skeleton-pulse" />
            <div className="h-10 w-80 mx-auto bg-gray-200 rounded-lg skeleton-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 skeleton-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded skeleton-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse" />
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg skeleton-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values section skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="h-6 w-40 mx-auto bg-gray-200 rounded-full skeleton-pulse" />
            <div className="h-10 w-72 mx-auto bg-gray-200 rounded-lg skeleton-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl skeleton-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded skeleton-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded skeleton-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded skeleton-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section skeleton */}
      <div className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-10 w-96 mx-auto bg-white/10 rounded-lg skeleton-pulse" />
          <div className="h-6 w-full max-w-lg mx-auto bg-white/10 rounded skeleton-pulse" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-48 bg-white/10 rounded-lg skeleton-pulse" />
            <div className="h-12 w-48 bg-white/10 rounded-lg skeleton-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin panel skeleton - sidebar + content area
export function AdminSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-[260px] bg-[#0d3d2e] p-6">
        <div className="h-9 w-32 bg-white/10 rounded skeleton-pulse mb-8" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-10 w-full bg-white/5 rounded-lg skeleton-pulse" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="h-28 w-full bg-gray-100 rounded-xl skeleton-pulse" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl skeleton-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl skeleton-pulse" />
      </div>
    </div>
  )
}
