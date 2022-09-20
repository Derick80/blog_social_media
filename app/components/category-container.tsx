import { Link } from "@remix-run/react";
import Icon from "~/components/shared/icon";

export interface CategoryContainerProps {
  category: {
    id: string;
    name: string;
  }
}

export default function CategoryContainer ({
  category,
}: CategoryContainerProps) {
  return (
    <div className='flex flex-wrap mx-2'>

      <label className='m-2 max-w-fit h-fit text-center border-2 rounded-md p-2 md:tracking-wide hover:cursor-pointer' key={ category.id }>

          <Link to={ `/categories/${category.name}` }>{ category.name }</Link>


      </label>

    </div>
  );
}
