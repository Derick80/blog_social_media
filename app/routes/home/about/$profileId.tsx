import type { Profile } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import React, { useState } from "react";
import FormField from "~/components/shared/form-field";
import { getUser, getUserId } from "~/utils/auth.server";
import { getProfile, updateProfile } from "~/utils/profile.server";
import { validateText } from "~/utils/validators.server";

type LoaderData = {
  profile: Profile;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  let userId = await getUserId(request);
  let profileId = params.profileId as string;
  const user = await getUser(request);

  const role = await process.env.ADMIN;
  let profile = userId ? await getProfile(profileId) : null;
  if (!profile) {
    throw new Response("Profile not found", { status: 404 });
  }
  let data: LoaderData = {
    profile,
  };

  if (role != user?.email) {
    throw new Response("You are not authorized to edit this post", {
      status: 401,
    });
  }
  return json({ data });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const profileId = params.profileId as string;

  let formData = await request.formData();
  let id = formData.get("id");
  let firstName = formData.get("firstName");
  let lastName = formData.get("lastName");
  let bio = formData.get("bio");
  // @ts-ignore
  let birthDay = new Date(formData.get("birthDay"));
  let currentLocation = formData.get("currentLocation");
  let occupation = formData.get("occupation");
  let profilePicture = formData.get("profilePicture");

  if (
    typeof id !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof bio !== "string" ||
    typeof currentLocation !== "string" ||
    typeof occupation !== "string" ||
    typeof userId !== "string"
  ) {
    return json({ error: "invalid form data" }, { status: 400 });
  }
  const errors = {
    firstName: validateText(firstName as string),

    lastName: validateText(lastName as string),
    bio: validateText(bio as string),
    currentLocation: validateText(currentLocation as string),
    occupation: validateText(occupation as string),
    profilePicture: validateText(profilePicture as string),
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
          profilePicture,
        },
        form: action,
      },
      { status: 400 }
    );

  await updateProfile({
    id: profileId,
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    birthDay: birthDay,
    currentLocation: currentLocation,
    occupation: occupation,
    profilePicture: profilePicture,
  });
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
    pronouns: data.profile.pronouns,
    occupation: data.profile.occupation,
    profilePicture: data.profile?.profilePicture || "",
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
    <main className="w-full col-span-1  md:col-start-2 md:col-end-10 flex mx-auto max-w-7xl text-center justify-between">
      <div className="w-full flex flex-col items-center">
        <form method="post" className="text-xl font-semibold">
          <FormField
            htmlFor="id"
            label=""
            name="id"
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
            className="w-full"
            value={formData.firstName}
            onChange={(event: any) => handleInputChange(event, "firstName")}
            error={errors?.firstName}
          />
          <FormField
            htmlFor="lastName"
            label="LastName"
            name="lastName"
            type="textarea"
            className="w-full"
            value={formData.lastName}
            onChange={(event: any) => handleInputChange(event, "lastName")}
            error={errors?.lastName}
          />
          <FormField
            htmlFor="bio"
            label="Bio"
            name="bio"
            type="textarea"
            className="w-full"
            value={formData.bio}
            onChange={(event: any) => handleInputChange(event, "bio")}
            error={errors?.bio}
          />
          <FormField
            htmlFor="birthDay"
            label="Birthday"
            name="birthDay"
            type="date"
            className="w-full"
            value={format(new Date(formData.birthDay), "MMMM do")}
            onChange={(event: any) => handleInputChange(event, "birthDay")}
            error={errors?.birthDay}
          />
          <FormField
            htmlFor="currentLocation"
            label="Curent Location"
            name="currentLocation"
            type="textarea"
            className="w-full"
            value={formData.currentLocation}
            onChange={(event: any) =>
              handleInputChange(event, "currentLocation")
            }
            error={errors?.currentLocation}
          />
          <FormField
            htmlFor="pronouns"
            label="Preferred Pronouns"
            name="pronouns"
            type="textarea"
            className="w-full"
            value={formData.pronouns}
            onChange={(event: any) => handleInputChange(event, "pronouns")}
            error={errors?.pronouns}
          />
          <FormField
            htmlFor="occupation"
            label="Occupation"
            name="occupation"
            type="textarea"
            className="w-full"
            value={formData.occupation}
            onChange={(event: any) => handleInputChange(event, "occupation")}
            error={errors?.occupation}
          />

          <div className="max-w-full text-container">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </main>
  );
}
