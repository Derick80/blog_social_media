import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import Button from "~/components/shared/button";
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

  if (typeof title !== "string" || typeof body !== "string") {
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
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { title, body },
        form: action,
      },
      { status: 400 }
    );
  const draft = await createDraft({
    title,
    body,
    userId,
  });

  return redirect("drafts");
};

export default function NewPostRoute() {
  const { userId } = useLoaderData();
  const actionData = useActionData();
  const [errors, setErrors] = useState(actionData?.errors || {});
  console.log(actionData);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    userId: userId,
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

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-5xl font-extrabold">Write a New Post</div>

      <form
        method="post"
        className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4"
      >
        <FormField
          htmlFor="title"
          label="title"
          labelClass="uppercase"
          name="title"
          type="textarea"
          className="dark:text-black w-full p-2 rounded-xl my-2"
          value={formData.title}
          onChange={(event: any) => handleInputChange(event, "title")}
          error={errors?.title}
        />
        <FormField
          htmlFor="body"
          label="Content"
          labelClass="uppercase"
          name="body"
          type="textarea"
          className="dark:text-black w-full p-2 rounded-xl my-2"
          value={formData.body}
          onChange={(event: any) => handleInputChange(event, "body")}
          error={errors?.body}
        />
        <Button type="submit">Save as a Draft</Button>
      </form>
    </div>
  );
}
