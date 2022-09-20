import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import React from "react";
import Tooltip from "~/components/shared/tooltip";
import { getUser } from "~/utils/auth.server";
import { getUserProfile } from "~/utils/profile.server";
import Layout from "~/components/shared/layout";
import ProfileContent from '~/components/profile-content';

// keep a list of the icon ids we put in the symbol

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No Profile found",
      description: "No profile found",
    };
  }
  return {
    title: `${data.userProfile?.firstName}'s Profile`,
    description: `${data.userProfile?.firstName}'s About me and more`,
  };
};

type LoaderData = {
  userProfile: Awaited<ReturnType<typeof getUserProfile>>;
  isLoggedIn: boolean;
  isOwner: boolean;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const userId = user?.id as string;
  const isLoggedIn = user !== null;

  const isOwner = user?.role == "ADMIN";
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    throw new Response(`Derick's profile not found`, {
      status: 404,
    });
  }
  const data: LoaderData = {
    userProfile,
    isLoggedIn, isOwner,
  };
  return json(data);
};

export default function About () {
  const data = useLoaderData<LoaderData>();
  const userProfile = data.userProfile;

  return (
    <Layout isLoggedIn={ data.isLoggedIn }>
      { userProfile ? (
        <ProfileContent userProfile={ userProfile } isOwner={ data.isOwner } />
      ) : null }

    </Layout>
  );
}
