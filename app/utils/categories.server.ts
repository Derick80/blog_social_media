import { prisma } from './prisma.server'
import { CategoryForm, UpdateCategoryForm } from '~/utils/types.server'
import { json } from '@remix-run/node'

export async function getCategories() {
  const allCategories = await prisma.category.findMany({})
  return { allCategories }
}

export const createCategory = async (form: CategoryForm) => {
  const exists = await prisma.category.count({ where: { name: form.name } })

  if (exists) {
    return json(
      {
        error: `Category already exists`,
      },
      { status: 400 }
    )
  }
  const newCategory = await prisma.category.create({
    data: {
      name: form.name,
    },
  })

  if (!newCategory) {
    return json(
      {
        error: `Something went wrong trying to create a category`,
        fields: {
          name: form.name,
        },
      },
      { status: 400 }
    )
  }
  return { newCategory }
}

export async function updateCategory(form: UpdateCategoryForm) {
  const category = await prisma.category.update({
    where: { id: form.id },
    data: { name: form.name },
  })
  return category
}

// only use this in the categories page
export async function deleteCategory(categoryName: string) {
  try {
    await prisma.category.delete({
      where: {
        name: categoryName,
      },
    })
  } catch (error) {
    throw new Error('Unable to delete category')
  }
}

export async function getCategoryCounts(){
  const catCounts = await prisma.category.findMany({
     include:{
      posts:true,
      _count:{
        select:{
          posts:true
        }
      }
     }
  })
  return catCounts
}