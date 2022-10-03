import { Prisma } from '@prisma/client'
import type { Post, User } from '@prisma/client'
import { prisma } from './prisma.server'
import { SerializeFrom } from '@remix-run/node'

export type PostProp = Partial<Post> & {
  createdBy?: string | null
  likeCount?: number | null
  isLiked?: boolean | null
  commentCount?: number | null
  comments?: Post[]
}

export type SerializedPost = SerializeFrom<PostProp>
export const getLikeList = async (user: User | null) => {
  const list = await prisma.like.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return list
}

export const getPostLike = async (input: Prisma.LikePostIdUserIdCompoundUniqueInput) => {
  const like = await prisma.like.findUnique({
    where: {
      postId_userId: input,
    },
  })

  return like
}
export const createLike = async (input: Prisma.LikeCreateInput) => {
  const created = await prisma.like.create({
    data: input,
  })

  return created
}

export const deleteLike = async (input: Prisma.LikePostIdUserIdCompoundUniqueInput) => {
  const deleted = prisma.like.delete({
    where: {
      postId_userId: input,
    },
  })

  return deleted
}

export async function getLikeCounts() {
  const maxLikes = await prisma.like.aggregate({
    _count: {
      _all: true,
    },
    _max: {
      postId: true,
    },
  })
  return maxLikes
}
