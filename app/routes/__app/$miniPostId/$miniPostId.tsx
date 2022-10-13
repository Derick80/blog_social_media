import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'
import invariant from 'tiny-invariant'
import CategoryContainer from '~/components/category-container'
import MultiSelect from '~/components/shared/multi-select'
import { requireUserId } from '~/utils/auth.server'
import { getCategories } from '~/utils/categories.server'
import { getMiniPostById } from '~/utils/postv2.server'



export const loader: LoaderFunction = async ({ request,params }) => {
const initialCategoryList = await getCategories()
const miniPostId = params.miniPostId
invariant(miniPostId, 'No Mini Post Id')
const {minifiedPost, } = await getMiniPostById(miniPostId)

if(!minifiedPost || !initialCategoryList) {

    throw new Error('No Mini Post')


}


const data = {
    minifiedPost,
    initialCategoryList

}

return json(data)

}


export default function MiniPost(){
    const data = useLoaderData()
    const [selected, setSelected] = React.useState(data.minifiedPost.selectedTags   )

    const [formData, setFormData] = React.useState({
       categories: data.initialCategoryList.initialCategoryList


    })

    return(
        <>
{selected?.map((item)=>(
                          <CategoryContainer key={item.id} category={item} />

))}
 <select
              name="categories"
              multiple={true}
              className="form-field-primary"
            value={formData.categories}

            >
{formData.categories.map((cat)=>(
    <option
    key={cat.id}
    value={cat.value}
    >
        {cat.name}
    </option>
))}

            </select>


        </>
    )
}