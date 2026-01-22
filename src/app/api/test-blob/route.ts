import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('Testing blob storage...')
    
    // Create a test file
    const testContent = 'This is a test file for blob storage'
    const testBlob = new Blob([testContent], { type: 'text/plain' })
    
    // Test upload to blob storage
    const blob = await put('test-upload.txt', testBlob, { access: 'public' })
    
    console.log('Upload successful:', blob.url)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blob storage working',
      url: blob.url 
    })
  } catch (error) {
    console.error('Blob storage error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Blob storage failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test if we can read blob config
    const testContent = 'Test file content'
    const testBlob = new Blob([testContent], { type: 'text/plain' })
    
    const blob = await put('get-test.txt', testBlob, { access: 'public' })
    
    return NextResponse.json({  
      success: true, 
      message: 'GET test successful',
      url: blob.url 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'GET test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
