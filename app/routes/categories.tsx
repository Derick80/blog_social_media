import {json, LoaderFunction} from '@remix-run/node'
import {getCategories} from '~/utils/categories.server'
import {useLoaderData} from '@remix-run/react'


export const loader: LoaderFunction = async()=>{
    const categories = await getCategories()
    return json({categories})

}

export default function Categories(){
    const data = useLoaderData()
    console.log(data)
    return(
        <div> Cats</div>
    )

}