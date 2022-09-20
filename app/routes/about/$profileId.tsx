import type { Profile, Pronouns } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import React, { useState } from "react";
import FormField from "~/components/shared/form-field";
import { SelectBox } from "~/components/shared/select-box";
import { getUser, getUserId } from "~/utils/auth.server";
import { pronouns } from "~/utils/constants";
import { getProfile, updateProfile } from "~/utils/profile.server";
import {
  validateDate,
  validateEmail,
  validateName,
  validateText,
} from "~/utils/validators.server";
import Tooltip from "~/components/shared/tooltip";
import { ImageUploader } from "~/components/image-uploader";

type LoaderData = {
  profile: Profile;
  userId: string;
  isOwner: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request)) as string;
  const profileId = params.profileId as string;
  const user = await getUser(request);
  const isOwner = user?.role === "ADMIN";

  const profile = userId ? await getProfile(profileId) : null;
  if (!profile) {
    throw new Response("Profile not found", { status: 404 });
  }
  const data: LoaderData = {
    profile,
    userId,
    isOwner,
  };

  if (!isOwner) {
    throw new Response("You are not authorized to edit this post", {
      status: 401,
    });
  }
  return json({ data });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const profileId = params.profileId as string;

  const formData = await request.formData();
  const id = formData.get("id");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const bio = formData.get("bio");
  // @ts-ignore
  const birthDay = new Date(formData.get("birthDay"));
  const currentLocation = formData.get("currentLocation");
  const pronouns = formData.get("pronouns");
  const occupation = formData.get("occupation");
  const postImg = formData.get("postImg");
  const email = formData.get("email");
  console.log(
    "birthday",
    birthDay,
    id,
    firstName,
    lastName,
    bio,
    currentLocation,
    pronouns,
    occupation,
    postImg,
    email
  );
  if (
    typeof id !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof bio !== "string" ||
    typeof currentLocation !== "string" ||
    typeof occupation !== "string" ||
    typeof pronouns !== "string" ||
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof postImg !== "string"
  ) {
    return json({ error: "invalid form data" }, { status: 400 });
  }
  const errors = {
    firstName: validateText(firstName as string),
    lastName: validateText(lastName as string),
    bio: validateText(bio as string),
    currentLocation: validateText(currentLocation as string),
    occupation: validateText(occupation as string),
    pronouns: validateName(pronouns),
    email: validateEmail(email as string),
    birthDay: validateDate(birthDay as Date),
  };

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
          birthDay,
        },
        form: action,
      },
      { status: 400 }
    );

  await updateProfile({
    userId: userId,
    id: profileId,
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    birthDay,
    currentLocation: currentLocation,
    occupation: occupation,
    pronouns: pronouns as Pronouns,
    profilePicture: postImg,
    email: email,
  });
  return redirect("/about");
};

export default function ProfileRoute() {
  const { data } = useLoaderData();
  const actionData = useActionData();
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formData, setFormData] = useState({
    id: data.profile.id,
    firstName: data.profile.firstName,
    lastName: data.profile.lastName,
    bio: data.profile.bio,
    birthDay: data.profile.birthDay,
    currentLocation: data.profile.currentLocation,
    pronouns: actionData?.fields?.pronouns || data.profile.pronouns || "THEY",
    occupation: data.profile.occupation,
    postImg: data.profile.profilePicture,
    email: data.profile.email || "",
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

  const handleFileUpload = async (file: File) => {
    const inputFormData = new FormData();
    inputFormData.append("postImg", file);
    const response = await fetch("/image", {
      method: "POST",
      body: inputFormData,
    });

    const { imageUrl } = await response.json();
    console.log("imageUrl", imageUrl);

    setFormData({
      ...formData,
      postImg: imageUrl,
    });
  };

  return (
    <main className="w-full col-span-1  md:col-start-2 md:col-end-10 flex mx-auto max-w-7xl text-center justify-between">
      <div className="w-full flex flex-col items-center">
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="id"
            className="form-field-primary"
            type="hidden"
            value={formData.id}
            onChange={(event: any) => handleInputChange(event, "id")}
            error={errors?.id}
          />
          <FormField
            htmlFor="firstName"
            label="FirstName"
            name="firstName"
            type="textarea"
            className="form-field-primary"
            value={formData.firstName}
            onChange={(event: any) => handleInputChange(event, "firstName")}
            error={errors?.firstName}
          />
          <FormField
            htmlFor="lastName"
            label="LastName"
            name="lastName"
            type="textarea"
            className="form-field-primary"
            value={formData.lastName}
            onChange={(event: any) => handleInputChange(event, "lastName")}
            error={errors?.lastName}
          />
          <FormField
            htmlFor="bio"
            label="Bio"
            name="bio"
            type="textarea"
            className="form-field-primary"
            value={formData.bio}
            onChange={(event: any) => handleInputChange(event, "bio")}
            error={errors?.bio}
          />
          <FormField
            htmlFor="birthDay"
            label="Birthday"
            name="birthDay"
            type="date"
            className="form-field-primary"
            value={format(new Date(formData.birthDay), "yyyy-MM-dd")}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLFormElement>
            ) => handleInputChange(event, "birthDay")}
            error={errors?.birthDay}
          />
          <FormField
            htmlFor="currentLocation"
            label="Curent Location"
            name="currentLocation"
            type="textarea"
            className="form-field-primary"
            value={formData.currentLocation}
            onChange={(event: any) =>
              handleInputChange(event, "currentLocation")
            }
            error={errors?.currentLocation}
          />
          <SelectBox
            options={pronouns}
            name="pronouns"
            className="form-field-primary"
            label="Pronouns"
            id="pronouns"
            value={formData.pronouns}
            onChange={(event: any) => handleInputChange(event, "pronouns")}
          />

          <FormField
            htmlFor="occupation"
            label="Occupation"
            name="occupation"
            type="textarea"
            className="form-field-primary"
            value={formData.occupation}
            onChange={(event: any) => handleInputChange(event, "occupation")}
            error={errors?.occupation}
          />
          <FormField
            htmlFor="email"
            label="Email"
            name="email"
            type="email"
            className="form-field-primary"
            value={formData.email}
            onChange={(event: any) => handleInputChange(event, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor="postImg"
            label="Post Image"
            labelClass="uppercase"
            name="postImg"
            value={formData.postImg}
            onChange={(event: any) => handleInputChange(event, "postImg")}
          />

          <ImageUploader
            onChange={handleFileUpload}
            postImg={formData.postImg || ""}
          />

          <div className="max-w-full text-container">
            <Tooltip message="Update your profile">
              <button type="submit" className="btn-primary">
                Save
              </button>
            </Tooltip>
          </div>
        </form>
      </div>
    </main>
  );
}
