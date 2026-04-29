'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Plus, Pencil, Trash2, LogIn, Clock, Activity } from 'lucide-react'
import { authFetch } from '@/lib/auth-client'

interface ActivityLogEntry {
  id: string
  action: string
  resource: string
  resourceId: string | null
  details: string | null
  createdAt: string
}

const actionConfig: Record<string, { color: string; bgColor: string; icon: typeof Plus; label: string }> = {
  create: { color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: Plus, label: 'Création' },
  update: { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Pencil, label: 'Mise à jour' },
  delete: { color: 'text-red-600', bgColor: 'bg-red-50', icon: Trash2, label: 'Suppression' },
  login: { color: 'text-amber-600', bgColor: 'bg-amber-50', icon: LogIn, label: 'Connexion' },
}

const resourceLabels: Record<string, string> = {
  product: 'Produit',
  content: 'Contenu',
  image: 'Image',
  partner: 'Partenaire',
  auth: 'Auth',
}

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'il y a quelques secondes'
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`
  if (diffHour < 24) return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`
  if (diffDay < 7) return `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ActivityLogTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLogs = useCallback(async () => {
    try {
      const res = await authFetch('/api/activity?limit=50')
      if (res.ok) {
        const data = await res.json()
        setLogs(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLogs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#00A651]" />
      </div>
    )
  }

  // Group logs by date
  const groupedLogs: Record<string, ActivityLogEntry[]> = {}
  logs.forEach((log) => {
    const date = new Date(log.createdAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    if (!groupedLogs[date]) groupedLogs[date] = []
    groupedLogs[date].push(log)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Journal d&apos;activité</h1>
          <p className="text-gray-500 mt-1">Historique des actions administrateur</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(actionConfig).map(([action, config]) => {
          const count = logs.filter((l) => l.action === action).length
          return (
            <Card key={action} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                  <config.icon className={`size-5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1a1a1a]">{count}</p>
                  <p className="text-xs text-gray-500">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="size-5 text-[#00A651]" />
            Activités récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucune activité enregistrée</p>
              <p className="text-gray-400 text-xs mt-1">Les actions apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedLogs).map(([date, dateLogs]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="relative ml-4">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />

                    <div className="space-y-1">
                      {dateLogs.map((log) => {
                        const config = actionConfig[log.action] || actionConfig.update
                        const IconComp = config.icon

                        return (
                          <div
                            key={log.id}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                          >
                            {/* Timeline dot */}
                            <div className={`relative z-10 mt-0.5 w-[10px] h-[10px] rounded-full border-2 border-current flex-shrink-0 ${config.color} bg-white group-hover:scale-125 transition-transform`} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${config.bgColor} ${config.color}`}>
                                    <IconComp className="size-3" />
                                    {config.label}
                                  </span>
                                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                    {resourceLabels[log.resource] || log.resource}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {getRelativeTime(log.createdAt)}
                                </span>
                              </div>
                              {log.details && (
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                  {log.details}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
