import { Category, Post } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
}

// Authinput will eventually replace login/reg form
export interface AuthInput {
  email: string
  password: string
  redirectTo?: string
  token?: string
}
export interface CreateOrEditPost {
  id?: string
  title: string
  body: string
  postImg: string
  categories: Array<{
    name: string
  }>

  userId: string
}

export interface UpdatePost {
  id: string
  title: string
  body: string
  postImg: string
  categories: Array<{
    name: string
  }>
  userId: string
}

export interface CategoryForm {
  name: string
}

export interface UpdateCategoryForm {
  id: string
  name: string
}

export type SPost = Partial<Post> & {
  createdBy?: string | null
  likeCount?: number | null
  isLiked?: boolean | null
  commentCount?: number | null
  comments?: Post[]
  categories?: Category[]
}

export type SerializedPost = SerializeFrom<SPost>
