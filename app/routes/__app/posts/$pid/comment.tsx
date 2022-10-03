// import { Post } from '@prisma/client'
// import type { ActionFunction, LoaderFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { getUser } from '~/utils/auth.server'
// import { createNewPost } from '~/utils/post.server'
// import { QueriedPost } from '~/utils/types.server'

// export const loader: LoaderFunction = () => {
//   throw notFound({ message: "This page doesn't exists." });
// };

// export const action: ActionFunction = async ({ request, params }) => {
//   const user = await getUser(request);
//   const formData = await request.formData();
//   const { content } = Object.fromEntries(formData) as QueriedPost;

//   const userId = user?.id;
//   const postId = params.pid;

//   if (!userId || !postId) {
//     throw new Error("You must be logged in to comment on a post.");
//   }

//   try {
//     if (request.method === "POST") {
//       await createNewPost({
//         content: content || "",
//         createdBy: user.username || "Anonymous",
//         parent: {
//           connect: {
//             id: postId,
//           },
//         },
//         user: {
//           connect: {
//             id: userId,
//           },
//         },
//       });
//     }

//     const headers = await flashAndCommit(
//       request,
//       "Your comment has been added"
//     );

//     return json({ success: true }, { headers });
//   } catch (error) {
//     if (error instanceof Error) return badRequest({ message: error.message });
//     return serverError({ message: "Something went wrong" });
//   }
// };
