'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Image as ImageIcon, Users, TrendingUp, Plus, Mail, Eye, Clock, Activity, MessageSquare, BarChart3, Download, Loader2, FileText } from 'lucide-react'
import { authFetch } from '@/lib/auth-client'

interface ProductItem {
  id: string
  title: string
  category: string
  subcategory: string | null
  isActive: boolean
  createdAt: string
}

interface Stats {
  totalProducts: number
  totalProductsIncludingInactive: number
  totalInactiveProducts: number
  totalImages: number
  totalPartners: number
  totalMessages: number
  unreadMessages: number
  recentProducts: Array<{
    id: string
    title: string
    category: string
    createdAt: string
  }>
  categoryDistribution: Record<string, number>
}

const categoryLabels: Record<string, string> = {
  pneus: 'Pneus',
  huiles: 'Huiles',
  accessoires: 'Accessoires',
  alimentation: 'Alimentation',
  boissons: 'Boissons',
  cereales: 'Céréales',
}

const categoryColors: Record<string, string> = {
  pneus: '#00A651',
  huiles: '#008541',
  accessoires: '#00C762',
  alimentation: '#D4A017',
  boissons: '#C75B12',
  cereales: '#8B6914',
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalProductsIncludingInactive: 0,
    totalInactiveProducts: 0,
    totalImages: 0,
    totalPartners: 0,
    totalMessages: 0,
    unreadMessages: 0,
    recentProducts: [],
    categoryDistribution: {},
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, imagesRes, partnersRes, messagesRes] = await Promise.all([
          authFetch('/api/products?all=true'),
          authFetch('/api/images'),
          authFetch('/api/partners'),
          authFetch('/api/contact'),
        ])
        const products = await productsRes.json()
        const images = await imagesRes.json()
        const partners = await partnersRes.json()
        const messagesData = messagesRes.ok ? await messagesRes.json() : { messages: [], unreadCount: 0 }

        const allProducts = Array.isArray(products) ? products : []
        const activeProducts = allProducts.filter((p: ProductItem) => p.isActive)
        const activePartners = Array.isArray(partners) ? partners.filter((p: { isActive: boolean }) => p.isActive) : []
        const allMessages = Array.isArray(messagesData.messages) ? messagesData.messages : []

        // Calculate category distribution
        const distribution: Record<string, number> = {}
        allProducts.forEach((p: ProductItem) => {
          const cat = p.category || 'other'
          distribution[cat] = (distribution[cat] || 0) + 1
        })

        setStats({
          totalProducts: activeProducts.length,
          totalProductsIncludingInactive: allProducts.length,
          totalInactiveProducts: allProducts.filter((p: ProductItem) => !p.isActive).length,
          totalImages: Array.isArray(images) ? images.length : 0,
          totalPartners: activePartners.length,
          totalMessages: allMessages.length,
          unreadMessages: messagesData.unreadCount || 0,
          recentProducts: activeProducts.slice(0, 5).map((p: ProductItem) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            createdAt: p.createdAt,
          })),
          categoryDistribution: distribution,
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
      sublabel: `${stats.totalProductsIncludingInactive} au total`,
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
    {
      label: 'Messages',
      value: stats.totalMessages,
      sublabel: stats.unreadMessages > 0 ? `${stats.unreadMessages} non lu${stats.unreadMessages > 1 ? 's' : ''}` : 'Tout lu',
      icon: MessageSquare,
      gradient: stats.unreadMessages > 0 ? 'from-red-500 to-red-600' : 'from-[#00A651] to-[#008541]',
      bgLight: stats.unreadMessages > 0 ? 'bg-red-50' : 'bg-[#00A651]/10',
      iconColor: stats.unreadMessages > 0 ? 'text-red-500' : 'text-[#00A651]',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
  ]

  // Build activity timeline from recent products
  const handleExport = async (type: string) => {
    setExporting(type)
    try {
      const token = localStorage.getItem('laredoute-admin-token')
      const url = `/api/export?type=${type}${token ? `&token=${encodeURIComponent(token)}` : ''}`
      window.open(url, '_blank')
    } catch {
      console.error('Export failed')
    } finally {
      setTimeout(() => setExporting(null), 1000)
    }
  }
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

  // Calculate max for bar chart scaling
  const maxCategoryCount = Math.max(...Object.values(stats.categoryDistribution), 1)

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={stat.label}
            className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient border on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00A651]/0 to-[#00C762]/0 group-hover:from-[#00A651]/20 group-hover:to-[#00C762]/5 transition-all duration-500 -z-10" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <stat.icon className="size-6 text-white" />
                  </div>
                  {stat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1a1a1a] count-up">{stat.value}</p>
                  {stat.sublabel && (
                    <p className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</p>
                  )}
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

      {/* Quick Stats - Product Distribution */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="size-5 text-[#00A651]" />
            Distribution des produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.categoryDistribution).length === 0 ? (
            <div className="text-center py-10">
              <Package className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucun produit pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.categoryDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const percentage = Math.max((count / maxCategoryCount) * 100, 8)
                  const color = categoryColors[category] || '#6B7280'
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1a1a1a]">
                          {categoryLabels[category] || category}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {count} produit{count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        >
                          <span className="text-[10px] font-bold text-white drop-shadow-sm">
                            {Math.round((count / stats.totalProductsIncludingInactive) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              {/* Summary */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded-full bg-[#00A651]" />
                    Automobile
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded-full bg-[#D4A017]" />
                    Agro-alimentaire
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {stats.totalProductsIncludingInactive} total · {stats.totalInactiveProducts} inactif{stats.totalInactiveProducts !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="size-5 text-[#00A651]" />
            Exporter les données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Téléchargez vos données au format CSV pour les utiliser dans Excel ou Google Sheets.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('products')}
              disabled={exporting === 'products'}
              className="justify-start gap-2 h-auto py-3 px-4 hover:bg-[#00A651]/5 hover:border-[#00A651]/30"
            >
              {exporting === 'products' ? (
                <Loader2 className="size-4 animate-spin text-[#00A651]" />
              ) : (
                <Package className="size-4 text-[#00A651]" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">Exporter Produits</p>
                <p className="text-xs text-gray-400">CSV</p>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('content')}
              disabled={exporting === 'content'}
              className="justify-start gap-2 h-auto py-3 px-4 hover:bg-[#00A651]/5 hover:border-[#00A651]/30"
            >
              {exporting === 'content' ? (
                <Loader2 className="size-4 animate-spin text-[#00A651]" />
              ) : (
                <FileText className="size-4 text-[#00A651]" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">Exporter Contenu</p>
                <p className="text-xs text-gray-400">CSV</p>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('messages')}
              disabled={exporting === 'messages'}
              className="justify-start gap-2 h-auto py-3 px-4 hover:bg-[#00A651]/5 hover:border-[#00A651]/30"
            >
              {exporting === 'messages' ? (
                <Loader2 className="size-4 animate-spin text-[#00A651]" />
              ) : (
                <MessageSquare className="size-4 text-[#00A651]" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">Exporter Messages</p>
                <p className="text-xs text-gray-400">CSV</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

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
