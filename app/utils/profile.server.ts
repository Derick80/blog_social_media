import type { Profile } from "@prisma/client";
import { prisma } from "./prisma.server";

export const getUserProfile = async (role: string) => {
  return await prisma.profile.findFirst({
    where: { email: role },
  });
};
export const getProfile = async (profileId: string) => {
  return await prisma.profile.findFirst({
    where: { id: profileId },
  });
};

export async function updateProfile({
  id,
  firstName,
  lastName,
  bio,
  birthDay,
  currentLocation,
  pronouns,
  occupation,
  profilePicture,
}: Omit<Profile, "createdAt" | "updatedAt">) {
  return await prisma.profile.update({
    where: { id: id },
    data: {
      firstName,
      lastName,
      bio,
      birthDay,
      currentLocation,
      pronouns,
      occupation,
      profilePicture,
    },
  });
}
