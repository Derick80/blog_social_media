import { NavLink } from '@remix-run/react'
import Button from '../shared/button'
import Tooltip from '../shared/tooltip'

type PrimaryNavProps = {
  isLoggedIn: boolean
}
export default function NavigationBar({ isLoggedIn }: PrimaryNavProps) {
  return (
    <nav className='flex flex-row sticky md:flex-col mx-auto font-semibold text-base md:text-4xl'>

        <ul className='flex flex-row space-x-2 md:space-x-4 md:flex-col'>
          <li>
            <Tooltip message='View posts'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                }
              >
                Feed
              </NavLink>
            </Tooltip>{' '}
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
      Create
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

</>) }
          <li>
            <Tooltip message='My Profile'>
              <NavLink
                to='/about'
                className={({ isActive }) =>
                  ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                }
              >
                About
              </NavLink>
            </Tooltip>
          </li>
        </ul>
      <div className='flex justify-end group relative h-full'>
        {' '}
        <span className='material-symbols-outlined'>settings</span>
        <ul tabIndex={0} className='hidden group-hover:block absolute bg-slate-500 p-2 border border-gray-200 w-48'>
          <li className='hover:text-blue-300 text-left text-sm p-3'>
            <NavLink
              to='/about'
              className='normal-case'
            >
              Profile
            </NavLink>
          </li>
          {isLoggedIn ?  (<li className='hover:text-blue-300 text-left text-sm p-3'>
  <form className='' action="/logout" method="post">
    <Tooltip message="signout">
      <Button type="submit" >Sign Out</Button>
    </Tooltip>
  </form>
</li>):null}
        </ul>
      </div>
    </nav>
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
