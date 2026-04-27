'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type PageName = 'accueil' | 'automobile' | 'agroalimentaire' | 'about' | 'contact'

interface NavigationContextType {
  currentPage: PageName
  navigateTo: (page: PageName) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageName>('accueil')

  const navigateTo = useCallback((page: PageName) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
