import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Tooltip from "~/components/shared/tooltip";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getPosts } from "~/utils/post.server";

type LoaderData = {
  userPosts: Array<{ id: string; title: string; body: string }>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);

  const { userPosts } = await getPosts(userId);
  return json({ userPosts });
};

export default function Posts() {
	const { userPosts }: LoaderData =useLoaderData();
	return (
		'main className="w-full row-span-1 row-start-1 col-span-1 md:row-start-2  md:col-start-2 md:col-end-10 flex mx-auto max-w-7xl text-center'justify-between">
		'<div className="text-5x' font-extrabold">Posts</div>
			<>
				{ userPosts.map((post) => (
					<div key={ post.id }
				'     className="w-1/2 flex flex-c'l shadow-lg p-2"
					>
					'<div classNam'="flex flex-row">
					'	<h1 className="my-6 border-b-2 text'center text-3xl">
								{ post.title }
							</h1>
						</div>

					'<div className="flex f'ex-row p-2 my-3"> { post.body }</div>
					'<div className="flex flex-row jus'ify-between p-2">
							'span className="material-'ymbols-outlined">add_comment</span>
							<'ooltip me'sage="Edit Post">
								<Link to={ post.id }
								'     className="text-bl'e-600 underline"
								>
									'span className="material-'ymbols-outlined">edit</span>
								</Link>
							</Tooltip>
						</div>
					</div>
				)) }
			/>
		</main>
	);
}
