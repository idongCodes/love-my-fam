const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User (Existing)
  await prisma.user.upsert({
    where: { email: 'idongesit_essien@ymail.com' },
    update: {},
    create: {
      email: 'idongesit_essien@ymail.com',
      firstName: 'Idongesit',
      lastName: 'Essien',
      alias: 'Idong',
      position: 'Creator',
      phone: '+17743126471',
      posts: {
        create: {
          content: 'Welcome to the Common Room! This is the first official post.',
        },
      },
    },
  })

  // 2. Create Default Settings (NEW)
  await prisma.systemSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      familySecret: 'familyfirst'
    }
  })

  console.log('Seed successful!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })