import {NavLink, useNavigate} from '@remix-run/react'
import React from 'react'
import Tooltip from '~/components/shared/tooltip'
import Icon from '~/components/shared/icon'

type AppBarProps = {
  user: { id: string; email: string };
  isOwner: boolean;
};
export default function AppBar({ user, isOwner }: AppBarProps) {
  const navigate = useNavigate();
  return (<>
        {isOwner ? (
            <>
              <nav className="w-full p-2 font-semibold uppercase md:visible flex mx-auto max-w-7xl text-center justify-between">
                <Tooltip message="View Posts">
                  <NavLink
                      to="/"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    feed
                  </NavLink>
                </Tooltip>


                <Tooltip message="Write a new Blog Post">
                  <NavLink
                      to="new"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    Post_add
                  </NavLink>
                </Tooltip>
                <Tooltip message="View Post Drafts">
                  <NavLink
                      to="/drafts"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    draft
                  </NavLink>
                </Tooltip>
                <Tooltip message="My Profile">
                  <NavLink
                      to="/about"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    person
                  </NavLink>
                </Tooltip>
                <form action="/logout" method="post" className="flex flex-col">
                  <Tooltip message="signout">
                    <button
                        type="submit"
                        className="flex flex-row items-center rounded-xl bg-green-400 font-semibold justify-items-center text-white-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    >
                      <Icon icon="logout" />
                    </button>
                  </Tooltip>
                </form>
              </nav>
            </> ): (
            <>
              <nav className="w-full p-2 font-semibold uppercase md:visible flex mx-auto max-w-7xl text-center justify-around">
                <Tooltip message="View Posts">
                  <NavLink
                      to="/"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    feed
                  </NavLink>
                </Tooltip>
                <Tooltip message="My Profile">
                  <NavLink
                      to="/about"
                      className={({ isActive }) =>
                          ` ${
                              isActive
                                  ? "material-symbols-outlined underline text-2xl md:text-5xl"
                                  : "material-symbols-outlined text-2xl md:text-5xl"
                          }`
                      }
                  >
                    person
                  </NavLink>
                </Tooltip>
              </nav>
            </>
        )
          }

  </>

  );
}
//
// <span className="material-symbols-outlined">
// login
// </span>
