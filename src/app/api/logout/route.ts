import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    // Handle beacon requests and regular POST requests
    const formData = await request.formData()
    const action = formData.get('action')
    
    if (action === 'logout') {
      await logout()
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
