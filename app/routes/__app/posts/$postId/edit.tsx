import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { ImageUploader } from '~/components/image-uploader'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { getCategories } from '~/utils/categories.server'
import {
  deletePost,
  getPost,
  publishPost,
  unpublishPost,
  updatePost,
  updatePostWithCategory,
} from '~/utils/post.server'
import { QueriedCategories, SelectedCategories, SinglePost } from '~/utils/types.server'
import { validateText } from '~/utils/validators.server'
let nextId = 0

type LoaderData = {
  reducedPost: SinglePost
  initialCategoryList: SelectedCategories[]
  currentUser: string
  isLoggedIn: boolean
  selectedTags: string[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = await getUserId(request)
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const { initialCategoryList } = await getCategories()
  invariant(params.postId, `params.postId is required`)
  const currentUser = user?.id
  invariant(currentUser, `currentUser is required`)

  const { reducedPost } = await getPost(params.postId)

  if (!reducedPost) {
    throw new Response('Post not found', { status: 404 })
  }

  const data: LoaderData = {
    reducedPost,
    isLoggedIn,
    initialCategoryList,
    currentUser,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
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

  if (!postId) {
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
        id: postId,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories,
      })
      return redirect(`/drafts`)
    case 'updateAndPublish':
      await updatePostWithCategory({
        id: postId,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories,
      })
      console.log('update and publish', postId)
      return redirect(`/`)
    case 'publish':
      if (typeof postId !== 'string') {
        return json({ error: 'invalid form data publish' }, { status: 400 })
      }
      await publishPost(postId)
      console.log('published')
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
  const tagRef = useRef(null)

  const data = useLoaderData<typeof loader>()
  const defV = data.reducedPost.selectedTags.map((tag) => {
    return { id: nextId++, tag }
  })

  const [selected, setSelected] = useState(defV)
  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})

  console.log('defV', defV)

  const [formData, setFormData] = useState({
    id: data.reducedPost.id,
    title: data.reducedPost.title,
    description: data.reducedPost.description,
    body: data.reducedPost.body,
    postImg: data.reducedPost.postImg,
    createdBy: data.reducedPost.createdBy,
    categories: defV || data.categories,
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

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const newItems = [...defV.slice(0, 1), tagRef.current.value]
    setSelected(newItems)
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
          <div>
            {selected.map((item) => (
              <div className="mx-2 mt-2 flex md:mt-4">
                <label
                  className="h-fit max-w-full border-2 border-black p-1 text-center text-xs hover:cursor-pointer dark:border-white md:text-sm md:tracking-wide"
                  key={item.id}
                >
                  {item.tag.value}
                </label>
              </div>
            ))}

            <select
              name="categories"
              multiple={true}
              className="form-field-primary"
              onChange={(event) => handleSelectChange(event, 'categories')}
              defaultValue={data.selectedTags}
            >
              {data.initialCategoryList.map(({ option }: QueriedCategories) => (
                <option key={option?.id} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
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
