import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import invariant from 'tiny-invariant'
import { ImageUploader } from '~/components/image-uploader'
import Button from '~/components/shared/button'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { getCategories } from '~/utils/categories.server'
import {
  deletePost,
  getPost,
  publishPost,
  unpublishPost,
  updateAndPublish,
  updatePost,
  updatePostWithCategory,
} from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'

type LoaderData = {
  post: {
    id: string
    description: string
    title: string
    body: string
    postImg: string
    published: boolean
    createdBy: string
    user: {
      email: string
    }
    categories: Array<{ id: string; name: string }>
  }
  categories: Array<{ id: string; name: string }>
  catResults: Array<{ id: string; name: string }>

  allCategories: Array<{ id: string; name: string }>

  currentUser: string
  isLoggedIn: boolean
}

// const badRequest = (data: ActionData) => {
//   json(data, { status: 400 })
// }
export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request))
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const { allCategories } = await getCategories()
  invariant(params.postId, `params.postId is required`);
  const currentUser = user?.id
  const post  =await getPost(params.postId)

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  if(!currentUser){
    throw new Response('Unauthorized', { status: 401 })
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
    categories,
    allCategories,
    catResults,
    currentUser,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request,params }) => {
  const userId = await getUserId(request)
  const postId = params.postId
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const createdBy = formData.get('createdBy')
  const categories = formData.getAll('categories') as string[]
  const action = formData.get('_action')
  const converted = categories.map((category) => {
    return { name: category }
  })

  if(!postId){
    return json({ postId: null }, { status: 404 })
  }
  if (!userId) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  if (
    typeof postId !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof body !== 'string' ||
    typeof userId !== 'string' ||
    typeof postImg !== 'string' ||
    typeof createdBy !== 'string' ||
    typeof categories !== 'object'

  ) {
    return json({ error: 'invalid form data category' }, { status: 400 })
  }

  const errors = {
    postId: validateText(postId),
    title: validateText(title as string),
    description: validateText(description as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
    createdBy: validateText(createdBy as string),
  }

  switch (action) {
    case 'save':
      if (Object.values(errors).some(Boolean))
        return json(
          {
            errors,
            fields: {
              postId,
              title,
              description,
              body,
              postImg,
              createdBy,
            },
            form: action,
          },
          { status: 400 }
        )
      await updatePost({
        id:postId,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories
      })
      return redirect(`/drafts`)
    case 'updateAndPublish':
      await updatePostWithCategory({
        id:postId,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories
      })
      console.log('update and publish', postId);
      return redirect(`/`)
    case 'publish':
      if (typeof postId !== 'string') {
        return json({ error: 'invalid form data publish' }, { status: 400 })
      }
      await publishPost(postId)
      console.log('published');
      return redirect('/')
    case 'unpublish':
      if (typeof postId !== 'string') {
        return json({ error: 'invalid form data unpublish' }, { status: 400 })
      }
      await unpublishPost(postId)
      return redirect('/drafts')
    case 'delete':
      if (typeof postId !== 'string') {
        return json({ error: 'invalid form data delete' }, { status: 400 })
      }
      await deletePost(postId)
      return redirect('/')

    default:
      throw new Error('Unexpected action')
  }
}
export default function PostRoute() {
  const data = useLoaderData<typeof loader>()

  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})

  const [formData, setFormData] = useState({
    id: data.post.id,
    title: data.post.title,
    description: data.post.description,
    body: data.post.body,
  postImg:  data.post.postImg,
    createdBy: data.post.createdBy,
    categories: data.catResults || data.categories,
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

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string
  ) => {
   const formData = new FormData()
    formData.append(field, event.target.value)
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
      <div className="flex flex-col items-center">
        <h1 className="mt-6 text-3xl font-semibold tracking-wide">Edit Post</h1>
        <small className="text-sm italic">
          {' '}
          {data.post?.published
            ? 'You are editing a published post'
            : 'you are editing a draft post'}
        </small>
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="postId"
            type="hidden"
            value={formData.id}
            onChange={(event) => handleInputChange(event, 'postId')}
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
            error={errors?.description}
          />
          {actionData?.fieldErrors?.description ? (
            <p role="alert" id="description-error">
              {actionData.fieldErrors.description}
            </p>
          ) : null}

              <FormField
                htmlFor="body"
                label="Write Your Post"
                name="body"
                className="form-field-primary"
                value={formData.body}
                onChange={(event) => handleInputChange(event, 'body')}
                error={errors?.body}
              />

             <FormField
              htmlFor="postImg"
              label="Post Image"
              type="hidden"
              name="postImg"
              value={formData.postImg}
              onChange={(event) => handleInputChange(event, 'postImg')}
            />


            <select
              name="categories"
              multiple={true}
              className="form-field-primary"
              onChange={(event) => handleSelectChange(event, 'categories')}
            >
              {data.catResults.map((option) => (
                <option
                  key={option.id}
                  value={option.name}
                  multiple={true}
                  defaultValue={option.checked ? true : false}
                >
                  {option.name}
                </option>
              ))}
            </select>

            <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />
          <div className="flex flex-row items-center justify-between py-2 md:py-4">
            {data?.post?.published ? (
              <>
                <div></div>
                <button type="submit" name="_action" value="save">
                  Save Post
                </button>
                <button type="submit" name="_action" value="unpublish">
                  Unpublish
                </button>
              </>
            ) : (
              <>
                <div></div>
                <button type="submit" name="_action" value="save">
                  Save Draft
                </button>
                <button type="submit" name="_action" value="publish">
                  Publish draft
                </button>
              </>
            )}

            <button type="submit" name="_action" value="delete">
              {data.post?.published ? 'Delete Post' : 'Delete Draft'}
            </button>

            <div></div>
          </div>
        </form>

      </div>
    </>
  )
}
