'use client'

import { useState, useCallback } from 'react'
import { LayoutDashboard, FileText, Package, Image as ImageIcon, Users, MessageSquare, Settings, ArrowLeft, X, Activity } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import AdminLogin from './AdminLogin'
import DashboardTab from './DashboardTab'
import HomepageEditor from './HomepageEditor'
import ProductManager from './ProductManager'
import ImageManager from './ImageManager'
import PartnerManager from './PartnerManager'
import MessagesTab from './MessagesTab'
import SettingsTab from './SettingsTab'
import ActivityLogTab from './ActivityLogTab'

interface AdminPanelProps {
  isAuthenticated: boolean
  onLogin: (password: string) => Promise<boolean>
  onLogout: () => void
  onClose: () => void
  onRefresh?: () => void
}

export default function AdminPanel({ isAuthenticated, onLogin, onLogout, onClose, onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogin = useCallback(async (password: string): Promise<boolean> => {
    return onLogin(password)
  }, [onLogin])

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onBack={onClose} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'homepage':
        return <HomepageEditor />
      case 'products':
        return <ProductManager />
      case 'images':
        return <ImageManager />
      case 'partners':
        return <PartnerManager />
      case 'messages':
        return <MessagesTab />
      case 'settings':
        return <SettingsTab />
      case 'activity':
        return <ActivityLogTab />
      default:
        return <DashboardTab />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 via-gray-50 to-[#00A651]/5 flex">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <div className="hidden md:flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
          onClose={onClose}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden bg-[#0d3d2e] text-white p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors" aria-label="Retour au site">
              <ArrowLeft className="size-4" />
              <span className="text-xs hidden sm:inline">Retour</span>
            </button>
            <div className="w-px h-4 bg-white/20" />
            <span className="font-semibold text-sm sm:text-base">Administration</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1" aria-label="Fermer">
            <X className="size-5" />
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden bg-[#0d3d2e]/90 border-t border-white/10 relative">
          <div className="px-2 py-2 flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'activity', label: 'Activité', icon: Activity },
              { id: 'homepage', label: 'Pages', icon: FileText },
              { id: 'products', label: 'Produits', icon: Package },
              { id: 'images', label: 'Images', icon: ImageIcon },
              { id: 'partners', label: 'Partenaires', icon: Users },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Paramètres', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#00A651] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="size-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Scroll indicator gradient */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-[#0d3d2e]/90 to-transparent" />
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
