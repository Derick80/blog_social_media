import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const email = 'iderick@gmail.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email: email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('1234567', 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  await prisma.profile.create({
    data: {
      user: { connect: { id: user.id } },

      email: user.email,
      firstName: 'Derick',
      lastName: 'Hoskinson',
      bio: 'I am a senior clinical geneticist and a newbie software developer',
      currentLocation: 'chicago',
      birthDay: '1980-03-03T19:00:52Z',
      occupation: 'scientist',
      pronouns: 'HE',
      profilePicture: 'https://remix-bucket.s3.us-east-2.amazonaws.com/TH.jpg'
    }
  })

  const post1 = await prisma.post.create({
    data: {
      title: 'THE KNIGHTS PRODUCED',
      body: 'A surprising amount of spun-sugar rope and bound their captives, slinging them over the backs of their horses like so much dirty laundry. They seemed afraid to touch Sumi, in all her skeletal glory; in the end, they had to sling a loop of rope around her neck, like she was a dog. That seemed to be enough to make her docile: she trailed behind the slow-riding group without protest or attempt to break away.',
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/dark.jpeg',
      published: true,
      userId: user.id,
      categories: {
        create: [
          { name: 'Science' },
          {
            name: 'Genetics'
          }
        ]
      }
    }
  })
  const post2 = await prisma.post.create({
    data: {
      title: 'THE SKY',
      body: 'A surprising amount of spun-sugar rope and bound their captives, slinging them over the backs of their horses like so much dirty laundry. They seemed afraid to touch Sumi, in all her skeletal glory; in the end, they had to sling a loop of rope around her neck, like she was a dog. That seemed to be enough to make her docile: she trailed behind the slow-riding group without protest or attempt to break away.',
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/dark.jpeg',
      published: true,
      userId: user.id,
      categories: {
        create: [
          { name: 'Coding' },
          {
            name: 'TypeScript'
          }
        ]
      }
    }
  })
  const post3 = await prisma.post.create({
    data: {
      title: 'THE KNIGHTS PRODUCED',
      body: 'A surprising amount of spun-sugar rope and bound their captives, slinging them over the backs of their horses like so much dirty laundry. They seemed afraid to touch Sumi, in all her skeletal glory; in the end, they had to sling a loop of rope around her neck, like she was a dog. That seemed to be enough to make her docile: she trailed behind the slow-riding group without protest or attempt to break away.',
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/dark.jpeg',
      published: false,
      userId: user.id,
      categories: {
        create: [
          { name: 'React' },
          {
            name: 'Prisma'
          }
        ]
      }
    }
  })
  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
