'use client'

import { useState, useEffect, useCallback } from 'react'
import HomePage from '@/components/homepage/HomePage'
import AdminPanel from '@/components/admin/AdminPanel'
import { Loader2 } from 'lucide-react'

interface SiteContent {
  id: string
  key: string
  category: string
  title: string | null
  content: string
}

interface SiteImage {
  id: string
  key: string
  category: string
  title: string
  description: string | null
  imageUrl: string
  altText: string | null
  order: number
  isActive: boolean
}

interface Product {
  id: string
  category: string
  subcategory: string | null
  title: string
  description: string | null
  imageUrl: string | null
  variants: string | null
  order: number
  isActive: boolean
}

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [content, setContent] = useState<Record<string, string>>({})
  const [images, setImages] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [seeded, setSeeded] = useState(false)

  // Seed database on first load
  useEffect(() => {
    if (!seeded) {
      fetch('/api/seed', { method: 'POST' })
        .then(() => setSeeded(true))
        .catch(console.error)
    }
  }, [seeded])

  // Fetch site data
  const fetchData = useCallback(async () => {
    try {
      const [contentRes, imagesRes, productsRes] = await Promise.all([
        fetch('/api/content?category=homepage'),
        fetch('/api/images'),
        fetch('/api/products'),
      ])

      const contentData: SiteContent[] = await contentRes.json()
      const imageData: SiteImage[] = await imagesRes.json()
      const productsData: Product[] = await productsRes.json()

      // Convert content array to map
      const contentMap: Record<string, string> = {}
      if (Array.isArray(contentData)) {
        contentData.forEach((c) => {
          contentMap[c.key] = c.content
        })
      }

      // Convert images array to map
      const imageMap: Record<string, string> = {}
      if (Array.isArray(imageData)) {
        imageData.forEach((img) => {
          imageMap[img.key] = img.imageUrl
        })
      }

      setContent(contentMap)
      setImages(imageMap)
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Check auth status
  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true)
        }
      })
      .catch(console.error)
  }, [])

  // Keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAdmin(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Login handler
  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setShowAdmin(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-[#00A651] mx-auto" />
          <p className="text-gray-500 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Public homepage */}
      <HomePage
        content={content}
        images={images}
        products={products}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* Admin panel overlay */}
      {showAdmin && (
        <div className="admin-panel-transition">
          <AdminPanel
            isAuthenticated={isAuthenticated}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onClose={() => setShowAdmin(false)}
          />
        </div>
      )}
    </>
  )
}
