'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import { getAlbumMedia, uploadAlbumMedia } from './actions'

interface MediaItem {
  id: string
  type: string
  src: string
  thumbnail: string
  altText?: string
}

interface UploadItem {
  file: File
  preview: string
  type: 'image' | 'video'
  altText: string
}

export default function FamilyAlbumPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Upload State
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Infinite Scroll Refs
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial Load
  useEffect(() => {
    loadData(1)
  }, [])

  const loadData = async (pageNum: number) => {
    try {
      const result = await getAlbumMedia(pageNum)
      if (result.success) {
        const newItems = result.data as MediaItem[]
        if (pageNum === 1) {
          setMediaItems(newItems)
        } else {
          setMediaItems(prev => [...prev, ...newItems])
        }
        
        if (newItems.length < 50) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error("Failed to load media", error)
    }
  }

  // Infinite Scroll Handler
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    setPage(nextPage)
    
    loadData(nextPage).finally(() => {
      setLoading(false)
    })
  }, [loading, hasMore, page])

  // Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [loadMore, hasMore, loading])


  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newQueue: UploadItem[] = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        altText: ''
      }))
      
      setUploadQueue(newQueue)
      setIsUploadModalOpen(true)
      
      // Reset input value so same files can be selected again if cancelled
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const updateAltText = (index: number, text: string) => {
    setUploadQueue(prev => prev.map((item, i) => 
      i === index ? { ...item, altText: text } : item
    ))
  }

  const handleSubmitUploads = async () => {
    // Validate
    const allValid = uploadQueue.every(item => item.altText.trim().length > 0)
    if (!allValid) return

    setIsUploading(true)

    // Upload Items Sequentially
    try {
      for (const item of uploadQueue) {
        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('altText', item.altText)
        formData.append('type', item.type)
        
        await uploadAlbumMedia(formData)
      }
      
      // Refresh list
      setPage(1)
      setHasMore(true)
      await loadData(1)
      
      setIsUploadModalOpen(false)
      setUploadQueue([])
    } catch (error) {
      console.error("Upload failed", error)
      alert("Some uploads failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleCancelUpload = () => {
      if (isUploading) return
      setIsUploadModalOpen(false)
      setUploadQueue([])
  }

  const allAltTextsFilled = uploadQueue.length > 0 && uploadQueue.every(item => item.altText.trim().length > 0)

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Full Width Grid - No Gaps */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0">
        {mediaItems.map((item) => (
          <div 
            key={item.id} 
            className="relative aspect-square overflow-hidden cursor-pointer group"
            onClick={() => setSelectedMedia(item)}
          >
            {item.type === 'video' ? (
              <div className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-300">
                 <video 
                  src={item.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => e.currentTarget.pause()}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="bg-black/50 p-2 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
              </div>
            ) : (
              <img 
                src={item.src} 
                alt={`Family memory ${item.id}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center p-4">
        {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        multiple 
        accept="image/*,video/*"
      />

      {/* Floating Action Button - Fixed Bottom Right */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-24 right-6 bg-brand-sky text-white p-4 rounded-full shadow-lg hover:bg-sky-500 hover:scale-105 transition-all duration-200 z-40 flex items-center justify-center"
        aria-label="Add to album"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Upload Preview Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add to Album</h2>
                <button onClick={handleCancelUpload} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {uploadQueue.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-24 h-24 shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                        {item.type === 'video' ? (
                          <video src={item.preview} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                        )}
                     </div>
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={item.altText}
                          onChange={(e) => updateAltText(index, e.target.value)}
                          placeholder="Describe this memory..."
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Required for accessibility and search.
                        </p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button 
                    onClick={handleCancelUpload}
                    className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleSubmitUploads}
                    disabled={!allAltTextsFilled}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-sky hover:bg-sky-500 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Upload {uploadQueue.length > 0 && `(${uploadQueue.length})`}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Full Screen Media Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMedia(null)
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking content
          >
             {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.src}
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  controls
                  autoPlay
                />
             ) : (
                <img 
                  src={selectedMedia.src} 
                  alt="Full screen view"
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                />
             )}
          </div>
        </div>
      )}
    </div>
  )
}
