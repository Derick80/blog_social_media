import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { getPosts } from "~/utils/post.server";
import Posts from "~/components/posts";


type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>;
  isOwner: boolean;
};
export const loader: LoaderFunction = async ({  request }) => {
  const user = await getUser(request);
  const isLoggedIn = user?.role === "USER" || user?.role === "ADMIN";
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
  };
  return json(data);
};

export default function Home() {
  const data = useLoaderData<LoaderData>();
  return (
    <main className='flex flex-col w-1/2 md:w-3/4 px-4 mx-auto items-center justify-center'>
      {data.userPosts.map((post) => (
        <Posts
          key={post.id}
          posts={post}
          isOwner={data.isOwner}
          isPost={false}
        />
      ))}
    </main>
  );
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>;
}
