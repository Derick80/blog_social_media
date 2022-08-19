import type { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { ImageUploader } from "~/components/image-uploader";
import Button from "~/components/shared/button";
import ContentContainer from "~/components/shared/content-container";
import FormField from "~/components/shared/form-field";
import Tooltip from "~/components/shared/tooltip";
import { getUser, getUserId } from "~/utils/auth.server";
import {
  deletePost,
  getPost,
  publishPost,
  updatePost,
} from "~/utils/post.server";
import { validateText } from "~/utils/validators.server";

interface IPost extends Post {
  user: { email: string };
}

type LoaderData = {
  post: Post;
  isPublished: boolean;
};
export const loader: LoaderFunction = async ({ params, request }) => {
  let userId = await getUserId(request);
  const user = await getUser(request);
  const postId = params.postId as string;

  let post = userId ? await getPost({ id: postId, userId }) : null;
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  let isPublished = post.published;
  let email = post.user.email;
  if (email != user?.email) {
    throw new Response("You are not authorized to edit this post", {
      status: 401,
    });
  }
  let data: LoaderData = {
    post,
    isPublished,
  };
  return json({ data, user, isPublished });
};

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params.postId as string;
  const userId = await getUserId(request);
  let formData = await request.formData();
  const id = formData.get("id");
  let published = formData.get("published");
  let title = formData.get("title");
  let body = formData.get("body");
  let postImg = formData.get("postImg");

  const action = formData.get("_action");
  switch (action) {
    case "save":
      if (
        typeof id !== "string" ||
        typeof title !== "string" ||
        typeof body !== "string" ||
        typeof userId !== "string" ||
        typeof postImg !== "string"
      ) {
        return json({ error: "invalid form data" }, { status: 400 });
      }

      const errors = {
        title: validateText(title as string),

        body: validateText(body as string),
      };

      if (Object.values(errors).some(Boolean))
        return json(
          {
            errors,
            fields: {
              title,
              body,
            },
            form: action,
          },
          { status: 400 }
        );
      await updatePost({ id, userId, title, body, postImg });
      return redirect("/");
    case "publish":
      if (typeof id !== "string") {
        return json({ error: "invalid form data publish" }, { status: 400 });
      }
      await publishPost(id);
      return redirect("/");
    case "unpublish":
      if (typeof id !== "string") {
        return json({ error: "invalid form data unpublish" }, { status: 400 });
      }
      await publishPost(id);
      return redirect("/");
    case "delete":
      if (typeof id !== "string") {
        return json({ error: "invalid form data delete" }, { status: 400 });
      }
      await deletePost(id);
      return redirect("/");
    default:
      return json({ error: "invalid form data general" }, { status: 400 });
  }
};
export default function PostRoute() {
  const { data, user, isPublished } = useLoaderData();
  const actionData = useActionData();
  const [errors, setErrors] = useState(actionData?.errors || {});
  console.log(actionData);
  const [formData, setFormData] = useState({
    id: data.post.id,
    title: data.post.title,
    body: data.post.body,
    published: data.post.published,
    postImg: data.post.postImg,
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLFormElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };
  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData();
    inputFormData.append("postImg", file);
    const response = await fetch("/image", {
      method: "POST",
      body: inputFormData,
    });

    const { imageUrl } = await response.json();
    console.log("imageUrl", imageUrl);

    setFormData({
      ...formData,
      postImg: imageUrl,
    });
  };

  return (
    <ContentContainer>
      <div className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 md:mt-4 mb-4">
        <div className="text-base md:text-5xl font-extrabold">
          Edit, Publish, unPublish, or Delete Post
        </div>

        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="id"
            type="hidden"
            value={formData.id}
            onChange={(event: any) => handleInputChange(event, "id")}
            error={errors?.id}
          />{" "}
          <FormField
            htmlFor="title"
            label="title"
            labelClass="uppercase"
            name="title"
            type="textarea"
            value={formData.title}
            onChange={(event: any) => handleInputChange(event, "title")}
            error={errors?.title}
          />
          <p>
            <label className="uppercase">
              Content:{" "}
              <textarea
                name="body"
                className="form-field-primary"
                value={formData.body}
                onChange={(event: any) => handleInputChange(event, "body")}
              />
            </label>
          </p>
          <FormField
            htmlFor="postImg"
            label="Post Image"
            labelClass="uppercase"
            name="postImg"
            value={formData.postImg}
            onChange={(event: any) => handleInputChange(event, "postImg")}
          />
          <ImageUploader
            onChange={handleFileUpload}
            postImg={formData.postImg || ""}
          />
          {formData.published ? (
            <>
              <div className="max-w-full flex flex-row flex-end text-container">
                <Tooltip message="unpublish this post">
                  <Button type="submit" name="_action" value="unpublish">
                    UnPublish
                  </Button>
                </Tooltip>
                <Tooltip message="unpublish this post">
                  <Button type="submit" name="_action" value="delete">
                    Delete
                  </Button>
                </Tooltip>
                <div className="max-w-full text-container">
                  <Tooltip message="Save and Publish">
                    <Button type="submit">Save & Publish Post</Button>
                  </Tooltip>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-full text-container">
              <Tooltip message="Save and Publish">
                <Button type="submit" name="_action" value="save">
                  Save & Publish Post
                </Button>
              </Tooltip>
              <Tooltip message="unpublish this post">
                <Button type="submit" name="_action" value="delete">
                  Delete
                </Button>
              </Tooltip>
              <div className="max-w-full text-container">
                <Tooltip message="Save and Publish">
                  <Button type="submit" name="_action" value="publish">
                    {" "}
                    Publish Post
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
        </form>
      </div>
    </ContentContainer>
  );
}
