import { prisma } from "./prisma.server";

export const getUserProfile = async (userId: string) => {
  const userProfile = await prisma.profile.findFirst({
    where: { userId: userId },
  });
  return userProfile;
};
