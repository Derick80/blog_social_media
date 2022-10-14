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
  categories: string[]

  userId: string
}

export interface UpdatePost {
  id: string
  title: string
  description: string
  body: string
  postImg: string

  createdBy: string
  categories: [string]
  userId: string
}

// use this type when transforming formData to db format
export interface CategoryForm {
  name: string
}
;[]

export interface UpdateCategoryForm {
  id: string
  name: string
}

export type QueriedPost = {
  createdAt: Date
  id: string
  createdBy: string
  title: string
  description: string
  body: string
  postImg: string
  likes: Like[]
  categories: Category[]
  _count: {
    likes: number
  }
  user: {
    id: string
    role: string
    firstName: string
    lastName: string
    email: string
  }
}

export type QueriedCategories = {
  option: {
    id: string
    name?: string
    value?: string
    label?: string
  }
}
export type SelectedCategories = {
  id: string
  value: string
  label: string
}

// Type for returned SIngle Post
export type SinglePost = {
  createdAt: string
  id: string
  createdBy: string
  title: string
  description: string
  body: string
  postImg: string
  published: boolean
  userId: string
  user: {
    id: string
    role?: string
    firstName: string
    lastName: string
    email: string
  }
  likes: Like[]
  _count: {
    likes: number
  }
  selectedTags: SelectedCategories[]
}
export type QueriedUser = Partial<User>

export type UserProfileToSerialize = Partial<Profile>

export type GetProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>

export type QueriedUserProfile = SerializeFrom<GetProfileType>
