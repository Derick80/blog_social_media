import { NavLink } from '@remix-run/react'
import Button from '../shared/button'
import Tooltip from '../shared/tooltip'


type PrimaryNavProps = {
  isLoggedIn: boolean

}
export default function NavigationBar ({ isLoggedIn }: PrimaryNavProps) {
  return (
    <nav
      className='flex flex-row justify-center flex-1 items-center container font-semibold mt-2 md:mt-10 lg:mt-10'
    >
      <ul className="flex items-center gap-3">
        <li>
          <Tooltip message="View posts">
            <NavLink
              to="/"
              className={ ({ isActive }) =>
                ` ${isActive
                  ? "uppercase underline text-base md:text-xl"
                  : "uppercase text-base md:text-xl"
                }`
              }
            >
              Feed
            </NavLink>
          </Tooltip>
        </li>
        <li>
          <Tooltip message="My Profile">
            <NavLink
              to="/about"
              className={ ({ isActive }) =>
                ` ${isActive
                  ? "uppercase underline text-sm md:text-xl"
                  : "uppercase text-sm md:text-xl"
                }`
              }
            >
              About
            </NavLink>
          </Tooltip>
        </li>
        { isLoggedIn && (<>
          <li>
            <Tooltip message="Write a new blog post">
              <NavLink
                to="/posts/new"
                className={ ({ isActive }) =>
                  ` ${isActive
                    ? "uppercase underline text-base md:text-xl"
                    : "uppercase text-base md:text-xl"
                  }`
                }
              >
                Create Post
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <Tooltip message="View drafts">
              <NavLink
                to="/drafts"
                className={ ({ isActive }) =>
                  ` ${isActive
                    ? "uppercase underline text-base md:text-xl"
                    : "uppercase text-base md:text-xl"
                  }`
                }
              >
                Drafts
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <form className='' action="/logout" method="post">
              <Tooltip message="signout">
                <Button type="submit" variant='primary'>Sign Out</Button>
              </Tooltip>
            </form>
          </li>
        </>) }
      </ul>




    </nav>
  )
}