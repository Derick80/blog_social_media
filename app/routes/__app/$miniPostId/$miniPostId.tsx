import { MultiSelect } from "@mantine/core";
import { LoaderFunction, json, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useEffect } from "react";
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
  const { initialCategoryList } = data.initialCategoryList;

  const tags = data.minifiedPost.selectedTags.map((category) => {
    return category.value;
  });

  const testTags = data.minifiedPost.selectedTags.map((category) =>

      category.value

  );

  console.log("testTags", testTags);
  console.log(tags);
  const [formData, setFormData] = React.useState({
    categories: tags,
  });

  const [selected, setSelected] = React.useState<string[]>(tags);

  // useEffect(() => {
  //   setSelected(tags);
  //   }, [selected]);


  console.log("selected", selected);
  const handleSelectChanges= (event: React.ChangeEvent<HTMLSelectElement>) => {

    const { value } = event.target;
    if (formData.categories.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item !== value),
      }));
      setSelected((prev)=> ([

        ...prev.filter((item) => item !== value)


      ]))

    } else {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
      setSelected((prev)=> (
        [...prev, value]
        ))
    }
  }
  return (
    <>

      <form method="post" className="form-primary">

        <div className=''>
        <div className="mx-1 mt-2 flex md:mt-4 space-x-2 mb-2 items-baseline">
          {selected.map((item)=> (
            <button onClick={()=> {
              setFormData((prev)=> ({
                ...prev,
                categories: prev.categories.filter((selectedItem) => selectedItem !== item),
              }))
              setSelected(
                selected.filter((selectedItem) => selectedItem !== item)
              )
            }}  className="flex items-center rounded-md px-3 py-1 hover:bg-gray-50  hover:text-gray-900 dark:text-white md:tracking-wide">
              <label className='rounded-tl-md rounded-bl-md border-2 border-r-0 pr-1 pl-1 capitalize'>{item}</label>
<span className="material-symbols-outlined flex items-center self-stretch rounded-tr-md rounded-br-md border bg-gray-700 px-1  text-white dark:bg-slate-500">
close
</span>
            </button>

          ))}
        </div>
        <select
          className="form-field-primary flex w-full p-2 border-t-0"
          multiple
          name="categories"
          value={formData.categories}
       onChange={(event)=> handleSelectChanges(event)}
        >

          {initialCategoryList.map((item) => (
            <option
              className=""
              key={item.id}
              value={item.value}

            >
              {item.value}
            </option>
          ))}
        </select>
        </div>
      </form>
    </>
  );
}
