import type { Post, User } from '@prisma/client'
import { prisma } from './prisma.server'
import type { CreateOrEditPost, UpdatePost } from './types.server'

export async function getPosts() {
  const userPosts = await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      categories: true,
      user: {
        select: {
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  return userPosts
}

export async function getPost({
  id,
  userId
}: Pick<Post, 'id'> & { userId: User['id'] }) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { user: { select: { email: true } }, categories: true }
  })
  return post
}

export async function createDraft({
  title,
  body,
  postImg,
  userId,
  categories
}: Omit<CreateOrEditPost, 'id' & 'userId'> & { userId: User['id'] }) {
  await prisma.post.create({
    data: {
      title,
      body,
      postImg,
      user: {
        connect: {
          id: userId
        }
      },
      categories: {
        connectOrCreate: categories.map(category => ({
          where: { name: category.name },
          create: { name: category.name }
        }))
      }
    }
  })
}

export async function getUserDrafts(userId: string) {
  const userDrafts = await prisma.post.findMany({
    where: {
      userId: userId,
      published: false
    },
    include: {
      user: {
        select: { email: true }
      },
      categories: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  return userDrafts
}

export async function updatePost({
  id,
  title,
  body,
  postImg,
  categories
}: Omit<CreateOrEditPost,  'userId'> & { userId: User['id'] }) {
  try {
    const updatePost = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        body,
        postImg,

      categories: {
        connectOrCreate: categories.map(category => ({
          where: { name: category.name },
          create: { name: category.name }
        }))
      }
    }
    })
  } catch (error) {
    throw new Error('Unable to save post draft')
  }
}
export async function updateAndPublish({
  id,
  title,
  body,
  postImg,
  categories
}: CreateOrEditPost) {
  try {
    const updateAndPublish = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        body,
        postImg,
        published: true,
        categories: {
          connectOrCreate: categories.map(category => ({
            where: { name: category.name },
            create: { name: category.name }
          }))
        }
      }
    })
  } catch (error) {
    throw new Error('Unable to update AND Publish post')
  }
}
export async function publishPost(id: string) {
  try {
    const publish = await prisma.post.update({
      where: { id: id },
      data: { published: true }
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
      data: { published: false }
    })
    return true
  } catch (error) {
    throw new Error('error in unpublish')
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id: id }
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
          name: categoryName
        }
      }
    },
    include: {
      user: {
        select: { email: true }
      },
      categories: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  return postsByCategory
}

export const updatePostWithCategory = async (form: UpdatePost) => {
  const selected = form.categories.map(category => category.name) as []

  const updatedPostCategories = await prisma.post.update({
    where: {
      id: form.id
    },
    data: {
      title: form.title,
      body: form.body,
      postImg: form.postImg,
      categories: {
        set: selected
      }
    }
  })
}

export const removeCategoryFromPost = async (
  id: string,
  categoryName: string
) => {
  const updatedPostCategories = await prisma.post.update({
    where: {
      id: id
    },
    data: {
      categories: {
        disconnect: {
          name: categoryName
        }
      }
    }
  })
  return updatedPostCategories
}
