const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'idongesit_essien@ymail.com' },
    update: {}, // If you already exist, do nothing
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

  console.log('Seed successful! Created user:', user)
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