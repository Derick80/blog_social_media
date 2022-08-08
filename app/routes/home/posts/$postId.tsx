import type { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import FormField from "~/components/shared/form-field";
import { getUser, getUserId } from "~/utils/auth.server";
import { getPost } from "~/utils/post.server";
import { validateText } from "~/utils/validators.server";

type LoaderData = {
  post: Post;
  isOwner: boolean;
};
export const loader: LoaderFunction = async ({ params, request }) => {
  // 2
  let userId = await getUserId(request);
  const user = await getUser(request);

  const postId = params.postId as string;

  if (typeof postId !== "string") {
    return redirect("/");
  }

  let post = userId ? await getPost({ id: postId, userId }) : null;
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  let data: LoaderData = { post, isOwner: userId == post.userId };
  return json({ data, user });
};

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params.pstId as string;
  const userId = await getserId(request);
  let formData = await reqest.formData();
  const id 'id'rData.get("id");
  let title 'title'aa.get("title");
  let body 'body'Dta.get("body");
  if (
     'string'id !== "string" ||
      ty'string'le !== "string" ||
      t'string'dy !== "string" ||
      typ'string'Id !== "string"
  ) {
    return 'invalid form data'alid form data" }, { tatus : 400 });
  }

  const errors = {
    title : validateText(title as string),

    body : validateText(ody s string),
  };

  if (Object.values(errors).some(Boolean))
    return json(
        {
          errors,
          fields : {
            title,
           body,
          },
         form : action,
        },
        { statu : 400 }
    );
};
export default function PostRoute() {
  const { data, user } = useLoaderData()
  const actionData = useActionData()
  const [errors, setErrors] = useState(actionData?.errors || {})
  console.log(actionData)
  const [formData, setFormData] = useState({
    id : data.post.id,
    title : data.post.title,
    body : data.post.body
  })
  const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLFormElement>,
      field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field] : event.target.value
    }
    ))
  }
  return (
      <div className='w-full col-span-1 md:row-start-2 md:row-span-1 md:col-start-4 md:col-end-10 flex mx-auto max-w'>
        <div className='w-full flex flex-col items-center'>
          <form method='post'
                className='text-xl font-semibold'
          >
            <FormField
                htmlFor='id'
                label=''
                name='id'
                type='hidden'
                value={ formData.id }
                onChange={ (event: any) => handleInputChange(event, 'id') }
                error={ errors?.id }
            />
            <FormField
                htmlFor='title'
                label='title'
                name='title'
                value={ formData.title }
                onChange={ (event: any) => handleInputChange(event, 'title') }
                error={ errors?.title }
            />
            <FormField
                htmlFor='body'
                label='Content'
                name='body'
                type='textarea'
                className='w-full'
                value={ formData.body }
                onChange={ (event: any) => handleInputChange(event, 'body') }
                error={ errors?.body }
            />

            <div className='max-w-full text-container'>
              <button type='submit'>Save</button>
            </div>
          </form>
        </div>
      </div>
  )
}
