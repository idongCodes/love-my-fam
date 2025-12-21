'use client'

import { useState } from 'react'
import { addComment, toggleCommentLike } from '@/app/common-room/actions'

export default function CommentItem({ 
  comment, 
  currentUserId, 
  postId 
}: { 
  comment: any, 
  currentUserId: string, 
  postId: string 
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  
  // --- SAFETY FIX: Default to empty array if likes are missing ---
  const safeLikes = comment.likes || []
  const isLikedByMe = safeLikes.some((l: any) => l.userId === currentUserId)
  
  const [isLiked, setIsLiked] = useState(isLikedByMe)
  const [likeCount, setLikeCount] = useState(safeLikes.length)

  async function handleLike() {
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1)
    await toggleCommentLike(comment.id)
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    await addComment(postId, replyContent, comment.id)
    setIsReplying(false)
    setReplyContent('')
  }

  const displayName = comment.author?.alias || comment.author?.firstName || 'Family Member'
  const firstLetter = displayName[0]?.toUpperCase() || '?'

  return (
    <div className="flex gap-3 mt-4 w-full">
      {/* Avatar */}
      <div className="w-8 h-8 bg-brand-sky/20 rounded-full flex items-center justify-center text-brand-sky font-bold text-xs shrink-0">
        {firstLetter}
      </div>

      <div className="flex-1">
        {/* Bubble */}
        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100">
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-slate-700 text-sm">{displayName}</span>
            <span className="text-[10px] text-slate-400">
              {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
          <p className="text-sm text-slate-600">{comment.content}</p>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mt-1 ml-2 text-xs font-bold text-slate-400">
          <button 
            onClick={handleLike} 
            className={`hover:text-brand-pink transition-colors ${isLiked ? 'text-brand-pink' : ''}`}
          >
            {isLiked ? '❤️' : '♡'} {likeCount || ''} Like
          </button>
          <button 
            onClick={() => setIsReplying(!isReplying)} 
            className="hover:text-brand-sky transition-colors"
          >
            Reply
          </button>
        </div>

        {/* Reply Input Box */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2 animate-in slide-in-from-top-1">
            <input 
              autoFocus
              type="text" 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${displayName}...`}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-sky outline-none"
            />
            <button type="submit" className="bg-brand-sky text-white px-3 py-1 rounded-lg text-xs font-bold">
              Send
            </button>
          </form>
        )}

        {/* --- RECURSION: Render Children Comments --- */}
        {/* SAFETY FIX: Ensure comment.children exists before mapping */}
        {comment.children && comment.children.length > 0 && (
          <div className="border-l-2 border-slate-100 pl-4 mt-2">
            {comment.children.map((child: any) => (
              <CommentItem 
                key={child.id} 
                comment={child} 
                currentUserId={currentUserId} 
                postId={postId} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}