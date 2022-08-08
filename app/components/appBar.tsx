import { Link, useNavigate } from "@remix-run/react";
import React from "react";

type AppBarProps = {
  user: Array<{ id: string; email: string }>;
};
export default function AppBar({ user }: AppBarProps) {
  const navigate = useNavigate();
  return (
    <nav className="invisible overflow-hidden w-full col-span-1 p-2 md:visible  md:col-start-1 md:col-end-12 flex mx-auto max-w-7xl text-center justify-between">
      <div className="flex w-full justify-around">
        {" "}
        <Link to="posts" className="text-xl text-white-600 underline">
          Blog Posts
        </Link>
        <Link to="about" className="text-xl text-white-600 underline">
          About Me{" "}
        </Link>
      </div>
      <div className="flex w-full justify-around">
        {user ? (
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </form>
        ) : (
          <div onClick={() => navigate(`/login`)}> login</div>
        )}
      </div>
    </nav>
  );
}
