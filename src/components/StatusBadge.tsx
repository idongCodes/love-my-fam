'use client'

import { useState } from 'react'

export default function StatusBadge({ 
  status, 
  size = 'normal' 
}: { 
  status?: string | null, 
  size?: 'small' | 'normal' | 'large' 
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!status) return null

  // Get first character (emoji)
  const firstChar = Array.from(status)[0]

  // CONFIGURATION
  // We use 'left' positioning here so that expansion naturally flows to the right.
  const sizeClasses = {
    small:  { 
      // Parent is usually w-8 (32px)
      position: '-top-1 left-6', 
      collapsed: 'w-3 h-3 text-[6px]', 
      expanded: 'h-4 text-[8px] px-2' 
    },
    normal: { 
      // Parent is usually w-10 (40px)
      position: '-top-1 left-7', 
      collapsed: 'w-5 h-5 text-[10px]',     
      expanded: 'h-6 text-[10px] px-2.5' 
    },
    large:  { 
      // Parent is usually w-40 (160px)
      position: 'top-1 left-28',          
      collapsed: 'w-10 h-10 text-xl',          
      expanded: 'h-10 text-sm px-5' 
    }
  }

  const current = sizeClasses[size]

  return (
    <div 
      className={`absolute flex items-center justify-center cursor-pointer transition-all duration-300 ease-out z-40 overflow-hidden origin-left
        ${current.position}
        
        /* SHAPE & SIZE TRANSITION */
        ${isExpanded 
          ? `${current.expanded} w-auto rounded-xl shadow-xl border-brand-sky/20` 
          : `${current.collapsed} rounded-full shadow-md border-white/30`
        }

        /* LIQUID GLASS STYLE */
        bg-white/60 backdrop-blur-md border text-slate-900 ring-1 ring-white/40
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={(e) => { 
        e.stopPropagation(); 
        setIsExpanded(!isExpanded); 
      }}
    >
      <span className={`leading-none whitespace-nowrap select-none ${isExpanded ? 'font-bold ml-0.5' : ''}`}>
        {isExpanded ? status : firstChar}
      </span>
    </div>
  )
}