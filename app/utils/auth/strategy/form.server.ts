import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'

import bcrypt from 'bcryptjs'
import { createUser, getUserPasswordHash } from '~/utils/user.server'
import { getUser } from '../auth.server'

export type AuthInput = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}
export const registerStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const firstName = form.get('firstName')
  const lastName = form.get('lastName')
  const password = form.get('password')

  if(typeof lastName !== 'string'
  || typeof email !== 'string'
  || typeof password !== 'string'
  || typeof firstName !== 'string'
  ) {
    throw new Error('lastName is not a string')
  }

  const existingUser = await getUser({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  const user = await createUser({ email, password, firstName, lastName } )
  return user.id
})

export const loginStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const password = form.get('password')

  invariant(typeof email === 'string', 'Email is not a string')
  invariant(typeof password === 'string', 'Password is not a string')
  const { user, passwordHash } = await getUserPasswordHash({ email })
  if (
    !user ||
    !passwordHash ||
    (passwordHash && !(await bcrypt.compare(password, passwordHash)))
  ) {
    throw new Error('Invalid email or password')
  }
  return user.id
})
