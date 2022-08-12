import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { ImageUploader } from "~/components/image-uploader";
import Button from "~/components/shared/button";
import ContentContainer from "~/components/shared/content-container";
import FormField from "~/components/shared/form-field";

import { getUser, getUserId, requireUserId } from "~/utils/auth.server";
import { createDraft } from "~/utils/post.server";
import { validateText } from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const user = await getUser(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const role = await process.env.ADMIN;

  if (role != user?.email) {
    throw new Response("You are not authorized to edit this post", {
      status: 401,
    });
  }
  return json({ userId });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const postImg = formData.get("postImg");

  // || typeof body !== "string" || typeof postImg !== "string"

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof postImg !== "string"
  ) {
    return json(
      {
        error: "invalid form data",
        form: action,
      },
      { status: 400 }
    );
  }

  const errors = {
    title: validateText(title as string),

    body: validateText(body as string),
    postImg: validateText(postImg as string),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { title, body, postImg },
        form: action,
      },
      { status: 400 }
    );
  await createDraft({
    title,
    body,
    postImg,
    userId,
  });

  return redirect("drafts");
};

export default function NewPostRoute() {
  const { userId } = useLoaderData();
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState(actionData?.errors || {});
  console.log(actionData);
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
    body: actionData?.fields?.body || "",
    postImg: actionData?.fields?.postImg || "",

    userId: userId,
  });
  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    event.preventDefault();
    setFormData((form) => ({ ...form, [field]: event.target.value }));
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
      <div className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4">
        <div className="text-base md:text-5xl font-extrabold">
          Write a New Post
        </div>
        <form
          method="post"
          onSubmit={(e) =>
            !confirm("Are you sure?") ? e.preventDefault() : true
          }
          className="form-primary"
        >
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
            label=""
            labelClass="uppercase"
            name="postImg"
            type="hidden"
            value={formData.postImg}
            onChange={(event: any) => handleInputChange(event, "postImg")}
          />
          <Button type="submit">Save as a Draft</Button>
        </form>
        <ImageUploader
          onChange={handleFileUpload}
          postImg={formData.postImg || ""}
        />
      </div>
    </ContentContainer>
  );
}
