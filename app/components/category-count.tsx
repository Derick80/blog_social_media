import { Link, NavLink } from "@remix-run/react";

export interface CategoryCountProps {
  category: {
    id: string;
    name: string;
    _count: {
      posts: number;
    };
  };
}
export default function CategoryCount({ category }: CategoryCountProps) {
  return (
    <div className="flex items-baseline">
      <Link
        to={`/categories/${category.name}`}
        className="flex items-center rounded-md px-3 py-1 hover:bg-gray-50  hover:text-gray-900 dark:text-white md:tracking-wide"
        key={category.id}
      >
        <label className="rounded-tl-md rounded-bl-md border-2 border-r-0 pr-1 pl-1 capitalize">
          {category.name}
        </label>

        <div className="flex items-center self-stretch rounded-tr-md rounded-br-md border bg-gray-700 px-1  text-white dark:bg-slate-500">
          {category._count.posts}
        </div>
      </Link>
    </div>
  );
}
