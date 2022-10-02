import { NavLink } from "@remix-run/react";
import React from "react";
import { QueriedPost } from "~/utils/types.server";

type SideBarStatsProps = {
  totalPosts: number;
  mostPopularPost: QueriedPost;
};
export default function SideBarStats({
  totalPosts,
  mostPopularPost,
}: SideBarStatsProps) {
  return (
    <div>
      <label className="text-xl font-bold text-gray-700 underline dark:text-white">
        Site Stats
      </label>

      <div className="flex flex-col">
        <div>
          <label className="text-base">Total posts:</label>
        <p>  {totalPosts}</p>
        </div>

        <button className='hover:cursor-pointer tracking-wide'>
          <NavLink
            to={`/posts/${mostPopularPost.id}`}
          >
            <label className="text-base">Hottest Post</label>

          </NavLink>
        </button>
        <div className="flex md:order-2">
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
      <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
      </div>
    </div>
  );
}
