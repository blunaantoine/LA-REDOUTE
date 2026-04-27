'use client'

import { useState, useEffect, useCallback } from 'react'
import { NavigationProvider, useNavigation } from '@/context/NavigationContext'
import AccueilPage from '@/components/pages/AccueilPage'
import AutomobilePage from '@/components/pages/AutomobilePage'
import AgroalimentairePage from '@/components/pages/AgroalimentairePage'
import AboutPage from '@/components/pages/AboutPage'
import ContactPage from '@/components/pages/ContactPage'
import AdminPanel from '@/components/admin/AdminPanel'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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

function SiteContent() {
  const { currentPage } = useNavigation()
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
        fetch('/api/content'),
        fetch('/api/images'),
        fetch('/api/products'),
      ])

      const contentData: SiteContent[] = await contentRes.json()
      const imageData: SiteImage[] = await imagesRes.json()
      const productsData: Product[] = await productsRes.json()

      const contentMap: Record<string, string> = {}
      if (Array.isArray(contentData)) {
        contentData.forEach((c) => {
          contentMap[c.key] = c.content
        })
      }

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

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <AccueilPage content={content} images={images} products={products} />
      case 'automobile':
        return <AutomobilePage content={content} products={products} />
      case 'agroalimentaire':
        return <AgroalimentairePage content={content} products={products} />
      case 'about':
        return <AboutPage content={content} images={images} />
      case 'contact':
        return <ContactPage content={content} />
      default:
        return <AccueilPage content={content} images={images} products={products} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoUrl={images['logo-main'] || '/logo-main.png'} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer
        logoUrl={images['logo-main'] || '/logo-main.png'}
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
            onRefresh={fetchData}
          />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <NavigationProvider>
      <SiteContent />
    </NavigationProvider>
  )
}
