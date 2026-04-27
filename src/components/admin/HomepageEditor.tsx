'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, FileText, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

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

const contentSections = [
  { key: 'hero', label: 'Hero', keys: ['hero-badge', 'hero-title', 'hero-subtitle', 'hero-description'] },
  { key: 'about', label: 'À Propos', keys: ['about-title', 'about-description', 'about-mission', 'about-vision'] },
  { key: 'products', label: 'Produits', keys: ['products-title', 'auto-description', 'agro-description'] },
  { key: 'cta', label: 'CTA', keys: ['cta-title', 'cta-description'] },
  { key: 'values', label: 'Valeurs', keys: ['values-title'] },
]

const imageCategories = [
  { key: 'logo', label: 'Logos' },
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'À Propos' },
  { key: 'product', label: 'Produits' },
  { key: 'partner', label: 'Partenaires' },
  { key: 'general', label: 'Général' },
]

export default function HomepageEditor() {
  const { toast } = useToast()
  const [contents, setContents] = useState<SiteContent[]>([])
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editedContents, setEditedContents] = useState<Record<string, string>>({})

  // New image form
  const [newImage, setNewImage] = useState({
    key: '',
    category: 'general',
    title: '',
    description: '',
    altText: '',
  })
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [addingImage, setAddingImage] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [contentRes, imagesRes] = await Promise.all([
        fetch('/api/content?category=homepage'),
        fetch('/api/images'),
      ])
      const contentData = await contentRes.json()
      const imageData = await imagesRes.json()
      setContents(Array.isArray(contentData) ? contentData : [])
      setImages(Array.isArray(imageData) ? imageData : [])

      const edited: Record<string, string> = {}
      if (Array.isArray(contentData)) {
        contentData.forEach((c: SiteContent) => { edited[c.key] = c.content })
      }
      setEditedContents(edited)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveContent = async (key: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: editedContents[key] }),
      })
      if (res.ok) {
        toast({ title: 'Contenu sauvegardé', description: `Le contenu "${key}" a été mis à jour.` })
        fetchData()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de sauvegarder le contenu.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(null)
    }
  }

  const handleAddImage = async () => {
    if (!newImage.key || !newImage.title) {
      toast({ title: 'Erreur', description: 'La clé et le titre sont requis.', variant: 'destructive' })
      return
    }

    setAddingImage(true)
    try {
      let imageUrl = ''

      if (uploadFile) {
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('category', newImage.category)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        } else {
          throw new Error('Upload failed')
        }
      }

      const res = await fetch('/api/images', {
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
        toast({ title: 'Image ajoutée', description: 'La nouvelle image a été créée.' })
        setNewImage({ key: '', category: 'general', title: '', description: '', altText: '' })
        setUploadFile(null)
        fetchData()
      } else {
        const data = await res.json()
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'ajouter l\'image.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout.', variant: 'destructive' })
    } finally {
      setAddingImage(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    try {
      const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Image supprimée' })
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
    }
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
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Page d&apos;accueil</h1>
        <p className="text-gray-500 mt-1">Gérez le contenu et les images de la page d&apos;accueil</p>
      </div>

      <Tabs defaultValue="textes">
        <TabsList>
          <TabsTrigger value="textes">
            <FileText className="size-4 mr-2" />
            Textes
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="size-4 mr-2" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="textes" className="space-y-6 mt-6">
          {contentSections.map((section) => {
            const sectionContents = contents.filter((c) => section.keys.includes(c.key))
            if (sectionContents.length === 0) return null

            return (
              <Card key={section.key} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionContents.map((content) => (
                    <div key={content.id} className="space-y-2">
                      <Label htmlFor={content.key} className="text-sm font-medium text-gray-700">
                        {content.key}
                      </Label>
                      {content.content.length > 100 ? (
                        <Textarea
                          id={content.key}
                          value={editedContents[content.key] ?? content.content}
                          onChange={(e) =>
                            setEditedContents((prev) => ({ ...prev, [content.key]: e.target.value }))
                          }
                          rows={3}
                          className="resize-none"
                        />
                      ) : (
                        <Input
                          id={content.key}
                          value={editedContents[content.key] ?? content.content}
                          onChange={(e) =>
                            setEditedContents((prev) => ({ ...prev, [content.key]: e.target.value }))
                          }
                        />
                      )}
                      <Button
                        size="sm"
                        onClick={() => saveContent(content.key)}
                        disabled={saving === content.key}
                        className="bg-[#00A651] hover:bg-[#008541]"
                      >
                        {saving === content.key ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Save className="size-4 mr-1" />
                        )}
                        Sauvegarder
                      </Button>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="images" className="space-y-6 mt-6">
          {/* Add new image */}
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
                  <Label>Clé</Label>
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
                  <Label>Titre</Label>
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
                    placeholder="Alt text (optionnel)"
                    value={newImage.altText}
                    onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddImage}
                disabled={addingImage}
                className="bg-[#00A651] hover:bg-[#008541]"
              >
                {addingImage ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
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
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                          className="w-full"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
