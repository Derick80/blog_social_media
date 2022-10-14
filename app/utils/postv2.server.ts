import { prisma } from './prisma.server'

const defaultMiniPostSelect ={

        id:true,
        title:true,
        body:true,
        published:true,
        userId:true,
        categories:true,

}
export async function getMiniPosts(){

    const miniPosts = await prisma.miniPost.findMany({
        select:defaultMiniPostSelect,



    })


    return miniPosts
}

export async function getMiniPostById(id:string){

    const miniPost = await prisma.miniPost.findUnique({
        where:{
            id:id
        },
        select:defaultMiniPostSelect
    })


    const selectedTags = miniPost?.categories.map((category) => {
        return {
          id: category.id,
          value: category.name,
          label: category.name,
        }
      })
const  minifiedPost = {

    id:miniPost?.id,
    title:miniPost?.title,
    body:miniPost?.body,
    userId:miniPost?.userId,
    selectedTags

}



    return {minifiedPost}
}

export async function editMiniPostCategories(id:string,categories:string[]){
    const miniPost = await prisma.miniPost.update({
        where:{
            id:id
        },
        data:{
            categories:{
                set:categories
            }
        }
    })

    return miniPost
}

