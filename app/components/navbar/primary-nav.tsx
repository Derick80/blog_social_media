import { NavLink } from '@remix-run/react'
import Tooltip from '../shared/tooltip'

export default function NavigationBar(){
    return(
        <>
        <Tooltip message="View posts">
        <NavLink
          to="/"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          Blog Feed
        </NavLink>
      </Tooltip>
      <Tooltip message="My Profile">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              ` ${
                isActive
                  ? "uppercase underline text-sm md:text-xl"
                  : "uppercase text-sm md:text-xl"
              }`
            }
          >
            About
          </NavLink>
        </Tooltip>

        {isOwner && (

        ): null}
        </>
    )
}