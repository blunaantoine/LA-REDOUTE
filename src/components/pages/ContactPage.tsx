'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle, Building, Car, Wheat, Info, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useNavigation } from '@/context/NavigationContext'
import { useToast } from '@/hooks/use-toast'

interface ContactPageProps {
  content: Record<string, string>
}

export default function ContactPage({ content }: ContactPageProps) {
  const { navigateTo } = useNavigation()
  const { toast } = useToast()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject || null,
          message: formState.message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message.')
      }

      setSent(true)
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' })

      toast({
        title: 'Message envoyé !',
        description: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
        duration: 5000,
      })

      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setError(errorMessage)
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setSending(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+228 22 25 18 98 (Fixe)', '+228 92 50 19 44 (WhatsApp)'],
      action: 'tel:+22822251898',
      actionLabel: 'Appeler',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@laredoutesarl.com'],
      action: 'mailto:contact@laredoutesarl.com',
      actionLabel: 'Envoyer un email',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Lomé, Togo'],
      action: null,
      actionLabel: null,
    },
    {
      icon: Clock,
      title: 'Heures d\'ouverture',
      details: ['Lun - Ven: 8h00 - 18h00', 'Sam: 8h00 - 13h00'],
      action: null,
      actionLabel: null,
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <section className="relative py-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="pattern-bg w-full h-full" />
        </div>
        <div className="absolute top-10 right-20 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute bottom-10 left-20 w-32 h-32 border border-white/10 rotate-45" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
            onClick={() => navigateTo('accueil')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour à l&apos;accueil
          </Button>
          <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-4 py-2 text-sm mb-4">
            Contact
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Contactez-Nous
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mt-4">
            {content['cta-description'] || "Nous sommes à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets."}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="border-0 shadow-md card-hover">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-[#00A651]/10 rounded-xl flex items-center justify-center mx-auto">
                    <info.icon className="size-6 text-[#00A651]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a]">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-gray-600">{detail}</p>
                  ))}
                  {info.action && (
                    <a
                      href={info.action}
                      className="inline-flex items-center text-sm text-[#00A651] hover:underline font-medium"
                    >
                      {info.actionLabel}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Bank Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                      <Send className="size-5 text-[#00A651]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#1a1a1a]">Envoyez-nous un message</h2>
                      <p className="text-sm text-gray-500">Nous vous répondrons dans les plus brefs délais</p>
                    </div>
                  </div>

                  {sent && (
                    <div className="mb-6 p-4 bg-[#00A651]/10 border border-[#00A651]/20 rounded-lg flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-[#00A651] mt-0.5 shrink-0" />
                      <p className="text-[#00A651] font-medium">Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.</p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Votre nom"
                          required
                          disabled={sending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="votre@email.com"
                          required
                          disabled={sending}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="+228 XX XX XX XX"
                          disabled={sending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Input
                          id="subject"
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          placeholder="Objet de votre message"
                          disabled={sending}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Décrivez votre demande..."
                        rows={5}
                        required
                        disabled={sending}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-[#00A651] hover:bg-[#008541] text-white w-full sm:w-auto btn-primary-hover"
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 size-4" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Bank Info & WhatsApp */}
            <div className="space-y-6">
              {/* Bank Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                      <Building className="size-5 text-[#00A651]" />
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a]">Coordonnées Bancaires</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-[#1a1a1a]">UTB</p>
                      <p className="text-gray-600">Compte: 322114950004000</p>
                      <p className="text-gray-600">Devise: XOF</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="border-0 shadow-lg bg-[#25D366]">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="size-8" />
                    <div>
                      <h3 className="font-semibold">WhatsApp</h3>
                      <p className="text-white/80 text-sm">Réponse rapide</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    Pour une réponse rapide, contactez-nous directement sur WhatsApp.
                  </p>
                  <Button
                    className="w-full bg-white text-[#25D366] hover:bg-white/90 font-semibold"
                    asChild
                  >
                    <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                      Ouvrir WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4">Liens rapides</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('automobile')}
                    >
                      <Car className="mr-2 size-4" />
                      Produits Automobile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('agroalimentaire')}
                    >
                      <Wheat className="mr-2 size-4" />
                      Produits Agro-alimentaire
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('about')}
                    >
                      <Info className="mr-2 size-4" />
                      À Propos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
