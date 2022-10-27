import { json, LoaderFunction } from "@remix-run/node";
import { getPostsByCategory } from "~/utils/post.server";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";

import PostPreview from "~/components/post-preview";
import invariant from "tiny-invariant";

// use this to look at json
// http://192.168.86.32:5322/categories?_data=routes%2Fcategories
type LoaderData = {
  postsByCategory: Array<{
    id: string;
    title: string;
    body: string;
    postImg: string;
    createdAt: string;
    categories: Array<{ id: string; name: string }>;
  }>;
  isAdmin: boolean;
  categoryName: string;
  isLoggedIn: boolean;
  currentUser: string;
};
export const loader: LoaderFunction = async ({ params, request }) => {
  const categoryName = params.categoryName as string;
  const user = await getUser(request);
  const isLoggedIn = user === null ? false : true;
  const currentUser = user?.id || "";
  const isAdmin = user?.role === "ADMIN" ? true : false;

  const postsByCategory = await getPostsByCategory(categoryName);
  if (!postsByCategory) {
    throw new Response("Couldn't find any posts with that category", {
      status: 401,
    });
  }

  const data: LoaderData = {
    postsByCategory,
    isAdmin,
    categoryName,
    isLoggedIn,
    currentUser,
  };

  return json({ data });
};

export default function CategoryView() {
  const { data } = useLoaderData<LoaderData>();
  return (
    <div className="grid grid-cols-1 grid-rows-1 justify-center gap-4 p-2 md:grid-cols-6 md:grid-rows-none md:gap-8 md:p-4">
      <div className="col-span-full col-start-1 mb-2 items-center justify-center md:col-start-2 md:col-end-6 md:row-end-1 md:mb-2 md:flex md:flex-col">
        <div>Posts with the {data.categoryName} Tag</div>

        {data.postsByCategory.map((post) => (
          <PostPreview
            key={post.id}
            post={post}
            isLoggedIn={data.isLoggedIn}
            currentUser={data.currentUser}
            likeCount={post.likes.length}
          />
        ))}
      </div>
    </div>
  );
}
