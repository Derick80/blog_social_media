import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getCategories } from '~/utils/categories.server'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import ContentContainer from '~/components/shared/content-container'
import CategoryContainer from '~/components/shared/category-container'
import { SelectBox } from '~/components/shared/select-box'

export const loader: LoaderFunction = async () => {
  const { categories } = await getCategories()
  if (!categories) {
    throw new Response('No Categories Found', { status: 404 })
  }
  return json({ categories })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // const name = formData.get('name')
  const categories = formData.getAll("categories") as string[];
  if (
    // typeof name !==
    typeof categories !== "object"
  ) {
    return json(
      {
        error: "invalid form data",
        form: action,
      },
      { status: 400 }
    );
  }

  const errors = {
    // name: validateText(name as string),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { categories },
        form: action,
      },
      { status: 400 }
    );
  const selected = categories.map((category) => category) as [];

  await console.log("await", categories);
  await console.log("await", selected);

  return redirect("/categories");
};

export default function Categories() {
  const data = useLoaderData();
  const actionData = useActionData();
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formData, setFormData] = useState({
    name: actionData?.fields?.name || "",
    categories: actionData?.fields?.categories || [],
  });
  console.log("categories for formData", actionData?.fields?.categories);
  console.log(Array.isArray(formData?.categories));

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    event.preventDefault();
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
    console.log(event.target.value);
  };

  const handleChange2 = (
    event: ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
    console.log("name", event.target.name);
    console.log("value", event.target.value);
  };

  return (
    <ContentContainer>
      <div className="w-full md:w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4">
        <div className="text-base md:text-5xl font-extrabold">
          Create a New Category
        </div>
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
          {formError}
        </div>
        <form method="post" className="form-primary">
          <FormField
            htmlFor="name"
            label="name"
            labelClass="uppercase"
            name="name"
            type="textarea"
            value={formData.name}
            onChange={(event: any) => handleInputChange(event, "name")}
            error={errors?.name}
          />
          <SelectBox
            className="text-black dark:text-white dark:bg-gray-400"
            options={data.categories}
            onChange={(event) => handleChange2(event, "categories")}
            name="categories"
            value={formData.categories}
            multiple={true}
          />

          {/*<button type="submit">Save new category to DB</button>*/}
        </form>
      </div>
      <CategoryContainer categories={data.categories} isPost={false} />

      <div>
        <form method="post">
          <button type="submit">Save</button>
        </form>
      </div>
    </ContentContainer>
  );
}
//
// <div>
//     <select className="text-black dark:text-white
// dark:bg-gray-400"                name="categories"
// multiple={true}
// onChange={(event:any)=>handleChange2(event,"categories")}
//  > {data.categories.map((option) => ( <option
// key={option.id} value={option.id}> {option.name}
// </option> ))}  </select> </div>
