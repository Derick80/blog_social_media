import {ActionFunction, json, LoaderFunction, redirect} from '@remix-run/node'
import {createCategory, getCategories} from '~/utils/categories.server'
import {useActionData, useLoaderData} from '@remix-run/react'
import {validateText} from '~/utils/validators.server'
import React, {useState} from 'react'
import FormField from '~/components/shared/form-field'
import ContentContainer from '~/components/shared/content-container'
import CategoryContainer from '~/components/shared/category-container'


export const loader: LoaderFunction = async()=>{
    const {categories} = await getCategories()
    return json({categories})

}

export const action: ActionFunction = async({request})=>{
    const formData = await request.formData();
    const name = formData.get('name')

    if(
        typeof name !== 'string'
    ){
        return json(
            {
                error: 'invalid form data',
        form:action,
        },
            {status: 400})
    }

    const errors = {
        name: validateText(name as string),
    }

    if(Object.values(errors).some(Boolean))
        return json(
            {
                errors,
                fields: {name},
        form: action,
            },
        {status: 400}
        )

    await createCategory({name})

    return redirect("/categories")
};

export default function Categories(){
    const data = useLoaderData()
    const actionData = useActionData();
    const [formError, setFormError] = useState(actionData?.error || "");
    const [errors, setErrors] = useState(actionData?.errors || {});
const [formData, setFormData] = useState({
    name: actionData?.fields?.name || "",
})

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        event.preventDefault();
        setFormData((form) => ({ ...form, [field]: event.target.value }));
    };
    return(
        <ContentContainer>

            <div className="w-full md:w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4">
                <div className="text-base md:text-5xl font-extrabold">
                 Create a New Category
                </div>
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
                    {formError}
                </div>
                <form
                    method="post"

                    className="form-primary"
                >
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

                    <button type="submit">Save new category to DB</button>
                </form>

            </div>
            <CategoryContainer categories={     data.categories} />
        </ContentContainer>
    )

}