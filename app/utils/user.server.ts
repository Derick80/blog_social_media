import type { RegisterForm } from './types.server'

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = await prisma.user.create({
    data : {
      email : user.email,

      password : passwordHash
    }
  })
  return { id : newUser.id, email : user.email }
}
