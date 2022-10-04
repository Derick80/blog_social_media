import type { Profile, Pronouns } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import { SelectBox } from '~/components/shared/select-box'
import { getUser, getUserId } from '~/utils/auth.server'
import { pronouns } from '~/utils/constants'
import { getProfile, updateProfile } from '~/utils/profile.server'
import { validateEmail, validateName, validateText } from '~/utils/validators.server'
import { ImageUploader } from '~/components/image-uploader'

type LoaderData = {
  profile: Profile
  userId: string
  isOwner: boolean
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request)) as string
  const profileId = params.profileId as string
  const user = await getUser(request)
  const isOwner = user?.role === 'ADMIN'

  const profile = userId ? await getProfile(profileId) : null
  if (!profile) {
    throw new Response('Profile not found', { status: 404 })
  }
  const data: LoaderData = {
    profile,
    userId,
    isOwner,
  }

  if (!isOwner) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  return json({ data })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  const profileId = params.profileId as string

  const formData = await request.formData()
  const id = formData.get('id')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const bio = formData.get('bio')
  const title = formData.get('title')
  const currentLocation = formData.get('currentLocation')
  const pronouns = formData.get('pronouns')
  const occupation = formData.get('occupation')
  const postImg = formData.get('postImg')
  const email = formData.get('email')

  if (
    typeof id !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof bio !== 'string' ||
    typeof currentLocation !== 'string' ||
    typeof occupation !== 'string' ||
    typeof pronouns !== 'string' ||
    typeof userId !== 'string' ||
    typeof email !== 'string' ||
    typeof title !== 'string' ||
    typeof postImg !== 'string'
  ) {
    return json({ error: 'invalid form data' }, { status: 400 })
  }
  const errors = {
    firstName: validateText(firstName as string),
    lastName: validateText(lastName as string),
    bio: validateText(bio as string),
    currentLocation: validateText(currentLocation as string),
    occupation: validateText(occupation as string),
    pronouns: validateName(pronouns),
    email: validateEmail(email as string),
    title: validateText(title as string),
  }

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: {
          firstName,
          lastName,
          bio,
          currentLocation,
          occupation,
          pronouns,
          email,
          title,
        },
        form: action,
      },
      { status: 400 }
    )

  await updateProfile({
    userId: userId,
    id: profileId,
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    currentLocation: currentLocation,
    occupation: occupation,
    pronouns: pronouns as Pronouns,
    profilePicture: postImg,
    email: email,
    title: title,
  })
  return redirect('/about')
}

export default function ProfileRoute() {
  const { data } = useLoaderData()
  const actionData = useActionData()
  const [errors, setErrors] = useState(actionData?.errors || {})
  const [formData, setFormData] = useState({
    id: data.profile.id,
    firstName: data.profile.firstName,
    lastName: data.profile.lastName,
    bio: data.profile.bio,
    birthDay: data.profile.birthDay,
    currentLocation: data.profile.currentLocation,
    pronouns: actionData?.fields?.pronouns || data.profile.pronouns || 'THEY',
    occupation: data.profile.occupation,
    postImg: data.profile.profilePicture,
    email: data.profile.email || '',
    title: data.profile.title || '',
  })
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLFormElement>,
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
    <main className="col-span-1 mx-auto  flex w-full max-w-7xl justify-between text-center md:col-start-2 md:col-end-10">
      <div className="flex w-full flex-col items-center">
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="id"
            className="form-field-primary"
            type="hidden"
            value={formData.id}
            onChange={(event: any) => handleInputChange(event, 'id')}
            error={errors?.id}
          />
          <FormField
            htmlFor="firstName"
            label="FirstName"
            name="firstName"
            type="textarea"
            className="form-field-primary"
            value={formData.firstName}
            onChange={(event: any) => handleInputChange(event, 'firstName')}
            error={errors?.firstName}
          />
          <FormField
            htmlFor="lastName"
            label="LastName"
            name="lastName"
            type="textarea"
            className="form-field-primary"
            value={formData.lastName}
            onChange={(event: any) => handleInputChange(event, 'lastName')}
            error={errors?.lastName}
          />
          <FormField
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            className="form-field-primary"
            value={formData.title}
            onChange={(event: any) => handleInputChange(event, 'title')}
            error={errors?.title}
          />
          <FormField
            htmlFor="bio"
            label="Bio"
            name="bio"
            type="textarea"
            className="form-field-primary"
            value={formData.bio}
            onChange={(event: any) => handleInputChange(event, 'bio')}
            error={errors?.bio}
          />

          <FormField
            htmlFor="currentLocation"
            label="Curent Location"
            name="currentLocation"
            type="textarea"
            className="form-field-primary"
            value={formData.currentLocation}
            onChange={(event: any) => handleInputChange(event, 'currentLocation')}
            error={errors?.currentLocation}
          />
          <SelectBox
            options={pronouns}
            name="pronouns"
            className="form-field-primary"
            label="Pronouns"
            id="pronouns"
            value={formData.pronouns}
            onChange={(event: any) => handleInputChange(event, 'pronouns')}
          />

          <FormField
            htmlFor="occupation"
            label="Occupation"
            name="occupation"
            type="textarea"
            className="form-field-primary"
            value={formData.occupation}
            onChange={(event: any) => handleInputChange(event, 'occupation')}
            error={errors?.occupation}
          />
          <FormField
            htmlFor="email"
            label="Email"
            name="email"
            type="email"
            className="form-field-primary"
            value={formData.email}
            onChange={(event: any) => handleInputChange(event, 'email')}
            error={errors?.email}
          />
          <FormField
            htmlFor="postImg"
            label="Post Image"
            labelClass="uppercase"
            name="postImg"
            value={formData.postImg}
            onChange={(event: any) => handleInputChange(event, 'postImg')}
          />

          <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />

          <div className="text-container max-w-full">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
