import { NavLink, useCatch } from "@remix-run/react";
import Document from "./document";
export default function Catch() {
  const caught = useCatch();
  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <div>{message}</div>
      <NavLink
        to="/"
        className="mb-2 flex items-center md:mb-0"
        aria-label="Brand Icon Link"
      >
        Return Home
      </NavLink>
    </Document>
  );
}
