'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/auth-client'

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

const imageCategories = [
  { key: 'logo', label: 'Logos' },
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'À Propos' },
  { key: 'product', label: 'Produits' },
  { key: 'partner', label: 'Partenaires' },
  { key: 'general', label: 'Général' },
]

export default function ImageManager() {
  const { toast } = useToast()
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Add form
  const [newImage, setNewImage] = useState({
    key: '',
    category: 'general',
    title: '',
    description: '',
    altText: '',
  })
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null)
  const [editForm, setEditForm] = useState({
    key: '',
    category: 'general',
    title: '',
    description: '',
    altText: '',
  })
  const [editFile, setEditFile] = useState<File | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      const res = await authFetch('/api/images')
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleAddImage = async () => {
    if (!newImage.key || !newImage.title) {
      toast({ title: 'Erreur', description: 'La clé et le titre sont requis.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      let imageUrl = ''
      if (uploadFile) {
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('category', newImage.category)
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await authFetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newImage.key,
          category: newImage.category,
          title: newImage.title,
          description: newImage.description || null,
          imageUrl: imageUrl || '/placeholder.png',
          altText: newImage.altText || null,
          order: 0,
        }),
      })

      if (res.ok) {
        toast({ title: 'Image ajoutée' })
        setNewImage({ key: '', category: 'general', title: '', description: '', altText: '' })
        setUploadFile(null)
        fetchImages()
      } else {
        const data = await res.json()
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditImage = async () => {
    if (!editingImage) return

    setSaving(true)
    try {
      let imageUrl = editingImage.imageUrl
      if (editFile) {
        const formData = new FormData()
        formData.append('file', editFile)
        formData.append('category', 'edit-image')
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await authFetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingImage.id,
          key: editForm.key,
          category: editForm.category,
          title: editForm.title,
          description: editForm.description || null,
          imageUrl,
          altText: editForm.altText || null,
        }),
      })

      if (res.ok) {
        toast({ title: 'Image modifiée' })
        setEditDialogOpen(false)
        fetchImages()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de modifier l\'image.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    try {
      const res = await authFetch(`/api/images?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Image supprimée' })
        fetchImages()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
    }
  }

  const openEditDialog = (image: SiteImage) => {
    setEditingImage(image)
    setEditForm({
      key: image.key,
      category: image.category,
      title: image.title,
      description: image.description || '',
      altText: image.altText || '',
    })
    setEditFile(null)
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
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Images</h1>
        <p className="text-gray-500 mt-1">Gérez les images du site</p>
      </div>

      {/* Add Image Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="size-5 text-[#00A651]" />
            Ajouter une image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Clé *</Label>
              <Input
                placeholder="ex: hero-banner"
                value={newImage.key}
                onChange={(e) => setNewImage({ ...newImage, key: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={newImage.category}
                onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
              >
                {imageCategories.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Titre de l'image"
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Description (optionnel)"
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fichier image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Texte alternatif</Label>
              <Input
                placeholder="Alt text"
                value={newImage.altText}
                onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
              />
            </div>
          </div>
          <Button
            onClick={handleAddImage}
            disabled={saving}
            className="bg-[#00A651] hover:bg-[#008541]"
          >
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* Images by category */}
      {imageCategories.map((cat) => {
        const catImages = images.filter((img) => img.category === cat.key)
        if (catImages.length === 0) return null

        return (
          <Card key={cat.key} className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {cat.label}
                <Badge variant="secondary">{catImages.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catImages.map((image) => (
                  <div key={image.id} className="border rounded-lg p-3 space-y-2">
                    <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.altText || image.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{image.title}</p>
                      <p className="text-xs text-gray-500">{image.key}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(image)}
                        className="flex-1"
                      >
                        <Pencil className="size-3 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clé</Label>
                <Input
                  value={editForm.key}
                  onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  {imageCategories.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Texte alternatif</Label>
                <Input
                  value={editForm.altText}
                  onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Nouvelle image (laisser vide pour garder l&apos;actuelle)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditImage} disabled={saving} className="bg-[#00A651] hover:bg-[#008541]">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
