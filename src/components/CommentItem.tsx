'use client'

import { useState } from 'react'
import { addComment, toggleCommentLike, deleteComment, editComment } from '@/app/common-room/actions'
import LikeButton from './LikeButton'
import EmojiButton from './EmojiButton'

export default function CommentItem({ 
  comment, 
  currentUserId, 
  postId 
}: { 
  comment: any, 
  currentUserId: string, 
  postId: string 
}) {
  // --- STATE ---
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  // --- PERMISSIONS ---
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  // Case-insensitive check for admin email
  const isAdmin = comment.author?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  
  const isAuthor = currentUserId === comment.authorId
  const createdAt = new Date(comment.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  // Rule: Author only + Not edited yet + Less than 10 mins old
  const canEdit = isAuthor && !comment.isEdited && timeDiff < 10 * 60 * 1000

  // --- HANDLERS ---

  async function handleToggleLike() {
    await toggleCommentLike(comment.id)
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    await addComment(postId, replyContent, comment.id)
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

  const displayName = comment.author?.alias || comment.author?.firstName || 'Family Member'
  const firstLetter = displayName[0]?.toUpperCase() || '?'

  return (
    <div className="flex gap-3 mt-4 w-full">
      {/* AVATAR */}
      <div className="w-8 h-8 bg-brand-sky/20 rounded-full flex items-center justify-center text-brand-sky font-bold text-xs shrink-0">
        {firstLetter}
      </div>

      <div className="flex-1">
        {/* BUBBLE */}
        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 group relative">
          
          {/* HEADER: Name + Badge + Timestamp + Icons */}
          <div className="flex justify-between items-baseline mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 text-sm">{displayName}</span>
              
              {/* GREY ADMIN BADGE */}
              {isAdmin && (
                <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded border border-slate-500 font-bold uppercase tracking-wide flex items-center gap-0.5 shadow-sm">
                  Admin
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                }) : ''}
                {comment.isEdited && <span className="italic ml-1">(Edited)</span>}
              </span>

              {/* Edit/Delete Icons */}
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

          {/* Content Area */}
          {isEditing ? (
            <div className="mt-1 relative">
              <input
                autoFocus
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                // Added pr-8 to avoid overlap with emoji button
                className="w-full text-sm p-1 border-b border-brand-sky outline-none bg-transparent pr-8"
              />
              {/* Emoji Button Inside Input */}
              <div className="absolute right-0 bottom-1">
                <EmojiButton onEmojiSelect={(emoji) => setEditContent(prev => prev + emoji)} />
              </div>

              <div className="flex gap-2 mt-2 justify-end text-[10px] font-bold">
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                <button onClick={handleEditSave} className="text-brand-sky hover:text-sky-600">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>

        {/* Action Footer */}
        {!isEditing && (
          <div className="flex gap-4 mt-1 ml-2 text-xs font-bold text-slate-400">
            <LikeButton 
              initialLikes={comment.likes || []} 
              currentUserId={currentUserId} 
              onToggle={handleToggleLike} 
            />
            <button 
              onClick={() => setIsReplying(!isReplying)} 
              className="hover:text-brand-sky transition-colors"
            >
              Reply
            </button>
          </div>
        )}

        {/* Reply Input Form */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2 animate-in slide-in-from-top-1 items-center">
            <div className="relative flex-1">
              <input 
                autoFocus
                type="text" 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${displayName}...`}
                // Added pr-10
                className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-brand-sky outline-none"
              />
              {/* Emoji Button Inside Input */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EmojiButton onEmojiSelect={(emoji) => setReplyContent(prev => prev + emoji)} />
              </div>
            </div>

            <button type="submit" className="bg-brand-sky text-white px-3 py-1 rounded-lg text-xs font-bold">
              Send
            </button>
          </form>
        )}

        {/* RECURSIVE CHILDREN */}
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