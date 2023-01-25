import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useActionData, useLoaderData } from "@remix-run/react"
import React, { useEffect, useRef, useState } from "react"
import { ImageUploader } from "~/components/image-uploader"
import FormField from "~/components/shared/form-field"
import { getUser, requireUserId } from "~/utils/auth.server"
import { createDraft } from "~/utils/post.server"
import { validateText } from "~/utils/validators.server"
import { getCategories } from "~/utils/categories.server"
import { CategoryForm, FullCategoryListDestructure } from "~/utils/types.server"

import quillCss from 'quill/dist/quill.snow.css'
import TipTap from '~/components/tip-tap'
import invariant from 'tiny-invariant'
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: quillCss }
]
type LoaderData = {
  fullCategoryList: FullCategoryListDestructure[]
  isAdmin: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const { fullCategoryList } = await getCategories()
  invariant(user, "User is not available")
  const isAdmin = user.role == "ADMIN"

  if (!isAdmin) {
    throw new Response("Unauthorized", { status: 401 })
  }
  if (!fullCategoryList) {
    throw new Response("No Categories", { status: 404 })
  }

  const data: LoaderData = {
    fullCategoryList,
    isAdmin,
  }

  return json(data)
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    title: string | undefined
    description: string | undefined
    body: string | undefined
    categories?: object | undefined
    postImg: string | undefined
  }
  fields?: {
    title: string
    description: string
    body: string
    postImg: string
  }
  categories?: Array<{ id: string; name: string }>
}

const badRequest = (data: ActionData) => {
  json(data, { status: 400 })
}
export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get("title")
  const body = formData.get("body")
  const description = formData.get("description")
  const postImg = formData.get("postImg")
  const createdBy = user?.firstName
  const categories = formData.getAll("categories")

  // || typeof body !== "string" || typeof postImg !== "string"

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof body !== "string" ||
    typeof postImg !== "string" ||
    typeof categories !== "object" ||
    typeof createdBy !== "string"
  ) {
    return badRequest({
      formError: "Form not submitted correctly",
    })
  }

  const fieldErrors = {
    title: validateText(title as string),
    description: validateText(description as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
    createdBy: validateText(createdBy),
  }

  const fields = { title, description, body, postImg, createdBy }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    })
  }

  const correctedCategories = categories.map((cat) => {
    return {
      name: cat,
    }
  }) as CategoryForm[]

  await createDraft({
    ...fields,
    userId,
    correctedCategories,
  })

  return redirect("/")
}

export default function NewPostRoute () {
  const { fullCategoryList } = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const firstLoad = useRef(true)
  const [formError, setFormError] = useState(actionData?.error || "")
  const [errors, setErrors] = useState(actionData?.errors || {})
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
    description: actionData?.fields?.description || "",
    body: actionData?.fields?.body || "",
    postImg: actionData?.fields?.postImg || "",
    categories: actionData?.categories || [],
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }
  const handleFileUpload = async (file: File) => {
    const inputFormData = new FormData()
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
    <div className="flex flex-col items-center">
      <div>{ formError }</div>
      <h1 className="mt-6 text-3xl font-semibold tracking-wide">
        Write a new Post
      </h1>
      <form
        method="post"
        className="form-primary"
        onSubmit={ (e) =>
          !confirm("Are you sure?") ? e.preventDefault() : true
        }
      >
        <FormField
          htmlFor="title"
          label="Title"
          name="title"
          type="textarea"
          value={ formData.title }
          onChange={ (event) => handleInputChange(event, "title") }
          aria-invalid={ Boolean(actionData?.fieldErrors?.title) || undefined }
          aria-errormessage={
            actionData?.fieldErrors?.title ? "title-error" : undefined
          }
        />
        { actionData?.fieldErrors?.title ? (
          <p role="alert" id="title-error">
            { actionData.fieldErrors.title }
          </p>
        ) : null }
        <FormField
          htmlFor="description"
          label="Description"
          name="description"
          type="textarea"
          value={ formData.description }
          onChange={ (event) => handleInputChange(event, "description") }
          aria-invalid={
            Boolean(actionData?.fieldErrors?.description) || undefined
          }
          aria-errormessage={
            actionData?.fieldErrors?.description
              ? "description-error"
              : undefined
          }
        />
        { actionData?.fieldErrors?.description ? (
          <p role="alert" id="description-error">
            { actionData.fieldErrors.description }
          </p>
        ) : null }
        <div className='flex'>

        </div>
        <TipTap />
        {/* <FormField
          htmlFor="body"
          label="Write Your Post"
          name="body"
          type="textarea"
          className=""
          value={formData.body}
          onChange={(event) => handleInputChange(event, "body")}
          aria-invalid={Boolean(actionData?.fieldErrors?.body) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.body ? "body-error" : undefined
          }
        /> */}
        <div>
          <label>Tag your post </label>
          <select
            name="categories"
            multiple={ true }
            className="form-field-primary min-h-full"
            onChange={ (event: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange(event, "categories")
            }
          >
            { fullCategoryList.map((option) => (
              <option key={ option.id } value={ option.value }>
                { option.label }
              </option>
            )) }
          </select>
        </div>
        <FormField
          htmlFor="postImg"
          label=""
          name="postImg"
          type="hidden"
          className=""
          value={ formData.postImg }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, "postImg")
          }
        />
        <ImageUploader
          onChange={ handleFileUpload }
          postImg={ formData.postImg || "" }
        />
        <div className="flex items-center justify-center py-2 md:py-4">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}
