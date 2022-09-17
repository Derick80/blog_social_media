import { NavLink } from '@remix-run/react'
import Tooltip from '../shared/tooltip'

export default function NavigationBar(){
    return(
        <>
         <Tooltip message="Write a new blog post">
        <NavLink
          to="/new"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "uppercase underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          Write a New Post
        </NavLink>
      </Tooltip>
      <Tooltip message="View drafts">
        <NavLink
          to="/drafts"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "uppercase underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          Drafts
        </NavLink>
      </Tooltip>
        </>
    )
}