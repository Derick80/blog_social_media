import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import React from "react";
import ContentContainer from "~/components/shared/content-container";
import Icon from "~/components/shared/icon";
import Tooltip from "~/components/shared/tooltip";
import { requireUserId } from "~/utils/auth.server";
import { getUserProfile } from "~/utils/profile.server";

type LoaderData = {
  userProfile: Profile;
  userId: string;
  role: string;
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const role = await process.env.ADMIN;

  const userProfile = await getUserProfile(role);

  return json({ userProfile, userId, role });
};

export default function About() {
  const { userProfile, userId, role }: LoaderData = useLoaderData();
  const {
    id,
    firstName,
    lastName,
    bio,
    birthDay,
    currentLocation,
    pronouns,
    occupation,
    email,
  } = userProfile;
  // @ts-ignore
  return (
    <ContentContainer>
      <div
        key={id}
        className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4"
      >
        <div className="flex flex-row">
          <h1 className="my-6 border-b-2 text-center text-3xl">
            {firstName} {lastName}{" "}
          </h1>
        </div>
        <div className="flex flex-col p-2 md:flex md:flex-row md:p-2 md:space-x-10">
          <img
            className="w-1/2 rounded"
            src="/images/DerickFace.jpg"
            alt="profile"
          />
          <div className="flex flex-col">
            <div className="uppercase font-semibold">About Me</div>
            {bio}
          </div>
          <div className="flex flex-col">
            <div>
              <div className="uppercase font-semibold">Birthday</div>
              {format(new Date(birthDay), "MMMM, do")}
            </div>
            <div>
              <div className="uppercase font-semibold">Current City</div>
              {currentLocation}
            </div>
            <div>
              <div className="uppercase font-semibold">My Pronouns</div>
              {pronouns}
            </div>
            <div>
              <div className="uppercase font-semibold">My Occupation</div>
              {occupation}
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse justify-between p-2">
          {email === role ? (
            <Tooltip message="Edit Post">
              <Link to={id} className="text-red-600 underline">
                <Icon icon="edit" />
              </Link>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </ContentContainer>
  );
}
