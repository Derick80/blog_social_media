import { MiniPost } from '@prisma/client'
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/auth.server'
import { getMiniPosts } from "~/utils/postv2.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  invariant(user, "User is not available")

  const miniPosts = await getMiniPosts();

  if (!miniPosts) {
    throw new Error("No Mini Posts");
  }

  const data = {
    miniPosts,
  };

  return json(data);
};

export default function MiniPostsIndex() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Mini Posts</h1>
      {data.miniPosts.map((miniPost: MiniPost) => {
        return (
          <div key={miniPost.id}>
            <Link to={`/miniPosts/${miniPost.id}`}>{miniPost.title}</Link>
            <p>{miniPost.body}</p>
          </div>
        );
      })}
    </div>
  );
}
