
export interface CategoryContainerProps {
    categories: Array<{
        id: string;
        name: string;
    }>
}
export default function CategoryContainer({ categories }: CategoryContainerProps) {

    return(
        <div className="w-full md:w-1/4 flex flex-row flex-wrap font-semibold mb-2 mt-2 text-xl justify-center gap1 md:gap-2 uppercase"  >
            {categories.map((category)=>(
                <div key={category.id}  className="flex border-2 rounded-xl p-2 dark:bg-blue-400 tracking-wide hover:cursor-pointer" >
                    {category.name}
                </div>
            ))}
        </div>
    )
}