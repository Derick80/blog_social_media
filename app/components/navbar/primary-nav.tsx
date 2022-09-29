import { NavLink } from '@remix-run/react'
import Button from '../shared/button'
import Tooltip from '../shared/tooltip'

type PrimaryNavProps = {
  isLoggedIn: boolean
}
export default function NavigationBar({ isLoggedIn }: PrimaryNavProps) {
  return (
    <header className="fixed h-full flex border-2 space-y-2 px-2 dark:bg-gray-600 md:order-first md:space-y-8 md:py-6 lg:px-4">
    <nav className="flex flex-row text-base font-semibold md:flex-col md:text-2xl">
      <div className="flex md:flex-col">
        <ul className="flex space-x-4 md:flex-col md:space-y-10 md:space-x-4">
          <li>
            <Tooltip message="View posts">
              <span className="material-symbols-outlined">home</span>

              <NavLink
                to="/"
                className={({ isActive }) => ` ${isActive ? 'uppercase underline' : 'uppercase'}`}
              >
                <p className="hidden md:block">feed</p>
              </NavLink>
            </Tooltip>{' '}
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Tooltip message="Write a new blog post">
                  <span className="material-symbols-outlined">add_circle</span>
                  <NavLink
                    to="/posts/new"
                    className={({ isActive }) =>
                      ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                    }
                  >
                    <p className="hidden md:block">create</p>
                  </NavLink>
                </Tooltip>
              </li>
              <li>
                <Tooltip message="View drafts">
                  <span className="material-symbols-outlined">drafts</span>
                  <NavLink
                    to="/drafts"
                    className={({ isActive }) =>
                      ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                    }
                  >
                    <p className="hidden md:block">Drafts</p>
                  </NavLink>
                </Tooltip>
              </li>
            </>
          )}
          <li>
            <Tooltip message="My Profile">
              <span className="material-symbols-outlined">person</span>
              <NavLink
                to="/about"
                className={({ isActive }) => ` ${isActive ? 'uppercase underline' : 'uppercase'}`}
              >
                <p className="hidden md:block">About</p>
              </NavLink>
            </Tooltip>
          </li>
        </ul>
        <div className="flex justify-center">
          <div>
            <div className="group relative h-full">
              <span className="material-symbols-outlined">settings</span>
              <p className="hidden items-center text-sm font-semibold uppercase md:block md:text-2xl">
                {' '}
                Settings
              </p>
              <ul className="absolute z-50 float-right m-0 mt-1 hidden min-w-max rounded-lg border-none py-2 text-left text-xs shadow-lg hover:visible group-hover:block">
                {isLoggedIn ? (
                  <>
                    <li className="p-3 text-left text-sm hover:text-blue-300">
                      <NavLink
                        to="/account"
                        className="font-base block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
                      >
                        Account
                      </NavLink>
                    </li>
                    <li className="p-3 text-left text-sm hover:text-blue-300">
                      <form className="" action="/logout" method="post">
                        <Tooltip message="signout">
                          <Button type="submit">Sign Out</Button>
                        </Tooltip>
                      </form>
                    </li>
                  </>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
  )
}

{
  /* <div className='group relative h-full'>
Settings
<ul className='hidden group-hover:block absolute'>
<li> <NavLink to='/account'  className={ ({ isActive }) =>
      ` ${isActive
        ? "uppercase underline"
        : "uppercase"
      }`
    } ><span className="material-symbols-outlined">
menu
</span>Account</NavLink></li>
</ul>
</div>


<div className="hidden group-hover:block absolute top-full items-center gap-3">

<ul >
<li>
<Tooltip message="View posts">
  <NavLink
    to="/"
    className={ ({ isActive }) =>
      ` ${isActive
        ? "uppercase underline"
        : "uppercase"
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
        ? "uppercase underline"
        : "uppercase"
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
          ? "uppercase underline"
          : "uppercase"
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
          ? "uppercase underline"
          : "uppercase"
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
</div>
<ul className="hidden md:flex items-center gap-3">
<li>
<Tooltip message="View posts">
  <NavLink
    to="/"
    className={ ({ isActive }) =>
      ` ${isActive
        ? "uppercase underline"
        : "uppercase"
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
        ? "uppercase underline"
        : "uppercase"
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
          ? "uppercase underline"
          : "uppercase"
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
          ? "uppercase underline"
          : "uppercase"
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
</ul> */
}
