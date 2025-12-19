export default function MyRoom() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-brand-sky mb-6">My Room</h1>
        
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-5xl mb-4">🛏️</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Personal Space</h2>
          <p className="text-slate-500">
            Personal dashboard, settings, and your post history will live here.
          </p>
        </div>
      </div>
    </main>
  )
}