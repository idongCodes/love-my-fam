'use client'

export default function WhatsNewSection() {
  return (
    <section className="py-12 px-6 bg-gradient-to-br from-brand-sky/5 to-brand-pink/5 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center justify-center gap-2">
            <span className="relative">
              What&apos;s New
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-brand-pink rounded-full animate-pulse"></span>
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Latest updates and features to keep your family connection stronger than ever.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Feature 1: Modern Navigation */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-brand-sky/10">
            <div className="text-2xl mb-3 text-center">
              <span>🧭</span>
            </div>
            <h3 className="font-bold text-base mb-2 text-brand-sky">Modern Navigation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Our new floating pill navigation makes getting around easier than ever. Clean, intuitive, and always at your fingertips.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-pink font-medium">
              <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></span>
              Just Released
            </div>
          </div>

          {/* Feature 2: My Mirror */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-brand-pink/10">
            <div className="text-2xl mb-3 text-center">
              <span>🪞</span>
            </div>
            <h3 className="font-bold text-base mb-2 text-brand-pink">My Mirror</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              See yourself through family&apos;s eyes. The new My Mirror tab shows exactly how others see your profile.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-pink font-medium">
              <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></span>
              Just Released
            </div>
          </div>

          {/* Feature 3: Enhanced Profiles */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-brand-yellow/20">
            <div className="text-2xl mb-3 text-center">
              <span>👤</span>
            </div>
            <h3 className="font-bold text-base mb-2 text-brand-sky">Enhanced Profiles</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Better position display with interactive tooltips. Cleaner, more intuitive family member information.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-yellow/80 font-medium">
              <span className="w-1.5 h-1.5 bg-brand-yellow/80 rounded-full animate-pulse"></span>
              Recently Updated
            </div>
          </div>
        </div>
        </div>
      </section>
  )
}
