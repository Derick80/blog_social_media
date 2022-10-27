/* eslint-disable prefer-spread */
import { Post } from "@prisma/client";

export const handleFileUpload = async (file: File) => {
  const inputFormData = new FormData();
  inputFormData.append("postImg", file);
  const response = await fetch("/image", {
    method: "POST",
    body: inputFormData,
  });

  const { imageUrl } = await response.json();
  console.log("imageUrl", imageUrl);

  setFormData({
    ...formData,
    postImg: imageUrl,
  });
};
export const toCapitalizeAll = (string: string): string => {
  const words = string.toLowerCase().split(" ");

  const newWords = words.map(
    (word) => word[0].toUpperCase() + word.substring(1)
  );

  const newString = newWords.join(" ");

  return newString;
};

export const getTotalPosts = (posts: Post[]) => {
  return posts.length;
};

export async function getHighestField(objArray: any[], fieldName: string) {
  return Number(
    Math.max.apply(
      Math,
      objArray?.map((o) => o[fieldName] || 0)
    ) || 0
  );
}
