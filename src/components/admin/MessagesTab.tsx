'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  Loader2,
  User,
  Clock,
  MessageSquare,
  Inbox,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/auth-client'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export default function MessagesTab() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [markingRead, setMarkingRead] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/contact')
      if (!res.ok) throw new Error('Erreur lors du chargement des messages.')
      const data = await res.json()
      setMessages(data.messages || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de charger les messages.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    setMarkingRead(id)
    try {
      const res = await authFetch('/api/contact/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !isRead }),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour.')
      await fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: !isRead })
      }
      toast({
        title: isRead ? 'Marqué comme non lu' : 'Marqué comme lu',
        description: 'Le message a été mis à jour.',
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de mettre à jour le message.',
        variant: 'destructive',
      })
    } finally {
      setMarkingRead(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const res = await authFetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression.')
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      await fetchMessages()
      toast({
        title: 'Message supprimé',
        description: 'Le message a été supprimé avec succès.',
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de supprimer le message.',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#00A651]" />
        <span className="ml-3 text-gray-500">Chargement des messages...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <MessageSquare className="size-6 text-[#00A651]" />
            Messages
            {unreadCount > 0 && (
              <Badge className="bg-[#00A651] text-white ml-2">
                {unreadCount} non {unreadCount === 1 ? 'lu' : 'lus'}
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchMessages}
          className="border-[#00A651] text-[#00A651] hover:bg-[#00A651]/5"
        >
          <RefreshCw className="size-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <Inbox className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun message</h3>
            <p className="text-gray-400 text-sm">
              Les messages envoyés via le formulaire de contact apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar pr-1">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === msg.id
                    ? 'ring-2 ring-[#00A651]/30 bg-[#00A651]/5'
                    : msg.isRead
                    ? 'bg-white'
                    : 'bg-white border-l-4 border-l-[#00A651]'
                }`}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.isRead) {
                    handleMarkAsRead(msg.id, false)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {msg.isRead ? (
                          <MailOpen className="size-4 text-gray-400 shrink-0" />
                        ) : (
                          <Mail className="size-4 text-[#00A651] shrink-0" />
                        )}
                        <p className={`text-sm truncate ${msg.isRead ? 'text-gray-600' : 'font-semibold text-[#1a1a1a]'}`}>
                          {msg.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {msg.subject || 'Sans sujet'}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] text-gray-400">
                        {formatDate(msg.createdAt)}
                      </span>
                      {!msg.isRead && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-[#00A651]" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  {/* Message Header */}
                  <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#00A651]/10 rounded-full flex items-center justify-center">
                          <User className="size-5 text-[#00A651]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1a1a1a]">{selectedMessage.name}</h3>
                          <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(selectedMessage.createdAt)}
                        </span>
                        {selectedMessage.subject && (
                          <span className="text-[#00A651] font-medium">
                            {selectedMessage.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.isRead)}
                        disabled={markingRead === selectedMessage.id}
                        className="text-xs"
                      >
                        {markingRead === selectedMessage.id ? (
                          <Loader2 className="size-3 animate-spin mr-1" />
                        ) : selectedMessage.isRead ? (
                          <Mail className="size-3 mr-1" />
                        ) : (
                          <MailOpen className="size-3 mr-1" />
                        )}
                        {selectedMessage.isRead ? 'Non lu' : 'Lu'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(selectedMessage.id)}
                        disabled={deleting === selectedMessage.id}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {deleting === selectedMessage.id ? (
                          <Loader2 className="size-3 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="size-3 mr-1" />
                        )}
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-400 uppercase tracking-wider">Sujet</Label>
                      <p className="text-[#1a1a1a] font-medium mt-1">
                        {selectedMessage.subject || 'Sans sujet'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400 uppercase tracking-wider">Message</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-[#00A651] border-[#00A651]/30 hover:bg-[#00A651]/5"
                    >
                      <a href={`mailto:${selectedMessage.email}`}>
                        <Mail className="size-4 mr-2" />
                        Répondre par email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <Mail className="size-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500">Sélectionnez un message</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Cliquez sur un message dans la liste pour voir son contenu.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
