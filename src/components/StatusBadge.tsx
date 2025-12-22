'use client'

import { useState } from 'react'

export default function StatusBadge({ 
  status, 
  size = 'normal' // 'normal' (posts/comments) or 'large' (profile page)
}: { 
  status?: string | null, 
  size?: 'small' | 'normal' | 'large' 
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!status) return null

  // Get first character (emoji) safely
  const firstChar = Array.from(status)[0]

  // Size configurations
  const sizeClasses = {
    small:  { collapsed: 'w-3 h-3 text-[6px] -top-0.5 -right-0.5', expanded: 'h-4 text-[8px] -top-0.5 -right-0.5' },
    normal: { collapsed: 'w-5 h-5 text-[10px] -top-1 -right-1',     expanded: 'h-6 text-[10px] -top-1 -right-1' },
    large:  { collapsed: 'w-10 h-10 text-xl top-1 right-2',          expanded: 'h-10 text-sm top-1 right-2' }
  }

  const currentSize = sizeClasses[size]

  return (
    <div 
      className={`absolute bg-white flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer transition-all duration-200 ease-out z-20 overflow-hidden 
        ${isExpanded 
          ? `${currentSize.expanded} w-auto px-3 rounded-full shadow-md border-brand-sky/30` 
          : `${currentSize.collapsed} rounded-full`
        }
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={(e) => { 
        e.stopPropagation(); 
        setIsExpanded(!isExpanded); 
      }}
    >
      <span className={`leading-none whitespace-nowrap select-none ${isExpanded ? 'font-bold text-slate-700' : ''}`}>
        {isExpanded ? status : firstChar}
      </span>
    </div>
  )
}