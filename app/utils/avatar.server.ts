import { Avatar, User } from "@prisma/client";
import { prisma } from "./prisma.server";

export async function getAvatar(userId: string) {
  const avatar = await prisma.avatar.findUnique({
    where: {
      id: userId,
    },
  });
  return avatar;
}

export async function createAvatar({
  description,
  postImg,
  userId,
}: Omit<Avatar, "id"> & { userId: User["id"] }) {
  const avatar = await prisma.avatar.create({
    data: {
      id: userId,
      postImg: postImg,
      description: description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return avatar;
}
