'use client'

import { useState, useEffect } from 'react'
import AnnouncementModal from './AnnouncementModal'

export default function AnnouncementCarousel({ 
  announcements, 
  currentUserEmail 
}: { 
  announcements: any[], 
  currentUserEmail?: string 
}) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const isAdmin = currentUserEmail === 'idongesit_essien@ymail.com'

  // Auto-scroll every 5s unless paused
  useEffect(() => {
    if (announcements.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [announcements.length, isPaused])

  if (announcements.length === 0 && !isAdmin) return null

  return (
    <div className="mb-8">
      
      {/* CAROUSEL CONTAINER */}
      {announcements.length > 0 && (
        <div 
          className="relative overflow-hidden bg-brand-sky rounded-2xl shadow-sm border border-brand-sky/20 text-white p-6 cursor-pointer group"
          onClick={() => setIsPaused(true)} // Pause on tap/click
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* CONTENT */}
          <div className="relative h-20 flex items-center">
             {announcements.map((ann, i) => (
               <div 
                 key={ann.id}
                 className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col justify-center
                   ${i === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}
                 `}
               >
                 <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                   {ann.isUrgent && <span>🚨</span>}
                   {ann.title}
                 </h3>
                 <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
                   {ann.content}
                 </p>
               </div>
             ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {announcements.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white' : 'bg-white/30'}`} 
              />
            ))}
          </div>
        </div>
      )}

      {/* ADMIN ADD BUTTON */}
      {isAdmin && (
        <div className="text-right mt-2">
          <button 
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-brand-sky hover:text-sky-600 flex items-center justify-end gap-1 ml-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Add Announcement
          </button>
        </div>
      )}

      {showModal && <AnnouncementModal onClose={() => setShowModal(false)} />}
    </div>
  )
}