import { Post, Prisma, User } from '@prisma/client'
import { prisma } from './prisma.server'
import type { CreateOrEditPost, UpdatePost } from './types.server'

export async function getPosts() {
  const userPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          role: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  const likeCount = userPosts.map((post) => post._count?.likes)
  return { userPosts, likeCount }
}

export async function getPost({ id }: Pick<Post, 'id'>) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })
  return post
}

export async function getHeroPost() {
  const heroPost = await prisma.post.findMany({
    include: {
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          role: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 1,
  })
  const likeCount = heroPost.map((post) => post._count?.likes)
  return { heroPost, likeCount }
}
export async function createDraft({
  title,
  description,
  body,
  postImg,
  userId,
  categories,
  createdBy,
}: Omit<CreateOrEditPost, 'id' & 'userId'> & { userId: User['id'] }) {
  await prisma.post.create({
    data: {
      title,
      description,
      body,
      postImg,
      createdBy,
      user: {
        connect: {
          id: userId,
        },
      },
      categories: {
        connectOrCreate: categories.map((category) => ({
          where: { name: category.name },
          create: { name: category.name },
        })),
      },
    },
  })
}

export async function getUserDrafts(userId: string) {
  const userDrafts = await prisma.post.findMany({
    where: {
      userId: userId,
      published: false,
    },
    include: {
      categories: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  return userDrafts
}

export async function updatePost({
  id,
  title,
  description,
  body,
  postImg,
  categories,
}: Omit<CreateOrEditPost, 'userId'> & { userId: User['id'] }) {
  try {
    const updatePost = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        description,
        body,
        postImg,

        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category.name },
            create: { name: category.name },
          })),
        },
      },
    })
  } catch (error) {
    throw new Error('Unable to save post draft')
  }
}
export async function updateAndPublish({
  id,
  title,
  description,
  body,
  postImg,
  categories,
}: CreateOrEditPost) {
  try {
    const updateAndPublish = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        description,
        body,
        postImg,
        published: true,
        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category.name },
            create: { name: category.name },
          })),
        },
      },
    })
  } catch (error) {
    throw new Error('Unable to update AND Publish post')
  }
}
export async function publishPost(id: string) {
  try {
    const publish = await prisma.post.update({
      where: { id: id },
      data: { published: true },
    })
    return publish
  } catch (error) {
    throw new Error('error in publish')
  }
}

export async function unpublishPost(id: string) {
  try {
    await prisma.post.update({
      where: { id: id },
      data: { published: false },
    })
    return true
  } catch (error) {
    throw new Error('error in unpublish')
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id: id },
    })
    return true
  } catch (error) {
    throw new Error('Unable to delete post')
  }
}

export async function getPostsByCategory(categoryName: string) {
  const postsByCategory = await prisma.post.findMany({
    where: {
      categories: {
        some: {
          name: categoryName,
        },
      },
    },
    include: {
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  return postsByCategory
}

export const updatePostWithCategory = async (form: UpdatePost) => {
  const selected = form.categories.map((category) => category.name) as []

  const updatedPostCategories = await prisma.post.update({
    where: {
      id: form.id,
    },
    data: {
      title: form.title,
      description: form.description,
      body: form.body,
      postImg: form.postImg,
      categories: {
        set: selected,
      },
    },
  })
}

export const removeCategoryFromPost = async (id: string, categoryName: string) => {
  const updatedPostCategories = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      categories: {
        disconnect: {
          name: categoryName,
        },
      },
    },
  })
  return updatedPostCategories
}

export const likePost = async (postId: string, userId: string) => {
  console.log('likePost functiondb', postId, 'user', userId)

  const liked = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      likes: {
        where: {
          userId: userId,
        },
      },
    },
  })

  if (!liked) {
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          connect: {
            id: userId,
          },
        },
      },
    })
  } else {
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          disconnect: {
            id: userId,
          },
        },
      },
    })
  }
}

// .then(()=>{
//   return  prisma.post.findUnique({
//     where: {
//       id: postId

//   },
//   select:{
//     likes: true,
//      _count: {
//         select: {
//           likes: true
//         }
//       }
//   }
//     })
// })
