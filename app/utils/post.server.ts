import type { Post, User } from '@prisma/client'
import { prisma } from './prisma.server'
import type { CreateOrEditPost } from './types.server'

export async function getPosts(userId: string) {
  const userPosts = await prisma.post.findMany({
    where : {
      userId : userId
    },
    orderBy : {
      createdAt : 'asc'
    }
  })
  return { userPosts }
}

export async function getPost({
                                id,

                                userId
                              }: Pick<Post, 'id'> & { userId: User['id'] }) {
  return prisma.post.findUnique({
    where : { id : id }
  })
}

export async function createPost({
                                   title,
                                   body,
                                   userId
                                 }: Omit<CreateOrEditPost, 'id' & 'userId'> & { userId: User['id'] }) {
  await prisma.post.create({
    data : {
      title,
      body,
      user : {
        connect : {
          id : userId
        }
      }
    }
  })
}

export async function updatePost({
                                   id,
                                   title,
                                   body
                                 }: Omit<Post, 'createdAt' | 'updatedAt'>) {
  await prisma.post.update({
    where : { id : id },
    data : {
      title,
      body
    }
  })
}

export function deletePost({
                             id,
                             userId
                           }: Pick<Post, 'userId' | 'id'> & { userId: User['id'] }) {
  return prisma.post.deleteMany({
    where : { id, userId }
  })
}
