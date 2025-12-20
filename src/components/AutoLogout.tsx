'use client'

import { useEffect } from 'react'
import { logout } from '@/app/actions'

// --- CONFIGURATION ---
// 15 Minutes (15 * 60 seconds * 1000 milliseconds)
const TIMEOUT_MS = 15 * 60 * 1000 

export default function AutoLogout() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleLogout = async () => {
      console.log("⏳ Session expired. Logging out...")

      try {
        await logout()
      } catch (e) {
        // Ignore errors during redirect
      } finally {
        // FORCE the browser to reload/redirect
        window.location.href = '/'
      }
    }

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(handleLogout, TIMEOUT_MS)
    }

    // Events that keep the session alive
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    // Attach listeners
    events.forEach(event => window.addEventListener(event, resetTimer))
    
    // Start the timer
    resetTimer()

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [])

  return null
}