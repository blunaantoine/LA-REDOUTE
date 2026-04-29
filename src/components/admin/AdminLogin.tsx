'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>
  onBack: () => void
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const success = await onLogin(password)
    if (!success) {
      setError('Mot de passe incorrect')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d2e] via-[#1a4d3d] to-[#00A651]" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00C762]/15 rounded-full blur-3xl" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00A651]/10 rounded-full blur-3xl" />
        {/* Center subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Login Card with dramatic entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="relative w-full max-w-md border-white/10 shadow-2xl shadow-black/20 bg-white/[0.97] backdrop-blur-sm">
          <CardHeader className="text-center space-y-5 pb-2">
            {/* Logo - more prominent */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Image
                  src="/logo-main.png"
                  alt="LA REDOUTE"
                  width={180}
                  height={56}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-14 w-auto object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Lock icon with animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C762] to-[#008541] flex items-center justify-center shadow-lg shadow-[#00A651]/25">
                  <Lock className="size-6 text-white lock-icon-animate" />
                </div>
                {/* Subtle glow ring behind the lock */}
                <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-[#00A651]/20 animate-pulse" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <CardTitle className="text-xl font-bold text-[#1a1a1a]">Administration</CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Connectez-vous pour accéder au panneau d&apos;administration
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="pt-4">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#00A651] focus:ring-[#00A651]/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-1.5 flex items-center gap-1.5 animate-[fadeInUp_0.3s_ease-out]">
                    <ShieldCheck className="size-3.5" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#00A651] to-[#008541] hover:from-[#008541] hover:to-[#006d35] shadow-md shadow-[#00A651]/20 hover:shadow-lg hover:shadow-[#00A651]/30 transition-all duration-300 text-sm font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Connexion en cours...</span>
                  </span>
                ) : (
                  'Se connecter'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-all duration-200"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 size-4" />
                Retour au site
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inline keyframes for lock icon */}
      <style jsx>{`
        @keyframes lockFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .lock-icon-animate {
          animation: lockFloat 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
