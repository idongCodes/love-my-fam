'use client'

import { useState } from 'react'
import { addComment, toggleCommentLike, deleteComment, editComment } from '@/app/common-room/actions'

export default function CommentItem({ 
  comment, 
  currentUserId, 
  postId 
}: { 
  comment: any, 
  currentUserId: string, 
  postId: string 
}) {
  // --- STATE: REPLYING ---
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  
  // --- STATE: EDITING ---
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  // --- STATE: LIKES (Safe Access) ---
  const safeLikes = comment.likes || []
  const isLikedByMe = safeLikes.some((l: any) => l.userId === currentUserId)
  const [isLiked, setIsLiked] = useState(isLikedByMe)
  const [likeCount, setLikeCount] = useState(safeLikes.length)

  // --- PERMISSIONS ---
  const isAuthor = currentUserId === comment.authorId
  const createdAt = new Date(comment.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  // Rule: Author only + Not edited yet + Less than 10 mins old
  const canEdit = isAuthor && !comment.isEdited && timeDiff < 10 * 60 * 1000

  // --- HANDLERS ---

  async function handleLike() {
    // Optimistic UI update
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1)
    
    await toggleCommentLike(comment.id)
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    await addComment(postId, replyContent, comment.id) // Pass comment.id as parent
    setIsReplying(false)
    setReplyContent('')
  }

  async function handleDelete() {
    if (confirm('Delete this comment?')) {
      await deleteComment(comment.id)
    }
  }

  async function handleEditSave() {
    const result = await editComment(comment.id, editContent)
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.message)
    }
  }

  // Fallback for names/avatars
  const displayName = comment.author?.alias || comment.author?.firstName || 'Family Member'
  const firstLetter = displayName[0]?.toUpperCase() || '?'

  return (
    <div className="flex gap-3 mt-4 w-full">
      {/* 1. AVATAR */}
      <div className="w-8 h-8 bg-brand-sky/20 rounded-full flex items-center justify-center text-brand-sky font-bold text-xs shrink-0">
        {firstLetter}
      </div>

      <div className="flex-1">
        {/* 2. COMMENT BUBBLE */}
        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 group relative">
          
          {/* Header Row: Name + Date + Icons */}
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-slate-700 text-sm">{displayName}</span>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                {comment.isEdited && <span className="italic ml-1">(Edited)</span>}
              </span>

              {/* Edit/Delete Icons (Visible on Hover if allowed) */}
              {isAuthor && !isEditing && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {canEdit && (
                    <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-brand-sky" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                  )}
                  <button onClick={handleDelete} className="text-slate-400 hover:text-red-500" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area (Text vs Input) */}
          {isEditing ? (
            <div className="mt-1">
              <input
                autoFocus
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-sm p-1 border-b border-brand-sky outline-none bg-transparent"
              />
              <div className="flex gap-2 mt-2 justify-end text-[10px] font-bold">
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                <button onClick={handleEditSave} className="text-brand-sky hover:text-sky-600">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>

        {/* 3. ACTION FOOTER (Like / Reply) */}
        {!isEditing && (
          <div className="flex gap-4 mt-1 ml-2 text-xs font-bold text-slate-400">
            <button 
              onClick={handleLike} 
              className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-brand-pink' : 'hover:text-brand-pink'}`}
            >
              {isLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              )}
              {likeCount > 0 ? likeCount : 'Like'}
            </button>
            <button 
              onClick={() => setIsReplying(!isReplying)} 
              className="hover:text-brand-sky transition-colors"
            >
              Reply
            </button>
          </div>
        )}

        {/* 4. REPLY INPUT FORM */}
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

        {/* 5. RECURSIVE CHILDREN (REPLIES) */}
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