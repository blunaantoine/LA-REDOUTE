'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Phone } from 'lucide-react'

interface CTASectionProps {
  content: Record<string, string>
}

export default function CTASection({ content }: CTASectionProps) {
  return (
    <section id="contact" className="py-20 bg-[#00A651] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          {content['cta-title'] || 'Prêt à Travailler Avec Nous ?'}
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          {content['cta-description'] || "Contactez-nous dès aujourd'hui pour découvrir comment nous pouvons répondre à vos besoins."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-[#00A651] hover:bg-white/90 font-semibold btn-primary-hover"
            asChild
          >
            <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
              <Phone className="mr-2 size-5" />
              Contactez-nous
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            asChild
          >
            <a href="mailto:contact@laredoutesarl.com">
              Envoyer un email
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
