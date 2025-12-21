'use client'

import { useState } from 'react'

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 1. THE TRIGGER LINK (Sits in the footer) */}
      <div className="w-full text-center pb-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-slate-400 hover:text-brand-sky text-sm font-medium transition-colors underline decoration-slate-700 underline-offset-4 hover:decoration-brand-sky"
        >
          Click here for issues, feature requests, suggestions or general feedback.
        </button>
      </div>

      {/* 2. THE FLOATING MODAL (Hidden by default) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop (Darkens background & closes on click) */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Share your feedback
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              <p className="text-slate-500 text-sm">
                Found a bug? Have an idea? Let us know how we can make LoveMyFam better for you.
              </p>
              
              <textarea 
                placeholder="Type your message here..."
                rows={5}
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-sky outline-none transition-all resize-none text-slate-700"
              />
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="bg-brand-sky text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-500 transition-colors shadow-sm text-sm"
                >
                  Submit
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}