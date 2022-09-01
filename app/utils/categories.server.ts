import {prisma} from './prisma.server'
import {CategoryForm} from '~/utils/types.server'
import {json} from '@remix-run/node'


export async function getCategories() {
    const categories = await prisma.category.findMany({

    })
    return {categories}
}

export const createCategory = async(form: CategoryForm)=>{
    const exists = await prisma.category.count({where:{name:form.name}})

    if(exists){
        return json({
            error: `Category already exists`,

        },{status:400})
    }
    const newCategory = await prisma.category.create({
        data:{
            name:form.name,
        }
    })

    if(!newCategory){
        return json(
            {
            error: `Something went wrong trying to create a category`,
            fields:{
                name:form.name
            },
        },
            {status:400}
        );
    }
    return {newCategory}
}

