'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/auth-client'

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

const mainCategories = [
  { value: 'automobile', label: 'Automobile' },
  { value: 'agroalimentaire', label: 'Agro-alimentaire' },
]

const subcategories: Record<string, { value: string; label: string }[]> = {
  automobile: [
    { value: 'pneus', label: 'Pneus' },
    { value: 'huiles', label: 'Huiles Moteurs' },
    { value: 'accessoires', label: 'Accessoires Auto' },
  ],
  agroalimentaire: [
    { value: 'alimentation', label: 'Produits Alimentaires' },
    { value: 'boissons', label: 'Boissons' },
    { value: 'cereales', label: 'Céréales & Grains' },
  ],
}

const categoryLabels: Record<string, string> = {
  pneus: 'Pneus',
  huiles: 'Huiles Moteurs',
  accessoires: 'Accessoires Auto',
  alimentation: 'Produits Alimentaires',
  boissons: 'Boissons',
  cereales: 'Céréales & Grains',
}

interface ProductForm {
  mainCategory: string
  subcategory: string
  title: string
  description: string
  variants: string
  imageFile: File | null
}

const emptyForm: ProductForm = {
  mainCategory: 'automobile',
  subcategory: 'pneus',
  title: '',
  description: '',
  variants: '',
  imageFile: null,
}

export default function ProductManager() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ProductForm>({ ...emptyForm })

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<ProductForm>({ ...emptyForm })

  const fetchProducts = useCallback(async () => {
    try {
      const res = await authFetch('/api/products?all=true')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddProduct = async () => {
    if (!form.title) {
      toast({ title: 'Erreur', description: 'Le titre est requis.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      let imageUrl = ''
      if (form.imageFile) {
        const formData = new FormData()
        formData.append('file', form.imageFile)
        formData.append('category', form.subcategory)
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await authFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.subcategory,
          subcategory: form.mainCategory,
          title: form.title,
          description: form.description || null,
          imageUrl: imageUrl || null,
          variants: form.variants || null,
          order: 0,
        }),
      })

      if (res.ok) {
        toast({ title: 'Produit ajouté', description: 'Le produit a été créé avec succès.' })
        setForm({ ...emptyForm })
        setShowAddForm(false)
        fetchProducts()
      } else {
        const data = await res.json()
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'ajouter le produit.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct || !editForm.title) return

    setSaving(true)
    try {
      let imageUrl = editingProduct.imageUrl || ''
      if (editForm.imageFile) {
        const formData = new FormData()
        formData.append('file', editForm.imageFile)
        formData.append('category', 'edit-product')
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await authFetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          category: editForm.subcategory,
          subcategory: editForm.mainCategory,
          title: editForm.title,
          description: editForm.description || null,
          imageUrl: imageUrl || null,
          variants: editForm.variants || null,
        }),
      })

      if (res.ok) {
        toast({ title: 'Produit modifié', description: 'Le produit a été mis à jour.' })
        setEditDialogOpen(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de modifier le produit.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      const res = await authFetch(`/api/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Produit supprimé' })
        fetchProducts()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const mainCat = product.subcategory || 'automobile'
    const sub = product.category
    setEditForm({
      mainCategory: mainCat,
      subcategory: sub,
      title: product.title,
      description: product.description || '',
      variants: product.variants || '',
      imageFile: null,
    })
    setEditDialogOpen(true)
  }

  const autoProducts = products.filter((p) => p.subcategory === 'automobile')
  const agroProducts = products.filter((p) => p.subcategory === 'agroalimentaire')

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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Produits</h1>
          <p className="text-gray-500 mt-1">Gérez vos produits</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#00A651] hover:bg-[#008541]"
        >
          {showAddForm ? <ChevronUp className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
          Ajouter un produit
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Nouveau produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie principale</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={form.mainCategory}
                  onChange={(e) => {
                    const mainCat = e.target.value
                    setForm({
                      ...form,
                      mainCategory: mainCat,
                      subcategory: subcategories[mainCat]?.[0]?.value || '',
                    })
                  }}
                >
                  {mainCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sous-catégorie</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                >
                  {(subcategories[form.mainCategory] || []).map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nom du produit"
                />
              </div>
              <div className="space-y-2">
                <Label>Variants (séparés par des virgules)</Label>
                <Input
                  value={form.variants}
                  onChange={(e) => setForm({ ...form, variants: e.target.value })}
                  placeholder="ex: 195/65R15, 205/55R16"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description du produit"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>
            <Button
              onClick={handleAddProduct}
              disabled={saving}
              className="bg-[#00A651] hover:bg-[#008541]"
            >
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
              Ajouter le produit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Automobile Products */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Automobile
            <Badge variant="secondary">{autoProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {autoProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun produit automobile</p>
          ) : (
            <div className="space-y-4">
              {autoProducts.map((product) => (
                <div key={product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {product.imageUrl && (
                      <Image src={product.imageUrl} alt={product.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{product.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs bg-[#00A651]/10 text-[#00A651]">
                            {categoryLabels[product.category] || product.category}
                          </Badge>
                          {product.variants && product.variants.split(',').map((v, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{v.trim()}</Badge>
                          ))}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(product)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
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

      {/* Agro-alimentaire Products */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Agro-alimentaire
            <Badge variant="secondary">{agroProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agroProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun produit agro-alimentaire</p>
          ) : (
            <div className="space-y-4">
              {agroProducts.map((product) => (
                <div key={product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {product.imageUrl && (
                      <Image src={product.imageUrl} alt={product.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{product.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs bg-[#00A651]/10 text-[#00A651]">
                            {categoryLabels[product.category] || product.category}
                          </Badge>
                          {product.variants && product.variants.split(',').map((v, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{v.trim()}</Badge>
                          ))}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(product)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
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
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie principale</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={editForm.mainCategory}
                  onChange={(e) => {
                    const mainCat = e.target.value
                    setEditForm({
                      ...editForm,
                      mainCategory: mainCat,
                      subcategory: subcategories[mainCat]?.[0]?.value || '',
                    })
                  }}
                >
                  {mainCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sous-catégorie</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={editForm.subcategory}
                  onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                >
                  {(subcategories[editForm.mainCategory] || []).map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Variants</Label>
                <Input
                  value={editForm.variants}
                  onChange={(e) => setEditForm({ ...editForm, variants: e.target.value })}
                  placeholder="séparés par des virgules"
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
              <div className="space-y-2 sm:col-span-2">
                <Label>Nouvelle image (laisser vide pour garder l&apos;actuelle)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, imageFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditProduct} disabled={saving} className="bg-[#00A651] hover:bg-[#008541]">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
