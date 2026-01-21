const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('=== CHECKING DATABASE DATA ===')
    
    // Check Posts
    const posts = await prisma.post.findMany()
    console.log(`\n📝 POSTS: ${posts.length} found`)
    posts.forEach(post => {
      console.log(`  - "${post.content.substring(0, 50)}..." by ${post.authorId}`)
    })
    
    // Check Testimonials
    const testimonials = await prisma.testimonial.findMany()
    console.log(`\n💬 TESTIMONIALS: ${testimonials.length} found`)
    testimonials.forEach(testimonial => {
      console.log(`  - "${testimonial.content.substring(0, 50)}..." by ${testimonial.authorId}`)
    })
    
    // Check Users
    const users = await prisma.user.findMany()
    console.log(`\n👥 USERS: ${users.length} found`)
    users.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`)
    })
    
  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
