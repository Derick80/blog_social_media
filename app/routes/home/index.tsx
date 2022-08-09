import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import Icon from "~/components/shared/icon";
import Tooltip from "~/components/shared/tooltip";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getPosts } from "~/utils/post.server";

type LoaderData = {
  user: { id: string; email: string };
  userPosts: Array<{ id: string; title: string; body: string; email: string }>;
  role: string;
  email: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const role = await process.env.ADMIN;

  const { userPosts } = await getPosts();

  const email = userPosts.map((email) => email.user.email);
  return json({ userPosts, user, role, email });
};

export default function HomeRoute() {
  const { user, userPosts, role, email }: LoaderData = useLoaderData();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-5xl font-extrabold">Posts</div>
      {userPosts.map((post) => (
        <div
          key={post.id}
          className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4"
        >
          <div className="flex flex-row">
            <h1 className="my-6 border-b-2 text-center text-3xl">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-row p-2 my-3"> {post.body}</div>

          {user ? (
            <div className="flex flex-row justify-between p-2">
              {user.email === role ? (
                <>
                  <Tooltip message="Leave a Comment">
                    <Icon icon="add_comment" />
                  </Tooltip>
                  <Tooltip message="Edit Post">
                    <Link to={post.id} className="text-red-600 underline">
                      <Icon icon="edit" />
                    </Link>
                  </Tooltip>
                </>
              ) : (
                <div className="flex flex-row justify-between p-2">
                  <Tooltip message="Leave a Comment">
                    <Icon icon="add_comment" />
                  </Tooltip>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
