'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  initialSession 
}: { 
  children: React.ReactNode
  initialSession: boolean 
}) {
  // Initialize state with server-provided truth to prevent flash
  const [isLoggedIn, setIsLoggedIn] = useState(initialSession)

  // Sync with prop if it changes (rare in this architecture but good practice)
  useEffect(() => {
    setIsLoggedIn(initialSession)
  }, [initialSession])

  const login = () => setIsLoggedIn(true)
  const logout = () => setIsLoggedIn(false)

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
