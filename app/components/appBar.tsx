import { NavLink, useNavigate } from "@remix-run/react";
import React from "react";
import Icon from "~/components/shared/icon";
import Tooltip from "~/components/shared/tooltip";

type AppBarProps = {
  user: { id: string; email: string };
  role: string;
};
export default function AppBar({ user, role }: AppBarProps) {
  const navigate = useNavigate();
  return (
    <nav className="invisible h-1/4 w-full p-2 font-semibold uppercase md:visible flex mx-auto max-w-7xl  text-center justify-between">
      <div className="flex h-1/4 w-full justify-around">
        <Tooltip message="View Post Drafts">
          <NavLink
            to="/"
            className={({ isActive }) =>
              ` ${
                isActive
                  ? "material-symbols-outlined underline text-5xl"
                  : "material-symbols-outlined text-5xl"
              }`
            }
          >
            feed
          </NavLink>
        </Tooltip>
      </div>
      <div className="flex w-full justify-around">
        {user ? (
          <div className="flex w-full justify-around">
            {user.email === role ? (
              <>
                <Tooltip message="Write a new Blog Post">
                  <NavLink
                    to="new"
                    className={({ isActive }) =>
                      ` ${
                        isActive
                          ? "material-symbols-outlined underline text-5xl"
                          : "material-symbols-outlined text-5xl"
                      }`
                    }
                  >
                    Post_add
                  </NavLink>
                </Tooltip>
                <Tooltip message="View Post Drafts">
                  <NavLink
                    to="drafts"
                    className={({ isActive }) =>
                      ` ${
                        isActive
                          ? "material-symbols-outlined underline text-5xl"
                          : "material-symbols-outlined text-5xl"
                      }`
                    }
                  >
                    draft
                  </NavLink>
                </Tooltip>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex w-full justify-around">
        <Tooltip message="My Profile">
          <NavLink
            to="about"
            className={({ isActive }) =>
              ` ${
                isActive
                  ? "material-symbols-outlined underline text-5xl"
                  : "material-symbols-outlined text-5xl"
              }`
            }
          >
            person
          </NavLink>
        </Tooltip>
      </div>
      <div className="flex w-full justify-around">
        {user ? (
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
        ) : (
          <Tooltip message="Login">
            <button
              onClick={() => navigate(`/login`)}
              className="flex flex-row items-center rounded-xl bg-green-400 font-semibold justify-items-center text-white-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              <Icon icon="login" />
            </button>
          </Tooltip>
        )}
      </div>
    </nav>
  );
}
//
// <span className="material-symbols-outlined">
// login
// </span>
