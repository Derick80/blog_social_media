import { NavLink } from '@remix-run/react'
import Button from '../shared/button'

type SideBarNavProps = {
  isLoggedIn: boolean
  firstName: string
  userRole: string
  userId: string
}
export default function SidebarNav({ isLoggedIn, firstName, userRole, userId }: SideBarNavProps) {
  return (
    <>
      <nav className="flex">
        {/* added w-full to ul to get them to spread out and then I had to remove the class from my tooltip and place it in the lis */}
        <ul className="m-2 flex h-full flex-col justify-center space-y-5 p-2">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/account"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">settings</span>

                  <p className="hidden md:block">Settings</p>
                </li>
              </NavLink>

              <li className="nav-li">
                <form className="" action="/logout" method="post">
                  <Button type="submit">
                    {' '}
                    <span className="material-symbols-outlined">logout</span>
                  </Button>
                  <p className="hidden md:block">Sign Out</p>
                </form>
              </li>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
                <li className="nav-li">
                  <span className="material-symbols-outlined">login</span>
                  <p className="hidden md:block">To Like or Comment Please Sign In</p>
                </li>
              </NavLink>
            </>
          )}
        </ul>
      </nav>
    </>
  )
}
