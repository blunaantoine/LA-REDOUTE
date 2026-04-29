'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
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

// All subcategory options for the filter
const allSubcategoryFilters = [
  { value: 'all', label: 'Toutes les sous-catégories' },
  { value: 'pneus', label: 'Pneus' },
  { value: 'huiles', label: 'Huiles Moteurs' },
  { value: 'accessoires', label: 'Accessoires Auto' },
  { value: 'alimentation', label: 'Produits Alimentaires' },
  { value: 'boissons', label: 'Boissons' },
  { value: 'cereales', label: 'Céréales & Grains' },
]

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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')
  const [showInactive, setShowInactive] = useState(false)

  // Reorder loading state
  const [reorderingId, setReorderingId] = useState<string | null>(null)

  // Toggle active loading state
  const [togglingId, setTogglingId] = useState<string | null>(null)

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

  // Filter products based on search, category, subcategory, and active status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter (title + description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = p.title.toLowerCase().includes(query)
        const descMatch = p.description?.toLowerCase().includes(query) || false
        if (!titleMatch && !descMatch) return false
      }

      // Category filter
      if (categoryFilter !== 'all' && p.subcategory !== categoryFilter) return false

      // Subcategory filter
      if (subcategoryFilter !== 'all' && p.category !== subcategoryFilter) return false

      // Active/inactive filter
      if (!showInactive && !p.isActive) return false

      return true
    })
  }, [products, searchQuery, categoryFilter, subcategoryFilter, showInactive])

  const autoProducts = filteredProducts.filter((p) => p.subcategory === 'automobile')
  const agroProducts = filteredProducts.filter((p) => p.subcategory === 'agroalimentaire')

  // Reorder handler
  const handleReorder = async (product: Product, direction: 'up' | 'down', categoryGroup: Product[]) => {
    const sortedGroup = [...categoryGroup].sort((a, b) => a.order - b.order)
    const currentIndex = sortedGroup.findIndex((p) => p.id === product.id)

    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sortedGroup.length - 1) return

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapProduct = sortedGroup[swapIndex]

    if (!swapProduct) return

    setReorderingId(product.id)
    try {
      // Swap order values
      const [res1, res2] = await Promise.all([
        authFetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: product.id, order: swapProduct.order }),
        }),
        authFetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swapProduct.id, order: product.order }),
        }),
      ])

      if (res1.ok && res2.ok) {
        toast({ title: 'Ordre mis à jour' })
        fetchProducts()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de réordonner.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setReorderingId(null)
    }
  }

  // Toggle active status handler
  const handleToggleActive = async (product: Product) => {
    setTogglingId(product.id)
    try {
      const res = await authFetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isActive: !product.isActive }),
      })

      if (res.ok) {
        toast({
          title: product.isActive ? 'Produit désactivé' : 'Produit activé',
          description: product.isActive
            ? 'Le produit n\'apparaîtra plus sur le site.'
            : 'Le produit est maintenant visible sur le site.',
        })
        fetchProducts()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de modifier le statut.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setTogglingId(null)
    }
  }

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

  // Render product row with reorder + toggle controls
  const renderProductRow = (product: Product, index: number, group: Product[]) => {
    const isReordering = reorderingId === product.id
    const isToggling = togglingId === product.id

    return (
      <div
        key={product.id}
        className={`flex gap-4 p-4 rounded-lg transition-opacity ${
          product.isActive ? 'bg-gray-50' : 'bg-gray-50/50 opacity-60'
        }`}
      >
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
          {product.imageUrl && (
            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" unoptimized />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-medium ${product.isActive ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
                  {product.title}
                </p>
                {!product.isActive && (
                  <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-500">
                    Inactif
                  </Badge>
                )}
              </div>
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
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Active toggle */}
              <div className="flex items-center gap-1.5 mr-1">
                {isToggling ? (
                  <Loader2 className="size-4 animate-spin text-[#00A651]" />
                ) : (
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={() => handleToggleActive(product)}
                    className={`data-[state=checked]:bg-[#00A651] data-[state=unchecked]:bg-gray-300`}
                  />
                )}
              </div>

              {/* Reorder buttons */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleReorder(product, 'up', group)}
                disabled={isReordering || index === 0}
                className="size-8"
                title="Monter"
              >
                {isReordering ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowUp className="size-3.5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleReorder(product, 'down', group)}
                disabled={isReordering || index === group.length - 1}
                className="size-8"
                title="Descendre"
              >
                {isReordering ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowDown className="size-3.5" />}
              </Button>

              {/* Edit & Delete */}
              <Button size="icon" variant="ghost" onClick={() => openEditDialog(product)} className="size-8">
                <Pencil className="size-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDeleteProduct(product.id)} className="size-8">
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#00A651]" />
      </div>
    )
  }

  const totalActive = products.filter((p) => p.isActive).length
  const totalInactive = products.filter((p) => !p.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Produits</h1>
          <p className="text-gray-500 mt-1">
            {totalActive} actif{totalActive !== 1 ? 's' : ''} · {totalInactive} inactif{totalInactive !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#00A651] hover:bg-[#008541]"
        >
          {showAddForm ? <ChevronUp className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
          Ajouter un produit
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Category filter */}
            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value)
              setSubcategoryFilter('all')
            }}>
              <SelectTrigger className="w-full sm:w-[180px] h-9">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="automobile">Automobile</SelectItem>
                <SelectItem value="agroalimentaire">Agro-alimentaire</SelectItem>
              </SelectContent>
            </Select>

            {/* Subcategory filter */}
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-9">
                <SelectValue placeholder="Sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {allSubcategoryFilters
                  .filter((sub) => {
                    if (categoryFilter === 'all') return true
                    const categorySubs = subcategories[categoryFilter]?.map((s) => s.value) || []
                    return sub.value === 'all' || categorySubs.includes(sub.value)
                  })
                  .map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Show inactive toggle */}
            <div className="flex items-center gap-2 px-3 h-9 rounded-md border border-input bg-transparent">
              {showInactive ? (
                <Eye className="size-4 text-[#00A651]" />
              ) : (
                <EyeOff className="size-4 text-gray-400" />
              )}
              <Label htmlFor="show-inactive" className="text-sm text-gray-600 cursor-pointer whitespace-nowrap">
                Inactifs
              </Label>
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
                className="data-[state=checked]:bg-[#00A651] data-[state=unchecked]:bg-gray-300"
              />
            </div>
          </div>

          {/* Active filters display */}
          {(searchQuery || categoryFilter !== 'all' || subcategoryFilter !== 'all' || showInactive) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Filtres actifs :</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs gap-1">
                  Recherche: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs gap-1">
                  {categoryFilter === 'automobile' ? 'Automobile' : 'Agro-alimentaire'}
                  <button onClick={() => { setCategoryFilter('all'); setSubcategoryFilter('all') }} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {subcategoryFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs gap-1">
                  {categoryLabels[subcategoryFilter] || subcategoryFilter}
                  <button onClick={() => setSubcategoryFilter('all')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {showInactive && (
                <Badge variant="secondary" className="text-xs gap-1 bg-gray-100">
                  Inactifs visibles
                  <button onClick={() => setShowInactive(false)} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setSubcategoryFilter('all'); setShowInactive(false) }}
                className="text-xs text-[#00A651] hover:underline ml-1"
              >
                Tout effacer
              </button>
            </div>
          )}
        </CardContent>
      </Card>

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
              {autoProducts
                .sort((a, b) => a.order - b.order)
                .map((product, index) => renderProductRow(product, index, autoProducts))}
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
              {agroProducts
                .sort((a, b) => a.order - b.order)
                .map((product, index) => renderProductRow(product, index, agroProducts))}
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
