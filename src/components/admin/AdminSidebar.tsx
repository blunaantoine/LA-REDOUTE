'use client'

import { LayoutDashboard, Home, Package, Image as ImageIcon, Users, Mail, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  onClose: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'homepage', label: 'Pages du site', icon: Home },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'partners', label: 'Partenaires', icon: Users },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

export default function AdminSidebar({ activeTab, onTabChange, onLogout, onClose }: AdminSidebarProps) {
  return (
    <aside className="w-[260px] min-h-screen admin-sidebar-gradient text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-main.png"
            alt="LA REDOUTE"
            width={140}
            height={42}
            className="h-9 w-auto object-contain brightness-0 invert"
            priority
          />
          <span className="text-[10px] uppercase tracking-widest text-white/60 bg-white/10 px-2.5 py-1 rounded-md font-semibold">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#00A651]/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06] hover:pl-5'
              }`}
            >
              {/* Left border highlight for active state */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#00A651] shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
              )}

              {/* Icon with active animation */}
              <item.icon
                className={`size-5 transition-all duration-300 ${
                  isActive
                    ? 'text-[#00C762] drop-shadow-[0_0_6px_rgba(0,199,98,0.4)]'
                    : 'text-white/50 group-hover:text-white/80 group-hover:scale-110'
                }`}
                style={isActive ? { animation: 'iconBounce 0.5s ease-out' } : undefined}
              />

              <span className={`transition-all duration-200 ${isActive ? 'tracking-wide' : ''}`}>
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00C762] shadow-[0_0_6px_rgba(0,199,98,0.6)]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-1">
        <button
          onClick={onClose}
          className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200 hover:pl-5"
        >
          <Home className="size-5 text-white/40 group-hover:text-white/70 group-hover:scale-110 transition-all duration-200" />
          Voir le site
        </button>
        <button
          onClick={onLogout}
          className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-red-300/70 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 hover:pl-5"
        >
          <LogOut className="size-5 group-hover:scale-110 transition-all duration-200" />
          Déconnexion
        </button>
      </div>

      {/* Inline keyframes for icon bounce */}
      <style jsx>{`
        @keyframes iconBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.25); }
          50% { transform: scale(0.95); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </aside>
  )
}
