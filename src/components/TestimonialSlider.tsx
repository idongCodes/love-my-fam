'use client'

import { useState, useEffect } from 'react'

export default function TestimonialSlider({ testimonials }: { testimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'

  // Auto-scroll every 5 seconds
  useEffect(() => {
    // Only scroll if we have more items than can fit on screen (approx)
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // If empty, render nothing
  if (!testimonials.length) return null

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* SLIDER TRACK */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((t) => {
          // Check admin status inside the loop
          const isAdmin = t.authorEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

          return (
            <div 
              key={t.id} 
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              {/* LIQUID GLASS CARD */}
              <div className="h-full min-h-[250px] p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between">
                
                {/* Content */}
                <p className="text-white/95 text-lg mb-6 leading-relaxed italic font-medium drop-shadow-sm line-clamp-4">
                  "{t.redactedContent}"
                </p>

                {/* Author Footer */}
                <div className="flex items-center gap-3 border-t border-white/20 pt-4 mt-auto">
                  
                  {/* Avatar */}
                  {t.displayAvatar ? (
                    <div className="w-10 h-10 bg-brand-pink text-slate-900 font-bold rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20">
                      {t.displayAvatar}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0 text-white/50 border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white tracking-wide text-sm whitespace-nowrap">
                        {t.displayAuthor}
                      </span>
                      
                      {/* GREY ADMIN BADGE */}
                      {isAdmin && (
                        <span className="bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-500 flex items-center gap-0.5 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                          </svg>
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs text-blue-100/80 mt-0.5">
                      {new Date(t.createdAt).toLocaleString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Optional: Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}