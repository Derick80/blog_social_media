import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const email = 'iderick@gmail.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email: email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = (await process.env.HASHEDPASSWORD) as string

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
      title: 'Senior Clinical Scientist',
      bio: 'I am a senior clinical geneticist and a newbie software developer',
      currentLocation: 'Chicago',
      birthDay: '1980-03-03T19:00:52Z',
      occupation: 'scientist',
      pronouns: 'HE',
      profilePicture:
        'https://remix-bucket.s3.us-east-2.amazonaws.com/DerickFace.jpg'
    }
  })

  const post1 = await prisma.post.create({
    data: {
      title: 'Creating my personal blog site',
      body: `'1. Why didn’t i just use a blogging website like Wix or something like Astro.build?
    1. Real reason - I’m stubborn
    2. I tried Wix but didn’t enjoy the feel of the editor even when I turned on the more developer friendly settings
    3. Astro is something that has been poking at my interests but I didn’t understand how I might actually use it in this project
        1. More on this later though because one of the Astro templates helped me
            1. Go through the process of learning the very basics of Astro and along the way my brain was processing how I might be able to use the exposure (seeing a site, copying that site for practice) to inform my coding process for my blog
2. What are my main wants for V1 of the personal blog?
    1. Personal Login, a feeds page, a drafts page, a profile/about page'`,
      postImg:
        'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_one_prisma_schema.png',
      published: true,
      userId: user.id,
      categories: {
        connectOrCreate: [
          {
            where: { name: 'Coding' },
            create: { name: 'Coding' }
          },
          {
            where: { name: 'Prisma' },
            create: { name: 'Prisma' }
          }
        ]
      }
    }
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'My first Typescript App',
      body: 'How I went about building my first working typescript app',
      postImg:
        'https://remix-bucket.s3.us-east-2.amazonaws.com/post_one_prisma_schema.png',
      published: false,
      userId: user.id,
      categories: {
        connectOrCreate: [
          { where: { name: 'React' }, create: { name: 'React' } },
          { where: { name: 'Typescript' }, create: { name: 'Typescript' } }
        ]
      }
    }
  })
  const post3 = await prisma.post.create({
    data: {
      title: 'Using past work to inform current workflow',
      body: 'From the depths of graduate school',
      postImg:
        'https://remix-bucket.s3.us-east-2.amazonaws.com/post_three_yeast_plates.jpeg',
      published: true,
      userId: user.id,
      categories: {
        connectOrCreate: [
          { where: { name: 'Genetics' }, create: { name: 'Genetics' } },
          { where: { name: 'Science' }, create: { name: 'Science' } }
        ]
      }
    }
  })

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
