import { NavLink } from '@remix-run/react'
import Button from '../shared/button'

type PrimaryNavProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
  }
}
export default function NavigationBar({ data }: PrimaryNavProps) {
  return (
    <header className="col-start-1 col-end-5 w-full bg-black/10 p-1 dark:bg-white/10 md:p-2">
      <nav className="flex">
        {/* added w-full to ul to get them to spread out and then I had to remove the class from my tooltip and place it in the lis */}
        <ul className="nav-ul">
          <NavLink to="/" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
            <li className="nav-li">
              <span className="material-symbols-outlined">home</span>
            </li>
            <p className="hidden md:block">Feed</p>
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
            <li className="nav-li">
              <span className="material-symbols-outlined">info</span>
              <p className="hidden md:block">About</p>
            </li>
          </NavLink>
          {data.userRole === 'ADMIN' ? (
            <>
              <NavLink
                to="/posts/new"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">add_circle</span>
                  <p className="hidden md:block">Create</p>
                </li>
              </NavLink>
              <NavLink
                to="/drafts"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">drafts</span>

                  <p className="hidden md:block">Drafts</p>
                </li>
              </NavLink>
            </>
          ) : null}

          {data.isLoggedIn ? (
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
                <span>Welcome</span>
                <p>{data.firstName}</p>
              </li>
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
    </header>
  )
}
