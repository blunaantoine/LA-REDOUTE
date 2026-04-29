'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Award, HeadphonesIcon, Heart, Car, Wheat, Users, Package, Calendar, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'
import PartnersSection from '@/components/homepage/PartnersSection'
import ScrollReveal from '@/components/ui/scroll-reveal'
import { motion, useScroll, useTransform } from 'framer-motion'

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

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  documentUrl: string | null
  order: number
  isActive: boolean
}

interface AccueilPageProps {
  content: Record<string, string>
  images: Record<string, string>
  products: Product[]
  partners: Partner[]
}

const values = [
  {
    icon: Award,
    title: 'Qualité',
    description: 'Nous sélectionnons rigoureusement chaque produit pour garantir la plus haute qualité à nos clients.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Service Client',
    description: "Notre équipe dévouée est toujours à l'écoute pour répondre à vos besoins et vous accompagner.",
  },
  {
    icon: Heart,
    title: 'Engagement',
    description: 'Nous nous engageons envers nos partenaires et notre communauté pour un développement durable.',
  },
]

const heroCounters = [
  { value: 500, suffix: '+', label: 'Clients satisfaits', icon: Users },
  { value: 200, suffix: '+', label: 'Produits disponibles', icon: Package },
  { value: 10, suffix: '+', label: "Ans d'expérience", icon: Calendar },
]

const trustedLogos = [
  'Michelin', 'TotalEnergies', 'Castrol', 'Nestlé', 'Unilever', 'Shell',
]

// Floating particles data
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 10 + 15,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.3 + 0.1,
}))

function TypewriterText({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-[3px] h-[1em] bg-white/90 ml-1 align-middle animate-[blink_0.7s_step-end_infinite]" />
      )}
    </span>
  )
}

function AnimatedCounter({ target, suffix = '', delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          // Apply stagger delay before starting the counter
          const startTimeout = setTimeout(() => {
            let start = 0
            const duration = 2000
            const stepTime = 16
            const steps = duration / stepTime
            const increment = target / steps

            const timer = setInterval(() => {
              start += increment
              if (start >= target) {
                setCount(target)
                clearInterval(timer)
              } else {
                setCount(Math.floor(start))
              }
            }, stepTime)
          }, delay)

          return () => clearTimeout(startTimeout)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, hasAnimated, delay])

  return (
    <span ref={ref} className="count-up">
      {count}{suffix}
    </span>
  )
}

// Scroll indicator with bounce
function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
    >
      <span className="text-white/50 text-xs tracking-[0.2em] uppercase font-medium">Découvrir</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-6 text-white/60" />
      </motion.div>
    </motion.div>
  )
}

export default function AccueilPage({ content, images, products, partners }: AccueilPageProps) {
  const { navigateTo } = useNavigation()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const shapeY1 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const shapeY2 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const shapeY3 = useTransform(scrollYProgress, [0, 1], [0, 40])

  const autoProducts = products.filter(p => p.subcategory === 'automobile' && p.isActive)
  const agroProducts = products.filter(p => p.subcategory === 'agroalimentaire' && p.isActive)
  const autoVariants = [...new Set(autoProducts.map(p => p.category).filter(Boolean))]
  const agroVariants = [...new Set(agroProducts.map(p => p.category).filter(Boolean))]

  const categoryLabels: Record<string, string> = {
    pneus: 'Pneus',
    huiles: 'Huiles Moteurs',
    accessoires: 'Accessoires Auto',
    alimentation: 'Produits Alimentaires',
    boissons: 'Boissons',
    cereales: 'Céréales & Grains',
  }

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="pattern-bg w-full h-full" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.opacity,
                animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Parallax shapes */}
        <motion.div
          style={{ y: shapeY1 }}
          className="absolute top-20 right-10 w-72 h-72 border border-white/10 rounded-full"
        />
        <motion.div
          style={{ y: shapeY2 }}
          className="absolute bottom-20 left-10 w-48 h-48 border border-white/10 rounded-full"
        />
        <motion.div
          style={{ y: shapeY3 }}
          className="absolute top-40 left-1/4 w-24 h-24 border border-white/5 rotate-45"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/20 backdrop-blur-sm px-4 py-2 text-sm">
                {content['hero-badge'] || 'Votre partenaire de confiance depuis des années'}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight">
                  {content['hero-title'] || 'LA REDOUTE'}
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-white/90">
                  <TypewriterText text={content['hero-subtitle'] || 'SARL-U'} speed={120} />
                </p>
              </div>
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                {content['hero-description'] || "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel."}
              </p>

              {/* Animated Counters with stagger */}
              <div className="flex flex-wrap gap-6 sm:gap-10">
                {heroCounters.map((counter, index) => (
                  <motion.div
                    key={counter.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <counter.icon className="size-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        <AnimatedCounter target={counter.value} suffix={counter.suffix} delay={index * 200} />
                      </div>
                      <div className="text-xs text-white/60">{counter.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-[#00A651] hover:bg-white/90 font-semibold btn-primary-hover"
                  onClick={() => navigateTo('automobile')}
                >
                  Nos Produits
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => navigateTo('contact')}
                >
                  Nous Contacter
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative animate-float">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <Image
                    src={images['logo-alt'] || '/logo-alt.png'}
                    alt="LA REDOUTE SARL-U Logo"
                    width={400}
                    height={400}
                    style={{ width: 'auto', height: 'auto' }}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <ScrollIndicator />
      </section>

      {/* Trusted By Section */}
      <ScrollReveal>
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
              {trustedLogos.map((name, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-center h-10 px-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 font-semibold text-sm tracking-wide hover:border-[#00A651]/30 hover:text-[#00A651]/60 transition-colors duration-300"
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Products Overview */}
      <ScrollReveal>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Nos Produits
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              {content['products-title'] || "Deux Domaines d'Expertise"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Automobile Card */}
            <Card className="overflow-hidden card-hover border-0 shadow-lg group hover:scale-[1.02] transition-transform duration-300">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/products-tires.png"
                  alt="Automobile"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                    <Car className="size-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Automobile</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600">
                  {content['auto-description'] || "Large sélection de pneus, huiles moteurs et accessoires automobiles pour tous véhicules."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {autoVariants.length > 0 ? autoVariants.map(v => (
                    <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                      {categoryLabels[v] || v}
                    </Badge>
                  )) : (
                    <>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Pneus</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Huiles Moteurs</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Accessoires</Badge>
                    </>
                  )}
                </div>
                <Button
                  className="w-full bg-[#00A651] hover:bg-[#008541] text-white"
                  onClick={() => navigateTo('automobile')}
                >
                  Voir les produits Automobile
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Agro-alimentaire Card */}
            <Card className="overflow-hidden card-hover border-0 shadow-lg group hover:scale-[1.02] transition-transform duration-300">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/products-food.png"
                  alt="Agro-alimentaire"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                    <Wheat className="size-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Agro-alimentaire</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600">
                  {content['agro-description'] || 'Distribution de produits alimentaires de qualité, boissons et céréales.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {agroVariants.length > 0 ? agroVariants.map(v => (
                    <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                      {categoryLabels[v] || v}
                    </Badge>
                  )) : (
                    <>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Alimentation</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Boissons</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Céréales</Badge>
                    </>
                  )}
                </div>
                <Button
                  className="w-full bg-[#00A651] hover:bg-[#008541] text-white"
                  onClick={() => navigateTo('agroalimentaire')}
                >
                  Voir les produits Agro-alimentaire
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Nos Valeurs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              {content['values-title'] || 'Ce Qui Nous Définit'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
              <Card className="text-center border-0 shadow-lg card-hover hover:scale-[1.03] transition-transform duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-[#00A651]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <value.icon className="size-8 text-[#00A651]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <ScrollReveal>
        <PartnersSection partners={partners} />
      </ScrollReveal>

      {/* CTA Section with animated gradient */}
      <ScrollReveal delay={0.2}>
      <section className="py-20 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00A651] via-[#00C762] to-[#0d3d2e] bg-[length:200%_200%] animate-[heroGradientShift_6s_ease_infinite]" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
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
                Contactez-nous
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => navigateTo('about')}
            >
              En savoir plus
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
  )
}
