import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { requireUserId } from "~/utils/auth.server";
import { getUserProfile } from "~/utils/profile.server";

type LoaderData = {
  userProfile: Profile;
  userId: string;
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userProfile = await getUserProfile(userId);
  return json({ userProfile, userId });
};

export default function About() {
  const { userProfile, userId }: LoaderData = useLoaderData();
  const {
    id,
    firstName,
    lastName,
    birthDay,
    currentLocation,
    pronouns,
    occupation,
  } = userProfile;
  return (
    <div className="w-full col-span-1 md:row-start-2 md:row-span-1 md:col-start-4 md:col-end-10 flex mx-auto max-w">
      <div key={id} className="w-full h-3/4 flex flex-col shadow-lg p-2">
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

          <div>
            <div>{format(new Date(birthDay), "MMMM, do")}</div>
            <div> {currentLocation}</div>
            <div> {pronouns}</div>
            <div> {occupation}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
