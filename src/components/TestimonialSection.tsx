import { getTestimonials } from '@/app/testimonials/actions'

export default async function TestimonialSection() {
  const testimonials = await getTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section className="bg-brand-sky py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10 tracking-tight">
          Love form the Family
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              {/* Content */}
              <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                "{t.redactedContent}"
              </p>

              {/* Author Footer */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                {/* Avatar (Hidden for Guests) */}
                {t.displayAvatar ? (
                  <div className="w-10 h-10 bg-brand-pink text-slate-800 font-bold rounded-full flex items-center justify-center shrink-0">
                    {t.displayAvatar}
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                    {/* Guest View Generic Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">
                    {t.displayAuthor}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}