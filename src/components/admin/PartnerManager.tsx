'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  documentUrl: string | null
  order: number
  isActive: boolean
}

interface PartnerForm {
  name: string
  description: string
  logoFile: File | null
  documentFile: File | null
}

const emptyForm: PartnerForm = {
  name: '',
  description: '',
  logoFile: null,
  documentFile: null,
}

export default function PartnerManager() {
  const { toast } = useToast()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Add form
  const [form, setForm] = useState<PartnerForm>({ ...emptyForm })

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [editForm, setEditForm] = useState<PartnerForm>({ ...emptyForm })

  const fetchPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/partners')
      const data = await res.json()
      setPartners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const handleAddPartner = async () => {
    if (!form.name) {
      toast({ title: 'Erreur', description: 'Le nom est requis.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      let logoUrl = ''
      let documentUrl = ''

      if (form.logoFile) {
        const formData = new FormData()
        formData.append('file', form.logoFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) logoUrl = uploadData.url
      }

      if (form.documentFile) {
        const formData = new FormData()
        formData.append('file', form.documentFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) documentUrl = uploadData.url
      }

      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          logoUrl: logoUrl || null,
          documentUrl: documentUrl || null,
          order: 0,
        }),
      })

      if (res.ok) {
        toast({ title: 'Partenaire ajouté' })
        setForm({ ...emptyForm })
        fetchPartners()
      } else {
        toast({ title: 'Erreur', description: 'Impossible d\'ajouter le partenaire.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditPartner = async () => {
    if (!editingPartner || !editForm.name) return

    setSaving(true)
    try {
      let logoUrl = editingPartner.logoUrl || ''
      let documentUrl = editingPartner.documentUrl || ''

      if (editForm.logoFile) {
        const formData = new FormData()
        formData.append('file', editForm.logoFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) logoUrl = uploadData.url
      }

      if (editForm.documentFile) {
        const formData = new FormData()
        formData.append('file', editForm.documentFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) documentUrl = uploadData.url
      }

      const res = await fetch('/api/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPartner.id,
          name: editForm.name,
          description: editForm.description || null,
          logoUrl: logoUrl || null,
          documentUrl: documentUrl || null,
        }),
      })

      if (res.ok) {
        toast({ title: 'Partenaire modifié' })
        setEditDialogOpen(false)
        fetchPartners()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de modifier le partenaire.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Partenaire supprimé' })
        fetchPartners()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
    }
  }

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner)
    setEditForm({
      name: partner.name,
      description: partner.description || '',
      logoFile: null,
      documentFile: null,
    })
    setEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#00A651]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Partenaires</h1>
        <p className="text-gray-500 mt-1">Gérez vos partenaires</p>
      </div>

      {/* Add Partner Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="size-5 text-[#00A651]" />
            Ajouter un partenaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nom du partenaire"
              />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, logoFile: e.target.files?.[0] || null })}
              />
            </div>
            <div className="space-y-2">
              <Label>Document</Label>
              <Input
                type="file"
                onChange={(e) => setForm({ ...form, documentFile: e.target.files?.[0] || null })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description du partenaire"
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={handleAddPartner}
            disabled={saving}
            className="bg-[#00A651] hover:bg-[#008541]"
          >
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Liste des partenaires</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun partenaire</p>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {partner.logoUrl && (
                      <Image src={partner.logoUrl} alt={partner.name} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{partner.name}</p>
                        {partner.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{partner.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(partner)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeletePartner(partner.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le partenaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nouveau logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, logoFile: e.target.files?.[0] || null })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Nouveau document</Label>
                <Input
                  type="file"
                  onChange={(e) => setEditForm({ ...editForm, documentFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditPartner} disabled={saving} className="bg-[#00A651] hover:bg-[#008541]">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
