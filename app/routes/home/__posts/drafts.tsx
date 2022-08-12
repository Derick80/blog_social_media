import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import ContentContainer from "~/components/shared/content-container";
import Tooltip from "~/components/shared/tooltip";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getUserDrafts } from "~/utils/post.server";

type LoaderData = {
  userDrafts: Array<{
    id: string;
    title: string;
    body: string;
    postImg: string;
    published: boolean;
  }>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);

  const { userDrafts } = await getUserDrafts(userId);
  return json({ userDrafts });
};

export default function Posts() {
  const { userDrafts }: LoaderData = useLoaderData();

  return (
      <ContentContainer>
        <div className="text-base md:text-5xl font-extrabold">Drafts</div>

        { userDrafts.map((post) => (
            <div
                key={ post.id }
                className="w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 md:mt-4 md:mb-4"
            >
              <div className="flex flex-row">
                <h1 className="text-2xl my-6 border-b-2 text-center md:text-3xl">
                  { post.title }
                </h1>
              </div>
              <div className="flex flex-col-reverse items-center p-2 md:flex md:flex-row md:p-2 md:space-x-10">
                <img
                    src={ post.postImg }
                    alt="postimg"
                    className="object-contain w-1/2 rounded"
                />
                <div className="flex flex-row p-2 my-3"> { post.body }</div>
              </div>


              <div className="flex flex-row justify-between p-2">
                <Tooltip message="Edit Post">
                  <Link to={ `/home/${ post.id }` }
                        className="text-red-600 underline"
                  >
                    <span className="material-symbols-outlined text-5xl">edit</span>
                  </Link>
                </Tooltip>
              </div>
            </div>
        )) }
      </ContentContainer>
  );
}

// to={`/posts/${post.id}`}

// to={post.id}
