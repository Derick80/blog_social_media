import { MultiSelect } from "@mantine/core";
import { LoaderFunction, json, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import CategoryContainer from "~/components/category-container";
import MultipleSelect from "~/components/shared/multi-select";
import { requireUserId } from "~/utils/auth.server";
import { getCategories } from "~/utils/categories.server";
import { getMiniPostById } from "~/utils/postv2.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const initialCategoryList = await getCategories();
  const miniPostId = params.miniPostId;
  invariant(miniPostId, "No Mini Post Id");
  const { minifiedPost } = await getMiniPostById(miniPostId);

  if (!minifiedPost || !initialCategoryList) {
    throw new Error("No Mini Post");
  }

  const data = {
    minifiedPost,
    initialCategoryList,
  };

  return json(data);
};
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const categories = formData.getAll("categories") as string[];
  console.log("categories", categories);
};

export default function MiniPost() {
  const data = useLoaderData();
  const {initialCategoryList}= data.initialCategoryList


  const tags = data.minifiedPost.selectedTags.map((category) =>
  {
    return category.value
  }
  )

  console.log(tags);
  const [formData, setFormData] = React.useState({
    categories: tags,
  });

  return (
    <>
      {data.minifiedPost.selectedTags?.map((item) => (
        <CategoryContainer key={item.id} category={item} />
      ))}
      <form method="post">


<select
        multiple
        name="categories"
        value={formData.categories}
        onChange={(e) => {
            const { value } = e.target;
if(formData.categories.includes(value)){
    setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item !== value),
    }));
}
else{
    setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
    }));
}
        }}

        >
{initialCategoryList.map((item) => (
          <option key={item.id} value={item.value}
         selected={data.minifiedPost.selectedTags?.map((item)=> item.value)}

          >
            {item.value}
            </option>
        ))}


        </select>

      </form>
    </>
  );
}
