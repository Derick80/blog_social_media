import type { Profile } from '@prisma/client'
import { prisma } from './prisma.server'

export const getOwnerProfile = async (email: string) => {
  const userProfile = await prisma.profile.findFirst({
    where: { email: email },
  })
  return userProfile
}
export const getUserProfile = async (userId: string) => {
  const userProfile = await prisma.profile.findFirst({
    where: { userId: userId },
  })
  return userProfile
}
export const getProfile = async (profileId: string) => {
  return await prisma.profile.findFirst({
    where: { id: profileId },
  })
}

export async function updateProfile({
  userId,
  id,
  firstName,
  lastName,
  bio,
  title,
  currentLocation,
  pronouns,
  occupation,
  profilePicture,
  email,
}: Omit<Profile, 'createdAt' | 'updatedAt'>) {
  return await prisma.profile.update({
    where: { id: id },
    data: {
      userId,
      firstName,
      lastName,
      bio,
      title,
      currentLocation,
      pronouns,
      occupation,
      profilePicture,
      email,
    },
  })
}
