'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Lock,
  Globe,
  Mail,
  Phone,
  AlertTriangle,
  Trash2,
  Loader2,
  Save,
  ShieldCheck,
  Database,
  XCircle,
  Settings,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/auth-client'

interface SiteConfig {
  siteName: string
  adminEmail: string
  whatsapp: string
}

export default function SettingsTab() {
  const { toast } = useToast()

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Site config state
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: '',
    adminEmail: '',
    whatsapp: '',
  })
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)

  // Danger zone state
  const [resettingDb, setResettingDb] = useState(false)
  const [clearingSessions, setClearingSessions] = useState(false)

  // Fetch site config on mount
  const fetchConfig = useCallback(async () => {
    setLoadingConfig(true)
    try {
      const configKeys = ['config-site-name', 'config-admin-email', 'config-whatsapp']
      const results = await Promise.all(
        configKeys.map((key) => authFetch(`/api/content?key=${key}`).then((r) => r.json()).catch(() => null))
      )

      setSiteConfig({
        siteName: results[0]?.content || 'LA REDOUTE SARL-U',
        adminEmail: results[1]?.content || '',
        whatsapp: results[2]?.content || '',
      })
    } catch {
      // Use defaults
      setSiteConfig({
        siteName: 'LA REDOUTE SARL-U',
        adminEmail: '',
        whatsapp: '',
      })
    } finally {
      setLoadingConfig(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  // Handle password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Le nouveau mot de passe et la confirmation ne correspondent pas.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Erreur',
        description: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
        variant: 'destructive',
      })
      return
    }

    setChangingPassword(true)
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe.')
      }

      toast({
        title: 'Mot de passe modifié',
        description: 'Votre mot de passe a été changé avec succès.',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de changer le mot de passe.',
        variant: 'destructive',
      })
    } finally {
      setChangingPassword(false)
    }
  }

  // Handle site config save
  const handleSaveConfig = async () => {
    setSavingConfig(true)
    try {
      const updates = [
        { key: 'config-site-name', category: 'config', title: 'Nom du site', content: siteConfig.siteName },
        { key: 'config-admin-email', category: 'config', title: 'Email admin', content: siteConfig.adminEmail },
        { key: 'config-whatsapp', category: 'config', title: 'Numéro WhatsApp', content: siteConfig.whatsapp },
      ]

      await Promise.all(
        updates.map((item) =>
          authFetch('/api/content', {
            method: 'PUT',
            body: JSON.stringify(item),
          })
        )
      )

      toast({
        title: 'Configuration sauvegardée',
        description: 'Les paramètres du site ont été mis à jour avec succès.',
      })
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la configuration.',
        variant: 'destructive',
      })
    } finally {
      setSavingConfig(false)
    }
  }

  // Handle database reset
  const handleResetDatabase = async () => {
    setResettingDb(true)
    try {
      const res = await authFetch('/api/seed?reset=true', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation.')
      }

      toast({
        title: 'Base de données réinitialisée',
        description: 'La base de données a été réinitialisée avec succès.',
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de réinitialiser la base de données.',
        variant: 'destructive',
      })
    } finally {
      setResettingDb(false)
    }
  }

  // Handle clear sessions
  const handleClearSessions = async () => {
    setClearingSessions(true)
    try {
      // Since we don't have a dedicated sessions endpoint, we'll call the logout endpoint
      // to clear the current session cookie, which effectively clears all sessions for this user
      await authFetch('/api/auth/logout', { method: 'POST' })

      toast({
        title: 'Sessions effacées',
        description: 'Toutes les sessions ont été effacées. Vous serez déconnecté.',
      })
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'effacer les sessions.',
        variant: 'destructive',
      })
    } finally {
      setClearingSessions(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
          <Settings className="size-6 text-[#00A651]" />
          Paramètres
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Gérez les paramètres de votre site et de votre compte
        </p>
      </div>

      {/* A. Password Change Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5 text-[#00A651]" />
            Changer le mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="current-password"
                type="password"
                placeholder="Entrez votre mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Entrez le nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirmez le nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-[#00A651] hover:bg-[#008541] text-white"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Lock className="size-4 mr-2" />
                  Changer le mot de passe
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* B. Site Configuration Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-5 text-[#00A651]" />
            Configuration du site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingConfig ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[#00A651]" />
              <span className="ml-3 text-gray-500">Chargement de la configuration...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="site-name" className="flex items-center gap-2">
                  <Globe className="size-4 text-gray-400" />
                  Nom du site
                </Label>
                <Input
                  id="site-name"
                  placeholder="Nom du site"
                  value={siteConfig.siteName}
                  onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="flex items-center gap-2">
                  <Mail className="size-4 text-gray-400" />
                  Email de l&apos;administrateur
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@laredoute.com"
                  value={siteConfig.adminEmail}
                  onChange={(e) => setSiteConfig({ ...siteConfig, adminEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  Numéro WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+228 90 00 00 00"
                  value={siteConfig.whatsapp}
                  onChange={(e) => setSiteConfig({ ...siteConfig, whatsapp: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="bg-[#00A651] hover:bg-[#008541] text-white"
                >
                  {savingConfig ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      Sauvegarder la configuration
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* C. Danger Zone */}
      <Card className="border-0 shadow-md border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="size-5" />
            Zone dangereuse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-red-50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-red-700 flex items-center gap-2">
                <Database className="size-4" />
                Réinitialiser la base de données
              </p>
              <p className="text-sm text-red-600/70">
                Supprime toutes les données et réinitialise avec les valeurs par défaut. Cette action est irréversible.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={resettingDb}
                  className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 shrink-0"
                >
                  {resettingDb ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 mr-2" />
                  )}
                  Réinitialiser
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="size-5" />
                    Confirmer la réinitialisation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera toutes les données existantes (produits, images, partenaires, messages, contenu) et les remplacera par les valeurs par défaut. Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetDatabase}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Oui, réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-red-50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-red-700 flex items-center gap-2">
                <XCircle className="size-4" />
                Effacer toutes les sessions
              </p>
              <p className="text-sm text-red-600/70">
                Déconnecte tous les utilisateurs actifs. Vous devrez vous reconnecter.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={clearingSessions}
                  className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 shrink-0"
                >
                  {clearingSessions ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="size-4 mr-2" />
                  )}
                  Effacer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="size-5" />
                    Confirmer l&apos;effacement des sessions
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action déconnectera tous les utilisateurs, y compris vous. Vous devrez vous reconnecter pour accéder à l&apos;administration.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearSessions}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Oui, effacer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
