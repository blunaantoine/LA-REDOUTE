'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle, Building, Car, Wheat, Info, Loader2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import { useNavigation } from '@/context/NavigationContext'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface ContactPageProps {
  content: Record<string, string>
}

const faqItems = [
  {
    question: 'Quels types de produits proposez-vous ?',
    answer: 'Nous proposons des produits automobiles (pneus, huiles moteurs, accessoires) et agro-alimentaires (produits alimentaires, boissons, céréales & grains). Notre catalogue comprend plus de 200 références soigneusement sélectionnées.',
  },
  {
    question: 'Comment passer commande ?',
    answer: "Vous pouvez nous contacter par téléphone, WhatsApp ou via notre formulaire de contact. Nous établissons un devis personnalisé selon vos besoins. Les commandes en gros bénéficient de tarifs préférentiels.",
  },
  {
    question: 'Livrez-vous partout au Togo ?',
    answer: "Oui, nous assurons la livraison sur tout le territoire togolais. Pour les zones reculées, un délai supplémentaire peut être nécessaire. Contactez-nous pour connaître les conditions de livraison dans votre zone.",
  },
  {
    question: 'Quels sont vos modes de paiement ?',
    answer: "Nous acceptons les paiements par virement bancaire (UTB, compte 322114950004000), chèque et espèces. Les conditions de paiement pour les professionnels peuvent être discutées au cas par cas.",
  },
  {
    question: 'Proposez-vous des garanties sur vos produits ?',
    answer: "Oui, tous nos produits sont couverts par la garantie du fabricant. Les conditions varient selon le type de produit. Notre service client est disponible pour vous accompagner en cas de réclamation.",
  },
  {
    question: 'Travaillez-vous avec les entreprises ?',
    answer: "Absolument ! Nous avons une offre dédiée aux professionnels avec des tarifs dégressifs, des conditions de paiement flexibles et un suivi personnalisé. Contactez-nous pour discuter d'un partenariat.",
  },
]

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
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
      <section className="py-6 sm:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="border-0 shadow-md card-hover">
                <CardContent className="p-3 sm:p-6 text-center space-y-1 sm:space-y-3">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#00A651]/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto">
                    <info.icon className="size-4 sm:size-6 text-[#00A651]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] text-xs sm:text-base">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-xs sm:text-sm text-gray-600">{detail}</p>
                  ))}
                  {info.action && (
                    <a
                      href={info.action}
                      className="inline-flex items-center text-xs sm:text-sm text-[#00A651] hover:underline font-medium"
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

      {/* Contact Form + Sidebar */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2 order-last lg:order-first">
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
                      <motion.div
                        animate={{ x: focusedField === 'name' ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="name" className="transition-colors duration-200" style={{ color: focusedField === 'name' ? '#00A651' : undefined }}>Nom complet *</Label>
                        <Input
                          id="name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Votre nom"
                          required
                          disabled={sending}
                          className="transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      </motion.div>
                      <motion.div
                        animate={{ x: focusedField === 'email' ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="email" className="transition-colors duration-200" style={{ color: focusedField === 'email' ? '#00A651' : undefined }}>Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="votre@email.com"
                          required
                          disabled={sending}
                          className="transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      </motion.div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <motion.div
                        animate={{ x: focusedField === 'phone' ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="phone" className="transition-colors duration-200" style={{ color: focusedField === 'phone' ? '#00A651' : undefined }}>Téléphone</Label>
                        <Input
                          id="phone"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="+228 XX XX XX XX"
                          disabled={sending}
                          className="transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      </motion.div>
                      <motion.div
                        animate={{ x: focusedField === 'subject' ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="subject" className="transition-colors duration-200" style={{ color: focusedField === 'subject' ? '#00A651' : undefined }}>Sujet</Label>
                        <Input
                          id="subject"
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Objet de votre message"
                          disabled={sending}
                          className="transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      animate={{ x: focusedField === 'message' ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="message" className="transition-colors duration-200" style={{ color: focusedField === 'message' ? '#00A651' : undefined }}>Message *</Label>
                      <Textarea
                        id="message"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Décrivez votre demande..."
                        rows={5}
                        required
                        disabled={sending}
                        className="transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                      />
                    </motion.div>
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

            {/* Sidebar */}
            <div className="order-first lg:order-last space-y-6">
              {/* Bank Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00A651] to-[#0d3d2e] rounded-lg flex items-center justify-center">
                      <Building className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a]">Coordonnées Bancaires</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-[#00A651]/5 rounded-lg border border-[#00A651]/10">
                      <p className="font-bold text-[#00A651] text-base mb-2">UTB</p>
                      <div className="space-y-1">
                        <p className="text-gray-600">Compte: <span className="font-mono text-[#1a1a1a] font-medium">322114950004000</span></p>
                        <p className="text-gray-600">Devise: <span className="text-[#1a1a1a] font-medium">XOF (FCFA)</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp with chat bubble design */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-[#25D366] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">WhatsApp</h3>
                      <p className="text-white/80 text-sm">Réponse rapide</p>
                    </div>
                  </div>
                  {/* Chat bubble */}
                  <div className="bg-white rounded-2xl rounded-bl-sm p-4 mb-4 shadow-sm max-w-[85%]">
                    <p className="text-gray-700 text-sm">
                      Bonjour ! 👋 Comment pouvons-nous vous aider ? Envoyez-nous un message sur WhatsApp.
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block text-right">Maintenant</span>
                  </div>
                </div>
                <div className="bg-[#25D366] px-6 pb-6">
                  <Button
                    className="w-full bg-white text-[#25D366] hover:bg-white/90 font-semibold shadow-md"
                    asChild
                  >
                    <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 size-4" />
                      Ouvrir WhatsApp
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4">Liens rapides</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('automobile')}
                    >
                      <span className="flex items-center gap-2">
                        <Car className="size-4" />
                        Produits Automobile
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('agroalimentaire')}
                    >
                      <span className="flex items-center gap-2">
                        <Wheat className="size-4" />
                        Produits Agro-alimentaire
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5"
                      onClick={() => navigateTo('about')}
                    >
                      <span className="flex items-center gap-2">
                        <Info className="size-4" />
                        À Propos
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <ScrollReveal>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center space-y-4 mb-8">
              <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
                <MapPin className="mr-1 size-3" />
                Notre Localisation
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Nous Trouver</h2>
              <p className="text-gray-600">Lomé, Togo — Au cœur de l&apos;Afrique de l&apos;Ouest</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198740.0!2d1.1228!3d6.1319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1b4b3e5e3e1%3A0x0!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2stg!4v1700000000000!5m2!1sfr!2stg"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="LA REDOUTE SARL-U - Lomé, Togo"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
                FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Questions Fréquentes
              </h2>
              <p className="text-gray-600">
                Retrouvez les réponses aux questions les plus courantes
              </p>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-gray-100">
                      <AccordionTrigger className="text-left text-[#1a1a1a] hover:text-[#00A651] hover:no-underline transition-colors text-sm sm:text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>
      </ScrollReveal>

      {/* Sticky mobile action buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] safe-area-pb">
        <div className="flex gap-0">
          <a
            href="tel:+22822251898"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#00A651] text-white font-semibold text-sm active:bg-[#008541] transition-colors"
          >
            <Phone className="size-4" />
            Appeler
          </a>
          <div className="w-px bg-white/20" />
          <a
            href="https://wa.me/22892501944"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-semibold text-sm active:bg-[#1da851] transition-colors"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
