import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "block py-2 px-4 text-[black] bg-[white] rounded-full"
    : "block py-2 px-4 rounded-full text-[white]";

const Navbar = () => {
  return (
    <nav className="p-3 border-gray-200 bg-[#FF5B91] ">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <NavLink className="flex items-center" to="/text" end>
          <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-[#FFF6F9]">
            JSON Tools
          </span>
        </NavLink>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className="hidden w-full cursor-pointer md:block md:w-auto"
          id="navbar-solid-bg"
        >
          <ul className="flex flex-col mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <NavLink to="/text" className={linkClass}>
                Text Diff
              </NavLink>
            </li>
            <li>
              <NavLink to="/json" className={linkClass}>
                JSON Diff
              </NavLink>
            </li>
            <li>
              <NavLink to="/formatter" className={linkClass}>
                JSON Formatter
              </NavLink>
            </li>
            <li>
              <NavLink to="/viewer" className={linkClass}>
                JSON Viewer
              </NavLink>
            </li>
            <li>
              <NavLink to="/parser" className={linkClass}>
                JSON Parser
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
