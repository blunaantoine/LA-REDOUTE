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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Loader2, Save, FileText, Image as ImageIcon, Plus, Trash2, Zap, X } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/auth-client'

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
  {
    key: 'accueil',
    label: 'Page d\'accueil',
    keys: ['hero-badge', 'hero-title', 'hero-subtitle', 'hero-description', 'products-title', 'auto-description', 'agro-description', 'values-title', 'cta-title', 'cta-description'],
  },
  {
    key: 'automobile',
    label: 'Page Automobile',
    keys: ['auto-description', 'auto-page-title', 'auto-page-subtitle'],
  },
  {
    key: 'agroalimentaire',
    label: 'Page Agro-alimentaire',
    keys: ['agro-description', 'agro-page-title', 'agro-page-subtitle'],
  },
  {
    key: 'about',
    label: 'Page À Propos',
    keys: ['about-title', 'about-description', 'about-mission', 'about-vision', 'about-story', 'about-story2'],
  },
  {
    key: 'contact',
    label: 'Page Contact',
    keys: ['cta-title', 'cta-description', 'contact-info'],
  },
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
  const [quickEditMode, setQuickEditMode] = useState(false)

  // Quick edit popover state
  const [quickEditKey, setQuickEditKey] = useState<string | null>(null)
  const [quickEditValue, setQuickEditValue] = useState('')
  const [quickEditSaving, setQuickEditSaving] = useState(false)

  // New content form
  const [newContent, setNewContent] = useState({ key: '', category: 'homepage', title: '', content: '' })
  const [addingContent, setAddingContent] = useState(false)

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
        authFetch('/api/content'),
        authFetch('/api/images'),
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
      const res = await authFetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: editedContents[key] }),
      })
      if (res.ok) {
        toast({ title: 'Contenu sauvegardé', description: `Le contenu "${key}" a été mis à jour.` })
        fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 401) {
          toast({ title: 'Session expirée', description: 'Veuillez vous reconnecter.', variant: 'destructive' })
        } else {
          toast({ title: 'Erreur', description: data.error || 'Impossible de sauvegarder le contenu.', variant: 'destructive' })
        }
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(null)
    }
  }

  // Quick edit save
  const handleQuickEditSave = async (key: string) => {
    setQuickEditSaving(true)
    try {
      const res = await authFetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: quickEditValue }),
      })
      if (res.ok) {
        toast({ title: 'Contenu sauvegardé', description: `Le contenu "${key}" a été mis à jour.` })
        setEditedContents((prev) => ({ ...prev, [key]: quickEditValue }))
        setQuickEditKey(null)
        fetchData()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setQuickEditSaving(false)
    }
  }

  const openQuickEdit = (content: SiteContent) => {
    setQuickEditKey(content.key)
    setQuickEditValue(editedContents[content.key] ?? content.content)
  }

  const handleAddContent = async () => {
    if (!newContent.key || !newContent.content) {
      toast({ title: 'Erreur', description: 'La clé et le contenu sont requis.', variant: 'destructive' })
      return
    }
    setAddingContent(true)
    try {
      const res = await authFetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newContent.key,
          category: newContent.category,
          title: newContent.title || null,
          content: newContent.content,
        }),
      })
      if (res.ok) {
        toast({ title: 'Contenu ajouté', description: 'Le nouveau contenu a été créé.' })
        setNewContent({ key: '', category: 'homepage', title: '', content: '' })
        fetchData()
      } else {
        const data = await res.json()
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'ajouter le contenu.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setAddingContent(false)
    }
  }

  const handleDeleteContent = async (key: string) => {
    if (!confirm(`Supprimer le contenu "${key}" ?`)) return
    try {
      const res = await authFetch(`/api/content?key=${key}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Contenu supprimé' })
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
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
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        } else {
          throw new Error('Upload failed')
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
      const res = await authFetch(`/api/images?id=${id}`, { method: 'DELETE' })
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Pages du site</h1>
          <p className="text-gray-500 mt-1">Gérez le contenu et les images de chaque page</p>
        </div>
        {/* Quick Edit Toggle */}
        <Button
          variant={quickEditMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickEditMode(!quickEditMode)}
          className={`gap-2 ${quickEditMode ? 'bg-[#00A651] hover:bg-[#008541]' : ''}`}
        >
          <Zap className={`size-4 ${quickEditMode ? 'text-white' : 'text-[#00A651]'}`} />
          {quickEditMode ? 'Quick Edit ON' : 'Quick Edit'}
        </Button>
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
          {/* Add new content */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="size-5 text-[#00A651]" />
                Ajouter un contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Clé (unique)</Label>
                  <Input
                    placeholder="ex: about-story"
                    value={newContent.key}
                    onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (optionnel)</Label>
                  <Input
                    placeholder="Titre descriptif"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Contenu</Label>
                  <Textarea
                    placeholder="Le texte à afficher..."
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddContent}
                disabled={addingContent}
                className="bg-[#00A651] hover:bg-[#008541]"
              >
                {addingContent ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
                Ajouter
              </Button>
            </CardContent>
          </Card>

          {/* Content sections by page */}
          {contentSections.map((section) => {
            const sectionContents = contents.filter((c) => section.keys.includes(c.key))

            return (
              <Card key={section.key} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {section.label}
                    <Badge variant="secondary">{sectionContents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionContents.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4">Aucun contenu pour cette page</p>
                  ) : (
                    sectionContents.map((content) => (
                      <div key={content.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={content.key} className="text-sm font-medium text-gray-700">
                            {content.key}
                            {content.title && <span className="text-gray-400 font-normal ml-2">({content.title})</span>}
                          </Label>
                          <div className="flex items-center gap-1">
                            {/* Quick Edit button (only in quick edit mode) */}
                            {quickEditMode && (
                              <Popover
                                open={quickEditKey === content.key}
                                onOpenChange={(open) => {
                                  if (open) {
                                    openQuickEdit(content)
                                  } else {
                                    setQuickEditKey(null)
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[#00A651] hover:text-[#008541] hover:bg-[#00A651]/10"
                                  >
                                    <Zap className="size-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3" align="end">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-700">{content.key}</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="size-6 p-0"
                                        onClick={() => setQuickEditKey(null)}
                                      >
                                        <X className="size-3" />
                                      </Button>
                                    </div>
                                    {content.content.length > 100 ? (
                                      <Textarea
                                        value={quickEditValue}
                                        onChange={(e) => setQuickEditValue(e.target.value)}
                                        rows={4}
                                        className="resize-none text-sm"
                                        autoFocus
                                      />
                                    ) : (
                                      <Input
                                        value={quickEditValue}
                                        onChange={(e) => setQuickEditValue(e.target.value)}
                                        className="text-sm"
                                        autoFocus
                                      />
                                    )}
                                    <Button
                                      size="sm"
                                      onClick={() => handleQuickEditSave(content.key)}
                                      disabled={quickEditSaving}
                                      className="w-full bg-[#00A651] hover:bg-[#008541]"
                                    >
                                      {quickEditSaving ? (
                                        <Loader2 className="size-3.5 animate-spin mr-1" />
                                      ) : (
                                        <Save className="size-3.5 mr-1" />
                                      )}
                                      Sauvegarder
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(content.key)}
                              className="text-red-400 hover:text-red-600 h-7 px-2"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
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
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Other uncategorized content */}
          {(() => {
            const allKeys = contentSections.flatMap(s => s.keys)
            const otherContents = contents.filter(c => !allKeys.includes(c.key))
            if (otherContents.length === 0) return null
            return (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Autres contenus
                    <Badge variant="secondary">{otherContents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {otherContents.map((content) => (
                    <div key={content.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={content.key} className="text-sm font-medium text-gray-700">
                          {content.key}
                        </Label>
                        <div className="flex items-center gap-1">
                          {quickEditMode && (
                            <Popover
                              open={quickEditKey === content.key}
                              onOpenChange={(open) => {
                                if (open) {
                                  openQuickEdit(content)
                                } else {
                                  setQuickEditKey(null)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[#00A651] hover:text-[#008541] hover:bg-[#00A651]/10"
                                >
                                  <Zap className="size-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3" align="end">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">{content.key}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="size-6 p-0"
                                      onClick={() => setQuickEditKey(null)}
                                    >
                                      <X className="size-3" />
                                    </Button>
                                  </div>
                                  {content.content.length > 100 ? (
                                    <Textarea
                                      value={quickEditValue}
                                      onChange={(e) => setQuickEditValue(e.target.value)}
                                      rows={4}
                                      className="resize-none text-sm"
                                      autoFocus
                                    />
                                  ) : (
                                    <Input
                                      value={quickEditValue}
                                      onChange={(e) => setQuickEditValue(e.target.value)}
                                      className="text-sm"
                                      autoFocus
                                    />
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickEditSave(content.key)}
                                    disabled={quickEditSaving}
                                    className="w-full bg-[#00A651] hover:bg-[#008541]"
                                  >
                                    {quickEditSaving ? (
                                      <Loader2 className="size-3.5 animate-spin mr-1" />
                                    ) : (
                                      <Save className="size-3.5 mr-1" />
                                    )}
                                    Sauvegarder
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(content.key)}
                            className="text-red-400 hover:text-red-600 h-7 px-2"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
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
          })()}
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
