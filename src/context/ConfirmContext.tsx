'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'info'
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' })
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setIsOpen(true)
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }, [])

  const handleConfirm = () => {
    if (resolver) resolver(true)
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (resolver) resolver(false)
    setIsOpen(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {options.title || 'Confirm Action'}
            </h3>
            
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              {options.message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                {options.cancelText || 'Cancel'}
              </button>
              
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-xl font-bold text-sm text-white shadow-sm transition-transform active:scale-95 ${
                  options.type === 'info' 
                    ? 'bg-brand-sky hover:bg-sky-500' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
