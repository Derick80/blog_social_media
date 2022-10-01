import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'

import { prisma } from './prisma.server'
import type { LoginForm, RegisterForm } from './types.server'
import { createUser } from './user.server'

const secret = process.env.SESSION_SECRET
if (!secret) {
  throw new Error('SESSION_SECRET is not set')
}

export const register = async (form: RegisterForm) => {
  const exists = await prisma.user.count({ where: { email: form.email } })

  if (exists) {
    return json(
      {
        error: `User already exists with that email`,
      },
      { status: 400 }
    )
  }
  const newUser = await createUser(form)

  if (!newUser) {
    return json(
      {
        error: `somethign went wrong trying to create a user`,
        fields: {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        },
      },
      { status: 400 }
    )
  }
  return createUserSession(newUser.id, '/')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'app-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [secret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

// placing requireUserId in a route makes the route only accessible by a logged in user
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export const login = async (form: LoginForm) => {
  const user = await prisma.user.findUnique({
    where: { email: form.email },
  })

  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json(
      {
        error: `Incorrect Login`,
      },
      { status: 400 }
    )
  }
  return createUserSession(user.id, '/')
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })
    return user
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
