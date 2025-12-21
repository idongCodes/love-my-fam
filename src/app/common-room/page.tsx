import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import PostInput from "@/components/PostInput";
import PostCard from "@/components/PostCard";

const prisma = new PrismaClient();

async function getUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value
  if (!sessionId) return null

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, firstName: true, alias: true }
  })
  return user
}

async function getPosts(currentUserId?: string) {
  const posts = await prisma.post.findMany({
    include: { 
      author: true,
      // 1. FETCH USERS FOR POST LIKES
      likes: {
        include: {
          user: { select: { id: true, firstName: true, alias: true, profileImage: true } }
        }
      },
      comments: {
        include: {
          author: true,
          // 2. FETCH USERS FOR COMMENT LIKES
          likes: {
            include: {
              user: { select: { id: true, firstName: true, alias: true, profileImage: true } }
            }
          },
          children: {
            include: {
              author: true,
              likes: {
                include: {
                  user: { select: { id: true, firstName: true, alias: true, profileImage: true } }
                }
              },
              children: true 
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return posts.map(post => ({
    ...post,
    // We pass the FULL array of likes now, not just the count
    likeCount: post.likes.length,
    isLikedByMe: currentUserId ? post.likes.some(like => like.userId === currentUserId) : false,
    topLevelComments: post.comments.filter((c: any) => !c.parentId)
  }));
}

export default async function CommonRoom() {
  const user = await getUser()
  const posts = await getPosts(user?.id) // Pass user ID to check likes

  const welcomeName = user?.alias || user?.firstName || "Family Member";

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-2xl mx-auto p-4 mt-8 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-2">
          <h1 className="text-3xl font-bold text-brand-sky tracking-tight">
            The Common Room
          </h1>
          <h2 className="text-slate-500 font-medium text-sm md:text-lg pb-1 md:text-right">
            Welcome home, <span className="text-brand-pink font-bold">{welcomeName}</span>.
          </h2>
        </div>

        {/* INPUT FORM */}
        <PostInput />

        {/* POSTS FEED */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={user?.id || ''}
            />
          ))}
          {/* ... (Empty state remains same) */}
        </div>
      </div>
    </main>
  );
}