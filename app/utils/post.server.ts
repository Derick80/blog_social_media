import type { Post, User } from "@prisma/client";
import { prisma } from "./prisma.server";
import type { CreateOrEditPost } from "./types.server";

export async function getPosts() {
  const userPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return { userPosts };
}

export async function getPost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.findUnique({
    where: { id: id },
    include: { user: { select: { email: true } } },
  });
}

export async function createDraft({
  title,
  body,
  postImg,
  userId,
}: Omit<CreateOrEditPost, "id" & "userId"> & { userId: User["id"] }) {
  await prisma.post.create({
    data: {
      title,
      body,
      postImg,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getUserDrafts(userId: string) {
  const userDrafts = await prisma.post.findMany({
    where: {
      userId: userId,
      published: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return { userDrafts };
}

export async function updatePost({ id, title, body, postImg }: Partial<Post>) {
  await prisma.post.update({
    where: { id: id },
    data: {
      title,
      body,
      postImg,
    },
  });
}

export async function publishPost(id: string) {
  await prisma.post.update({
    where: { id: id },
    data: { published: true },
  });
}

export async function unpublishPost(id: string) {
  await prisma.post.update({
    where: { id: id },
    data: { published: false },
  });
}

export async function deletePost(id: string) {
  try {
    const post = prisma.post.delete({
      where: { id: id },
    });
  } catch (error) {
    throw new Error("Unable to delete post");
  }
}
