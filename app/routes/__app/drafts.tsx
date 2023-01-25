import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { isAuthenticated } from '~/utils/auth/auth.server'
import { getUserDrafts } from "~/utils/post.server";

import { QueriedPost } from "~/utils/types.server";

type LoaderData = {
  userDrafts: QueriedPost[];
  isLoggedIn: boolean;
  currentUser: string;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  invariant(user, "User is not available")
  const userId = user.id;
  invariant(user, "User is not available");
  const isLoggedIn = user === null ? false : true;
  const currentUser = user.id;
  const drafts = await getUserDrafts(userId);

  const data = {
    drafts,
    userId,
    isLoggedIn,
    currentUser,
    user,
  };

  return json({
    data,
  });
};

export default function Drafts() {
  const data = useLoaderData<typeof loader>();
  const drafts = data.data.drafts;

  return (
    <>
      <div className="colums-2 col-span-full flex flex-wrap justify-around gap-4 ">
        {drafts.map((post) => (
          <Link
            to={`/posts/${post.id}`}
            key={post.id}
            className="w-full max-w-sm overflow-hidden rounded shadow-lg"
          >
            <div className="px-6 py-4">
              <div className="mb-2 text-xl font-bold">{post.title}</div>

              <p className="text-base text-gray-700">{post.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
