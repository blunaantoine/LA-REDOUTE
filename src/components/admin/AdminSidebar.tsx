'use client'

import { LayoutDashboard, Home, Package, Image as ImageIcon, Users, LogOut } from 'lucide-react'
import Image from 'next/image'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  onClose: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'homepage', label: "Page d'accueil", icon: Home },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'partners', label: 'Partenaires', icon: Users },
]

export default function AdminSidebar({ activeTab, onTabChange, onLogout, onClose }: AdminSidebarProps) {
  return (
    <aside className="w-[250px] min-h-screen admin-sidebar-gradient text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-main.png"
            alt="LA REDOUTE"
            width={120}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-[#00A651] text-white shadow-lg shadow-[#00A651]/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Home className="size-5" />
          Voir le site
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="size-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
