import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import {Prisma, User as PrismaUser} from '@prisma/client'

export const defaultUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
}
export type User = Pick<PrismaUser, "id" | "email" | "firstName" | "lastName" | "role">;
export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,

      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  return { id: newUser.id, email: user.email };
};
export const getUserPasswordHash = async (
  input: Prisma.UserWhereUniqueInput
) => {
  const user = await prisma.user.findUnique({
    where: input
  })
  if (user) {
    return {
      user: { ...user, password: null },
      passwordHash: user.password
    }
  }
  return { user: null, passwordHash: null }
}