import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Get the session cookie
  const session = request.cookies.get('session_id')

  // 2. Check if the user is trying to access a protected route
  if (request.nextUrl.pathname.startsWith('/common-room')) {
    // 3. If no session exists, kick them out to the login page
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/common-room/:path*',
    '/my-room/:path*' // <--- ADD THIS LINE
  ],
}
