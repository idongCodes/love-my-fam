const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function restoreData() {
  try {
    console.log('=== ATTEMPTING TO RESTORE MISSING DATA ===')
    
    // Check current state
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    })
    
    const testimonials = await prisma.testimonial.findMany({
      include: {
        author: true
      }
    })
    
    const users = await prisma.user.findMany()
    
    console.log(`\n📊 CURRENT STATE:`)
    console.log(`  Users: ${users.length}`)
    console.log(`  Posts: ${posts.length}`)
    console.log(`  Testimonials: ${testimonials.length}`)
    
    // Look for announcements (posts with isAnnouncement = true)
    const announcements = posts.filter(post => post.isAnnouncement)
    console.log(`  Announcements: ${announcements.length}`)
    
    // Show post details
    console.log(`\n📝 POSTS DETAILS:`)
    posts.forEach(post => {
      console.log(`  - "${post.content.substring(0, 60)}..."`)
      console.log(`    Author: ${post.author?.firstName} ${post.author?.lastName}`)
      console.log(`    Comments: ${post.comments?.length || 0}`)
      console.log(`    Announcement: ${post.isAnnouncement}`)
      console.log(`    Urgent: ${post.isUrgent}`)
      console.log('')
    })
    
    // Show testimonials
    console.log(`💬 TESTIMONIALS DETAILS:`)
    testimonials.forEach(testimonial => {
      console.log(`  - "${testimonial.content.substring(0, 60)}..."`)
      console.log(`    Author: ${testimonial.author?.firstName} ${testimonial.author?.lastName}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreData()
