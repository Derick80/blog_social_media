import { NavLink } from "@remix-run/react";
import Tooltip from "../shared/tooltip";

export default function AdminBar() {
  return (
    <header>
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

      <Tooltip message="Write a new blog post">
        <NavLink
          to="/new"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "uppercase underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          Write a New Post
        </NavLink>
      </Tooltip>
      <Tooltip message="View drafts">
        <NavLink
          to="/drafts"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "uppercase underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          Drafts
        </NavLink>
      </Tooltip>
      <Tooltip message="My Profile">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "uppercase underline text-base md:text-xl"
                : "uppercase text-base md:text-xl"
            }`
          }
        >
          About
        </NavLink>
      </Tooltip>
      <form action="/logout" method="post">
        <Tooltip message="signout">
          <button type="submit">SignOut</button>
        </Tooltip>
      </form>
    </header>
  );
}
