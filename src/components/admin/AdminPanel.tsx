'use client'

import { useState, useCallback } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminLogin from './AdminLogin'
import DashboardTab from './DashboardTab'
import HomepageEditor from './HomepageEditor'
import ProductManager from './ProductManager'
import ImageManager from './ImageManager'
import PartnerManager from './PartnerManager'

interface AdminPanelProps {
  isAuthenticated: boolean
  onLogin: (password: string) => Promise<boolean>
  onLogout: () => void
  onClose: () => void
}

export default function AdminPanel({ isAuthenticated, onLogin, onLogout, onClose }: AdminPanelProps) {
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
      default:
        return <DashboardTab />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex">
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
        <div className="md:hidden bg-[#0d3d2e] text-white p-4 flex items-center justify-between">
          <span className="font-semibold">Administration</span>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden bg-[#0d3d2e]/90 border-t border-white/10 px-2 py-2 flex gap-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'homepage', label: 'Accueil' },
            { id: 'products', label: 'Produits' },
            { id: 'images', label: 'Images' },
            { id: 'partners', label: 'Partenaires' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00A651] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
