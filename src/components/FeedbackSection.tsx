'use client'

export default function FeedbackSection() {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
          What do you love about this app?
        </h3>
        
        <div className="flex flex-col gap-4">
          <textarea 
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-sky outline-none transition-all resize-y shadow-sm text-slate-700"
          />
          
          <div className="flex justify-end">
            <button 
              type="button"
              className="bg-brand-sky text-white font-bold py-2.5 px-6 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}