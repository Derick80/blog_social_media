import type {Post, User} from '@prisma/client'
import {prisma} from './prisma.server'
import type {CreateOrEditPost} from './types.server'

export async function getPosts() {
  const userPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      categories: true,
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
  console.log("ts userPosts", { userPosts });
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
    include: {
        user: {
            select: {email: true}
        }
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return { userDrafts };
}

export async function updatePost({ id, title, body, postImg }: Partial<Post>) {
  try{
    const  updatePost = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        body,
        postImg,
      },
    });
    return { updatePost };
  } catch (error) {
    throw new Error("Unable to save post draft");
  }
}
export async function updateAndPublish({ id, title, body, postImg }: Partial<Post>) {
  try{
    const  updateAndPublish = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        body,
        postImg,
        published: true,
      },
    });
    return { updateAndPublish };
  } catch (error) {
    throw new Error("Unable to update AND Publish post");
  }
}
export async function publishPost(id: string) {
 try{
   const publish =  await prisma.post.update({
     where: { id: id },
     data: { published: true },
   });
    return publish;
    }catch(error){
      throw new Error("error in publish");
    }

}

export async function unpublishPost(id: string) {
  try{
   await prisma.post.update({
      where: { id: id },
      data: { published: false },
    });
    return true;
  }catch (error){
    throw new Error("error in unpublish");
  }
}

export async function deletePost(id: string) {
  try {
   await prisma.post.delete({
      where: { id: id },
    });
    return true
  } catch (error) {
    throw new Error("Unable to delete post");
  }
}
