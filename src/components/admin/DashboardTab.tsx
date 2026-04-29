'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Image as ImageIcon, Users, TrendingUp, Plus, Mail, Eye, Clock, Activity } from 'lucide-react'
import { authFetch } from '@/lib/auth-client'

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
          authFetch('/api/products?all=true'),
          authFetch('/api/images'),
          authFetch('/api/partners'),
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
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="skeleton-pulse skeleton-pulse-heading" />
          <div className="skeleton-pulse skeleton-pulse-text w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 skeleton-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-64 skeleton-pulse rounded-xl" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Produits actifs',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-[#00A651] to-[#008541]',
      bgLight: 'bg-[#00A651]/10',
      iconColor: 'text-[#00A651]',
    },
    {
      label: 'Images',
      value: stats.totalImages,
      icon: ImageIcon,
      gradient: 'from-[#008541] to-[#006d35]',
      bgLight: 'bg-[#008541]/10',
      iconColor: 'text-[#008541]',
    },
    {
      label: 'Partenaires',
      value: stats.totalPartners,
      icon: Users,
      gradient: 'from-[#00C762] to-[#00A651]',
      bgLight: 'bg-[#00C762]/10',
      iconColor: 'text-[#00C762]',
    },
  ]

  // Build activity timeline from recent products
  const activityTimeline = stats.recentProducts.map((product, index) => ({
    id: product.id,
    title: product.title,
    category: product.category,
    date: product.createdAt,
    type: 'product' as const,
  }))

  const quickActions = [
    { label: 'Ajouter un produit', icon: Plus, color: 'bg-[#00A651] hover:bg-[#008541] text-white' },
    { label: 'Voir les messages', icon: Mail, color: 'bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-200' },
    { label: 'Voir le site', icon: Eye, color: 'bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-200' },
  ]

  return (
    <div className="space-y-8 page-enter">
      {/* Welcome section */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#0d3d2e] to-[#1a4d3d] text-white">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00C762]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#00A651]/10 rounded-full blur-2xl" />

        <div className="relative">
          <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Panneau d&apos;administration</p>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Bienvenue sur <span className="gradient-text" style={{ WebkitTextFillColor: '#00C762' }}>LA REDOUTE</span>
          </h1>
          <p className="text-white/50 mt-2 text-sm max-w-lg">
            Gérez vos produits, images et partenaires depuis ce tableau de bord. Votre site est en ligne et fonctionne normalement.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={stat.label}
            className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1a1a1a] count-up">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            className={`${action.color} shadow-sm hover:shadow-md transition-all duration-200 h-10 text-sm font-medium rounded-lg`}
          >
            <action.icon className="size-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Activity Timeline */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="size-5 text-[#00A651]" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityTimeline.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucune activité pour le moment</p>
              <p className="text-gray-400 text-xs mt-1">Les nouveaux produits apparaîtront ici</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#00A651]/30 via-[#00A651]/15 to-transparent" />

              <div className="space-y-1">
                {activityTimeline.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-0.5">
                      <div className={`w-[10px] h-[10px] rounded-full border-2 border-[#00A651] bg-white group-hover:bg-[#00A651] transition-colors duration-200 ${index === 0 ? 'bg-[#00A651]' : ''}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#1a1a1a] text-sm truncate group-hover:text-[#00A651] transition-colors duration-200">
                          {activity.title}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          <Package className="size-3 mr-1 text-gray-400" />
                          {activity.category}
                        </span>
                        {index === 0 && (
                          <span className="inline-flex items-center text-xs text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded-md font-medium">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
