import { NavLink } from '@remix-run/react'
import Tooltip from '../shared/tooltip'


type PrimaryNavProps = {
  children?: React.ReactNode
}
export default function NavigationBar ({ children }: PrimaryNavProps) {
  return (
    <nav>
      <ul className="flex items-center gap-3">
        <li>
          <Tooltip message="View posts">
            <NavLink
              to="/"
              className={ ({ isActive }) =>
                ` ${isActive
                  ? "underline text-base md:text-xl"
                  : "uppercase text-base md:text-xl"
                }`
              }
            >
              Blog Feed
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
      </ul>


      { children }

    </nav>
  )
}