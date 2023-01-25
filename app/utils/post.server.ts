import { Post, Prisma, User } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "./prisma.server";
import { SavePost } from './types.server'

const defaultPostSelect = {
  id: true,
  title: true,
  description: true,
  body: true,
  postImg: true,
  createdBy: true,
  published: true,
  createdAt: true,
  userId: true,
  categories: true,
  likes: true,
  _count: {
    select: {
      likes: true,
    },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      email: true,
      lastName: true,
    },
  },
};

export async function getPosts() {
  const userPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: defaultPostSelect,
    orderBy: {
      createdAt: "asc",
    },
  });

  const likeCount = userPosts.map((post) => post._count?.likes);
  return { userPosts, likeCount };
}

export async function getPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          id: true,
        },
      },
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  invariant(post, "Post not found");

  const selectedPostCategories = post.categories.map((cat) => {
    return {
      id: cat.id,
      value: cat.name,
      label: cat.name,
      name: cat.name,
    };
  });

  invariant(selectedPostCategories, "No tags found");

  const reducedPost = {
    id: post.id,
    title: post.title,
    description: post.description,
    body: post.body,
    postImg: post.postImg,
    createdBy: post.createdBy,
    published: post.published,
    createdAt: post.createdAt.toISOString(),
    likes: post.likes,
    _count: post._count,
    likeCount: post._count.likes,
    userId: post.userId,
    user: post.user,
    selectedPostCategories,
  };
  return { reducedPost };
}

export async function getHeroPost() {
  const heroPost = await prisma.post.findMany({
    include: {
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          role: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 1,
  });
  const likeCount = heroPost.map((post) => post._count?.likes);
  return { heroPost, likeCount };
}
export async function createDraft({
  title,
  description,
  body,
  postImg,
  userId,
  correctedCategories,
  createdBy,
}: Omit<CreateOrEditPost, "id" & "userId"> & { userId: User["id"] }) {
  await prisma.post.create({
    data: {
      title,
      description,
      body,
      postImg,
      createdBy,
      user: {
        connect: {
          id: userId,
        },
      },
      categories: {
        connectOrCreate: correctedCategories.map((cat) => ({
          where: { name: cat.name },
          create: { name: cat.name },
        })),
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
      categories: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return userDrafts;
}

export async function savePost({
  postId,
  title,
  description,
  body,
  postImg,
  correctedCategories,
}: SavePost) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      description,
      body,
      postImg,
      categories: {
        set: correctedCategories,
      },
    },
  });
  return true;
}
export async function updatePost({
  id,
  title,
  description,
  body,
  postImg,
  createdBy,
  categories,
}: Omit<CreateOrEditPost, "userId"> & { userId: User["id"] }) {
  try {
    await prisma.post.update({
      where: { id: id },
      data: {
        title,
        description,
        body,
        postImg,
        createdBy,

        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
      },
    });
  } catch (error) {
    throw new Error("Unable to save post draft");
  }
}
export async function updateAndPublish({
  id,
  title,
  description,
  body,
  postImg,
  categories,
  createdBy,
}: CreateOrEditPost) {
  try {
    await prisma.post.update({
      where: { id: id },
      data: {
        title,
        description,
        body,
        postImg,
        createdBy,
        published: true,
        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
      },
    });
  } catch (error) {
    throw new Error("Unable to update AND Publish post");
  }
}
export async function publishPost(id: string) {
  try {
    const publish = await prisma.post.update({
      where: { id: id },
      data: { published: true },
    });
    return publish;
  } catch (error) {
    throw new Error("error in publish");
  }
}

export async function unpublishPost(id: string) {
  try {
    await prisma.post.update({
      where: { id: id },
      data: { published: false },
    });
    return true;
  } catch (error) {
    throw new Error("error in unpublish");
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id: id },
    });
    return true;
  } catch (error) {
    throw new Error("Unable to delete post");
  }
}

export async function getPostsByCategory(categoryName: string) {
  const postsByCategory = await prisma.post.findMany({
    where: {
      categories: {
        some: {
          name: categoryName,
        },
      },
    },
    include: {
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
      categories: true,

      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return postsByCategory;
}

export const updatePostWithCategory = async (form: UpdatePost) => {
  const selected = form.categories.map((category) => category) as [];
  console.log("selected", selected);

  await prisma.post.update({
    where: {
      id: form.id,
    },
    data: {
      title: form.title,
      description: form.description,
      body: form.body,
      postImg: form.postImg,
      createdBy: form.createdBy,
      categories: {
        set: selected,
      },
    },
  });
};

export const removeCategoryFromPost = async (
  id: string,
  categoryName: string
) => {
  const updatedPostCategories = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      categories: {
        disconnect: {
          name: categoryName,
        },
      },
    },
  });
  return updatedPostCategories;
};
