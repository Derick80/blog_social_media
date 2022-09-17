import { useFetcher } from "@remix-run/react";

export type LikeContainerProps = {
  currentUser: string;
  postId: string;
  likes: Array<{
    id: string;
    postId: string;
    userId: string;
  }>;
};
export default function LikeContainer({
  likes,
  currentUser,
  postId,
}: LikeContainerProps) {
  const fetcher = useFetcher();

  const onClick = () => {
    fetcher.submit({ currentUser }, { method: "post", action: `/likePost` });
    console.log("clicked", postId, "currentUser", currentUser);
  };

  console.log("likesContainer", likes);

  const userLikedPost = likes.find(({ userId }) => userId === currentUser)
    ? true
    : false;

  console.log("userLikedPost", userLikedPost);

  return (
    <div>
      {userLikedPost ? (
        <button
          onClick={onClick}
          className="bg-red-500 text-white px-2 py-1 rounded-md"
        >
          Unlike
        </button>
      ) : (
        <button
          onClick={onClick}
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
        >
          Like
        </button>
      )}
    </div>
  );
}
