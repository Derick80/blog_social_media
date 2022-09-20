import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { getPosts } from "~/utils/post.server";
import Posts from "~/components/posts";
import PostContent from '~/components/post-content';
import NavigationBar from '~/components/navbar/primary-nav';


type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>;
  isOwner: boolean;
  isLoggedIn: boolean;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const isLoggedIn = user !== null;

  const isOwner = user?.role === "ADMIN";
  const userPosts = await getPosts();


  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404,
    });
  }


  const data: LoaderData = {
    userPosts,
    isOwner,
    isLoggedIn,
  };
  return json(data);
};

export default function Home () {
  const data = useLoaderData<LoaderData>();
  return (
    <>


        { data.userPosts.map((post) => (
          <PostContent
            key={ post.id }
            post={ post }

          />
        )) }

    </>
  );
}

export function ErrorBoundary () {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>;
}