import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import Button from "~/components/shared/button";
import ContentContainer from "~/components/shared/content-container";
import FormField from "~/components/shared/form-field";
import Tooltip from "~/components/shared/tooltip";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getUserDrafts, publishPost } from "~/utils/post.server";

type LoaderData = {
  userDrafts: Array<{
    id: string;
    title: string;
    body: string;
    postImg: string;
    published: boolean;
  }>;
  id: string;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const id = params.postId as string;

  const { userDrafts } = await getUserDrafts(userId);
  let data: LoaderData = {
    userDrafts,
    id,
  };
  return json({ data });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  let formData = await request.formData();
  const id = formData.get("id");
  const action = formData.get("_action");
  switch (action) {
    case "publish": {
      if (typeof id !== "string") {
        return json({ error: "invalid form data publish" }, { status: 400 });
      }
      await publishPost(id);
      return redirect("/");
    }
  }
};
export default function Posts() {
  const { data } = useLoaderData();

  const [formData, setFormData] = useState({
    id: data.id,
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
    <ContentContainer>
      <div className="text-base md:text-5xl font-extrabold">Drafts</div>

      {data.userDrafts.map((post: any) => (
        <div
          key={post.id}
          className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 md:mt-4 md:mb-4"
        >
          <div className="flex flex-row">
            <h1 className="text-2xl my-6 border-b-2 text-center md:text-3xl">
              {post.title}
            </h1>
          </div>
          <div className="flex flex-col-reverse items-center p-2 md:flex md:flex-row md:p-2 md:space-x-10">
            <img
              src={post.postImg}
              alt="postimg"
              className="object-contain w-1/2 rounded"
            />
            <div className="flex flex-row p-2 my-3"> {post.body}</div>
            <form method="post" className="form-primary">
              <FormField
                htmlFor="id"
                label=""
                name="id"
                type="hidden"
                onChange={(event: any) => handleInputChange(event, "id")}
                value={formData.id}
              />
              <Tooltip message="Pulish Post">
                <Button type="submit" name="_action" value="publish">
                  Publish
                </Button>
              </Tooltip>
            </form>
          </div>

          <div className="flex flex-row justify-between p-2">
            <Tooltip message="Edit Post">
              <Link to={`/home/${post.id}`} className="text-red-600 underline">
                <span className="material-symbols-outlined text-5xl">edit</span>
              </Link>
            </Tooltip>{" "}
          </div>
        </div>
      ))}
    </ContentContainer>
  );
}

// to={`/posts/${post.id}`}

// to={post.id}
