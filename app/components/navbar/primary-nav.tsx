import { NavLink } from '@remix-run/react'
import Button from '../shared/button'

type PrimaryNavProps = {
  isLoggedIn: boolean
}
export default function NavigationBar({ isLoggedIn }: PrimaryNavProps) {
  return (
    <header className='bg-black/10 dark:bg-white/10 p-1 md:p-2'>
      <nav className="flex w-full">
        {/* added w-full to ul to get them to spread out and then I had to remove the class from my tooltip and place it in the lis */}
        <ul className="nav-ul">
          <li className="nav-li">
            <span className="material-symbols-outlined">home</span>

            <NavLink to="/" className={({ isActive }) => ` ${isActive ? ' underline' : ''}`}>
              <p className="hidden md:block">Feed</p>
            </NavLink>
          </li>
          <li className="nav-li">
            <span className="material-symbols-outlined">person</span>
            <NavLink to="/about" className={({ isActive }) => ` ${isActive ? 'underline' : ''}`}>
              <p className="hidden md:block">About</p>
            </NavLink>
          </li>

          {isLoggedIn && (
            <>
              <li className="nav-li">
                <span className="material-symbols-outlined">add_circle</span>
                <NavLink
                  to="/posts/new"
                  className={({ isActive }) => ` ${isActive ? ' underline' : ''}`}
                >
                  <p className="hidden md:block">Create</p>
                </NavLink>
              </li>
              <li className="nav-li">
                <span className="material-symbols-outlined">drafts</span>
                <NavLink
                  to="/drafts"
                  className={({ isActive }) => ` ${isActive ? ' underline' : ''}`}
                >
                  <p className="hidden md:block">Drafts</p>
                </NavLink>
              </li>
            </>
          )}

          {isLoggedIn ? (
            <>
              <li className="nav-li">
                <span className="material-symbols-outlined">settings</span>
                <NavLink
                  to="/account"
                  className={({ isActive }) => ` ${isActive ? ' underline' : ''}`}
                >
                  <p className="hidden md:block">Settings</p>
                </NavLink>
              </li>

              <li className="nav-li">
                <form className="" action="/logout" method="post">
                  <Button type="submit"> <span className="material-symbols-outlined">logout</span>
                  </Button>
                                    <p className="hidden md:block">Sign Out</p>

                </form>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>
  )
}
