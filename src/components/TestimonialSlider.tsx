'use client'

import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import { deleteTestimonial } from '@/app/testimonials/actions'

export default function TestimonialSlider({ testimonials }: { testimonials: any[] }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'

  const itemsPerPage = 3 
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const handleDelete = async (testimonialId: string) => {
    setDeletingId(testimonialId)
    try {
      const result = await deleteTestimonial(testimonialId)
      if (result.success) {
        // Refresh the page to show updated testimonials
        window.location.reload()
      } else {
        alert(result.message || 'Failed to delete testimonial')
      }
    } catch {
      alert('Error deleting testimonial')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (totalPages <= 1) return

    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % totalPages)
    }, 5000)

    return () => clearInterval(interval)
  }, [totalPages])

  if (!testimonials.length) return null

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* SLIDER TRACK */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${pageIndex * 100}%)` }}
      >
        {testimonials.map((t) => {
          const isAdmin = t.authorEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          
          // STATUS LOGIC
          const statusEmoji = t.authorStatus ? Array.from(t.authorStatus)[0] : null

          return (
            <div 
              key={t.id} 
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              <div className="h-full min-h-[250px] p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between relative">
                
                {/* Admin Delete Button */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600/80 text-white p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete testimonial"
                  >
                    {deletingId === t.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}

                <p className="text-white/95 text-lg mb-6 leading-relaxed italic font-medium drop-shadow-sm line-clamp-4">
                  "{t.redactedContent}"
                </p>

                <div className="flex items-center gap-3 border-t border-white/20 pt-4 mt-auto">
                  
                  {/* AVATAR + BADGE */}
                  <div className="relative">
                    {t.authorProfileImage ? (
                      <div className="w-10 h-10 rounded-full shrink-0 shadow-lg border-2 border-white/20 overflow-hidden">
                        <img 
                          src={t.authorProfileImage} 
                          alt={t.displayAuthor} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : t.displayAvatar ? (
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
                    
                    {/* ✅ REPLACED MANUAL BADGE WITH COMPONENT */}
                    <StatusBadge status={t.authorStatus} size="normal" />
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white tracking-wide text-sm whitespace-nowrap">
                        {t.displayAuthor}
                      </span>
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
                      {new Date(t.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPageIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === pageIndex ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}