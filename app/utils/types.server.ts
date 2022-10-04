import { Category, Like, Post, Profile, User } from '@prisma/client'
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
  description: string
  body: string
  postImg: string
  createdBy: string
  categories: Array<{
    name: string
  }>

  userId: string
}

export interface UpdatePost {
  id: string
  title: string
  description: string
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



export type QueriedPost = Partial<Post> & {
  createdAt: string | Date
  id: string

  isLiked?: boolean | null
  likes: Like[]
  categories?: Category[]
  _count: {
    likes?: number
  }
  user: {
    role: string
    firstName: string
    lastName: string
  }

}

export type QueriedUser = Partial<User>

export type UserProfileToSerialize = Partial<Profile>

export type GetProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>

export type QueriedUserProfile = SerializeFrom<GetProfileType>
