import {prisma} from './prisma.server'


export async function getCategories() {
    const categories = await prisma.category.findMany({

    })
    return {categories}
}

