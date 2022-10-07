import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import Uploader from '~/components/s3-uploader'
import FormField from '~/components/shared/form-field'
import { getUser, requireUserId } from '~/utils/auth.server'
import { createAvatar } from '~/utils/avatar.server'
import { validateText } from '~/utils/validators.server'

type LoaderData = {
  currentUser: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = await requireUserId(request)
  const currentUser = user?.id
  if (currentUser !== userId) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const data: LoaderData = {
    currentUser,
  }

  return json(data)
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    description: string | undefined
    postImg: string | undefined
  }
  fields?: {
    description: string
    postImg: string
  }
}

const badRequest = (data: ActionData) => {
  json(data, { status: 400 })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const description = formData.get('description')
  const postImg = formData.get('postImg')
  const currentUser = user?.id
  if (currentUser !== userId) {
    throw new Response('Unauthorized', { status: 401 })
  }
  if (typeof description !== 'string' || typeof postImg !== 'string') {
    return badRequest({
      formError: 'Please fill out all fields',
    })
  }

  const fieldErrors = {
    description: validateText(description),
    postImg: validateText(postImg),
  }

  const fields = { description, postImg }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  await createAvatar({
    ...fields,
    userId,
  })
  return redirect('/avatar')
}
export default function NewAvatarRoute() {
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData()

  const [formData, setFormData] = useState({
    description: actionData?.fields?.description || '',
    postImg: actionData?.fields?.postImg || '',
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-6 text-3xl font-semibold tracking-wide">New Avatar</h1>

      <form
        method="post"
        className="form-primary"
        onSubmit={(e) => (!confirm('Are you sure?') ? e.preventDefault() : true)}
      >
        <FormField
          htmlFor="description"
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={(event) => handleInputChange(event, 'description')}
        />
        <FormField
          htmlFor="postImg"
          label=""
          name="postImg"
          type="hidden"
          className=""
          value={formData.postImg}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, 'postImg')
          }
        />
      </form>
      <Uploader />
    </div>
  )
}
