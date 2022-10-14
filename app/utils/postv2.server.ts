import invariant from 'tiny-invariant'
import { prisma } from './prisma.server'
import { CategoryForm } from './types.server'

const defaultMiniPostSelect = {
  id: true,
  title: true,
  body: true,
  published: true,
  userId: true,
  categories: true,
}
export async function getMiniPosts() {
  const miniPosts = await prisma.miniPost.findMany({
    select: defaultMiniPostSelect,
  })

  return miniPosts
}

export async function getMiniPostById(id: string) {
  const miniPost = await prisma.miniPost.findUnique({
    where: {
      id: id,
    },
    select: defaultMiniPostSelect,
  })

  invariant(miniPost, 'MiniPost not found')
  const selectedCategories = miniPost.categories.map((category) => {
    return {
      id: category.id,
      value: category.name,
      label: category.name,
    }
  })
  const minifiedPost = {
    id: miniPost.id,
    title: miniPost.title,
    body: miniPost.body,
    userId: miniPost.userId,
    selectedCategories,
  }

  return { minifiedPost }
}

export async function editMiniPostCategories(postId: string, correctedCategories: CategoryForm[]) {
  const miniPost = await prisma.miniPost.update({
    where: {
      id: postId,
    },
    data: {
      categories: {
        set: correctedCategories,
      },
    },
  })

  return miniPost
}
