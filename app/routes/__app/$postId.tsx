import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useCatch, useLoaderData, useParams } from '@remix-run/react'
import React, { useState } from 'react'
import { ImageUploader } from '~/components/image-uploader'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { deletePost, getPost, likePost, updatePost } from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'
import { getCategories } from '~/utils/categories.server'

type LoaderData = {
  post: {
    id: string
    description: string
    title: string
    body: string
    postImg: string
    user: {
      email: string
    }
    categories: Array<{ id: string; name: string }>
  }
  categories: Array<{ id: string; name: string }>
  catResults: Array<{ id: string; name: string }>

  allCategories: Array<{ id: string; name: string }>

  postId: string
  likeCount: number[]
  currentUser: string
  isLoggedIn: boolean
}

// const badRequest = (data: ActionData) => {
//   json(data, { status: 400 })
// }
export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const { allCategories } = await getCategories()

  const postId = params.postId
  const currentUser = user?.id as string

  if (!postId) {
    return json({ postId: null }, { status: 404 })
  }
  const post = userId ? await getPost({ id: postId }) : null
  const likeCount = post?.likes.length
  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }
  const email = post.user.email
  if (email != user?.email) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  const categories = post.categories.map((category) => category)

  const catResults = allCategories.map((category) => {
    const cat = categories.find((cat) => cat.id == category.id)
    if (cat) {
      return { ...category, checked: true }
    } else {
      return { ...category, checked: false }
    }
  })

  const data: LoaderData = {
    post,
    isLoggedIn,
    postId,
    categories,
    allCategories,
    catResults,
    likeCount,
    currentUser,
  }
  return json({
    data,
  })
}

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params.postId as string
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const formData = await request.formData()
  const id = formData.get('id')
  const currentUser = formData.get('currentUser')
  const title = formData.get('title')
  const description = formData.get('description')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const createdBy = formData.get('createdBy') as string
  const categories = formData.getAll('categories') as []

  const action = formData.get('_action')
  const converted = categories.map((category) => {
    return { name: category }
  })
  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof body !== 'string' ||
    typeof userId !== 'string' ||
    typeof postImg !== 'string' ||
    typeof categories !== 'object'
  ) {
    return json({ error: 'invalid form data category' }, { status: 400 })
  }

  const errors = {
    title: validateText(title as string),
    description: validateText(description as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
  }
  switch (action) {
    case 'save':
      if (Object.values(errors).some(Boolean))
        return json(
          {
            errors,
            fields: {
              title,
              description,
              body,
            },
            form: action,
          },
          { status: 400 }
        )

      await updatePost({
        id,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories: converted,
      })
      return redirect(`/`)

    case 'delete':
      if (typeof id !== 'string') {
        return json({ error: 'invalid form data delete' }, { status: 400 })
      }
      await deletePost(id)
      return redirect('/')
    case 'likePost':
      if (typeof postId !== 'string' || typeof currentUser !== 'string') {
        return json({ error: 'invalid form data likePost' }, { status: 400 })
      }
      await console.log(postId, currentUser)
      return
    default:
      throw new Error('Unexpected action')
  }
}
export default function PostRoute() {
  const { data, categories } = useLoaderData()
  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})

  const [formData, setFormData] = useState({
    id: data.post.id,
    title: data.post.title,
    description: data.post.description,
    body: data.post.body,
    postImg: data.post.postImg,
    createdBy: data.post.createdBy,
    categories: data.catResults || categories,
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }))
  }

  const handleFileUpload = async (file: File) => {
    const inputFormData = new FormData()
    inputFormData.append('postImg', file)
    const response = await fetch('/image', {
      method: 'POST',
      body: inputFormData,
    })

    const { imageUrl } = await response.json()
    console.log('imageUrl', imageUrl)

    setFormData({
      ...formData,
      postImg: imageUrl,
    })
  }

  return (
    <>
      <div>
        postidpage
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="id"
            type="hidden"
            value={formData.id}
            onChange={(event) => handleInputChange(event, 'id')}
            error={errors?.id}
          />{' '}
          <FormField
            htmlFor="createdBy"
            label=""
            name="createdBy"
            type="hidden"
            value={formData.createdBy}
            onChange={(event) => handleInputChange(event, 'createdBy')}
            error={errors?.createdBy}
          />{' '}
          <FormField
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            value={formData.title}
            onChange={(event) => handleInputChange(event, 'title')}
            error={errors?.title}
          />
          <FormField
            htmlFor="description"
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(event) => handleInputChange(event, 'description')}
            aria-invalid={Boolean(actionData?.fieldErrors?.description) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.description ? 'description-error' : undefined
            }
          />
          {actionData?.fieldErrors?.description ? (
            <p role="alert" id="description-error">
              {actionData.fieldErrors.description}
            </p>
          ) : null}
          <p>
            <label>
              Content
              <FormField
                htmlFor="body"
                label="Write Your Post"
                name="body"
                value={formData.body}
                onChange={(event: any) => handleInputChange(event, 'body')}
                aria-invalid={Boolean(actionData?.fieldErrors?.body) || undefined}
                aria-errormessage={actionData?.fieldErrors?.body ? 'body-error' : undefined}
              />
            </label>
          </p>
          <FormField
            htmlFor="postImg"
            label="Image"
            labelClass="uppercase"
            name="postImg"
            value={formData.postImg}
            onChange={(event) => handleInputChange(event, 'postImg')}
          />{' '}
          <div>
            <label>Tag your post </label>

            <select
              name="categories"
              multiple={true}
              className="form-field-primary min-h-full"
              onChange={(event) => handleInputChange(event, 'categories')}
            >
              {data.catResults.map((option) => (
                <option
                  key={option.id}
                  value={option.name}
                  selected={option.checked ? true : false}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />
          <div>
            <button type="submit" name="_action" value="save">
              Save Post
            </button>

            <button type="submit" name="_action" value="delete">
              Delete
            </button>

            <div></div>
          </div>
        </form>
      </div>
    </>
  )
}
