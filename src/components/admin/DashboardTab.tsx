'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Image as ImageIcon, Users, TrendingUp } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalImages: number
  totalPartners: number
  recentProducts: Array<{
    id: string
    title: string
    category: string
    createdAt: string
  }>
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalImages: 0,
    totalPartners: 0,
    recentProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, imagesRes, partnersRes] = await Promise.all([
          fetch('/api/products?all=true'),
          fetch('/api/images'),
          fetch('/api/partners'),
        ])
        const products = await productsRes.json()
        const images = await imagesRes.json()
        const partners = await partnersRes.json()

        const activeProducts = Array.isArray(products) ? products.filter((p: { isActive: boolean }) => p.isActive) : []
        const activePartners = Array.isArray(partners) ? partners.filter((p: { isActive: boolean }) => p.isActive) : []

        setStats({
          totalProducts: activeProducts.length,
          totalImages: Array.isArray(images) ? images.length : 0,
          totalPartners: activePartners.length,
          recentProducts: activeProducts.slice(0, 5).map((p: { id: string; title: string; category: string; createdAt: string }) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            createdAt: p.createdAt,
          })),
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]" />
      </div>
    )
  }

  const statCards = [
    { label: 'Produits actifs', value: stats.totalProducts, icon: Package, color: '#00A651' },
    { label: 'Images', value: stats.totalImages, icon: ImageIcon, color: '#008541' },
    { label: 'Partenaires', value: stats.totalPartners, icon: Users, color: '#00C762' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de votre site</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="size-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Products */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-[#00A651]" />
            Produits récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun produit pour le moment</p>
          ) : (
            <div className="space-y-3">
              {stats.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{product.title}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
