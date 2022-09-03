import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useEffect, useRef, useState } from 'react'
import { ImageUploader } from '~/components/image-uploader'
import Button from '~/components/shared/button'
import FormField from '~/components/shared/form-field'

import { getUser, getUserId, requireUserId } from '~/utils/auth.server'
import { createDraft } from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'
import { getCategories } from '~/utils/categories.server'
import Sectionheader from '~/components/shared/section-header'
export function ErrorBoundary () {
  return (
    <div className="error-container">
      Sorry, something went wrong loading the create new Post page.  Please try again later!
    </div>
  )
}
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  const user = await getUser(request)
  const { categories } = await getCategories()

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 })
  }

  const role = await process.env.ADMIN

  if (role != user?.email) {
    throw new Response("You are not authorized to edit this post", {
      status: 401,
    })
  }
  return json({ userId, categories })
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    title: string | undefined
    body: string | undefined
    categories?: object | undefined
    postImg: string | undefined
  }
  fields?: {
    title: string
    body: string
    postImg: string

  }
  categories?: Array<{ id: string; name: string }>

}

const badRequest = (data: ActionData) => {
  json(data, { status: 400 })
}
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get("title")
  const body = formData.get("body")
  const postImg = formData.get("postImg")
  const categories = formData.getAll('categories') as []


  // || typeof body !== "string" || typeof postImg !== "string"

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof postImg !== "string" ||
    typeof categories !== 'object'
  ) {
    return badRequest({
      formError: "Form not submitted correctly",
    })
  }

  const fieldErrors = {
    title: validateText(title as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
  }

  const fields = { title, body, postImg }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors, fields
    })
  }

  const converted = categories.map((category) => { return { name: category } })

  await createDraft({
    ...fields,
    userId,
    categories: converted,
  })

  return redirect("drafts")
}

export default function NewPostRoute () {
  const { userId, categories } = useLoaderData()
  const actionData = useActionData()
  const firstLoad = useRef(true)
  const [formError, setFormError] = useState(actionData?.error || "")
  const [errors, setErrors] = useState(actionData?.errors || {})
  console.log(actionData)
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
    body: actionData?.fields?.body || "",
    postImg: actionData?.fields?.postImg || "",
    categories: actionData?.categories || [],

    userId: userId,
  })
  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("")
    }
  }, [formData])

  useEffect(() => {
    firstLoad.current = false
  }, [])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }
  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData()
    inputFormData.append("postImg", file)
    const response = await fetch("/image", {
      method: "POST",
      body: inputFormData,
    })

    const { imageUrl } = await response.json()
    console.log("imageUrl", imageUrl)

    setFormData({
      ...formData,
      postImg: imageUrl,
    })
  }
  return (

    <>
      <div className="w-full md:w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4">
        <Sectionheader>
          Write a new post
        </Sectionheader>
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
          { formError }
        </div>
        <form
          method="post"
          onSubmit={ (e) =>
            !confirm("Are you sure?") ? e.preventDefault() : true
          }
          className="form-primary"
        >
          <FormField
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            value={ formData.title }
            onChange={ (event: any) => handleInputChange(event, "title") }
            aria-invalid={
              Boolean(actionData?.fieldErrors?.title) ||
              undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.title
                ? "title-error"
                : undefined
            }
          />
          { actionData?.fieldErrors?.title ? (
            <p className="form-validation-error"
              role="alert"
              id="title-error">
              { actionData.fieldErrors.title }
            </p>
          ) : null }
          <p>
            <label className="uppercase">
              Content:{ " " }
              <textarea
                name="body"
                className="form-field-primary"
                value={ formData.body }
                onChange={ (event: any) => handleInputChange(event, "body") }
              />
            </label>
          </p>
          <div>
            <select className="text-black dark:text-white dark:bg-gray-400" name="categories"
              multiple={ true }
              onChange={ (event: any) => handleInputChange(event, "categories") }

            >
              { categories.map((option) => (
                <option key={ option.id } value={ option.name }>
                  { option.name }
                </option>
              )) }

            </select>
          </div>
          <FormField
            htmlFor="postImg"
            label=""
            labelClass="uppercase"
            name="postImg"
            type="hidden"
            value={ formData.postImg }
            onChange={ (event: any) => handleInputChange(event, "postImg") }
          />
          <Button type="submit">Save as a Draft</Button>
        </form>
        <ImageUploader
          onChange={ handleFileUpload }
          postImg={ formData.postImg || "" }
        />
      </div>
    </>
  )
}
