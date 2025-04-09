"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import { NavbarLogo } from "../Logo";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-5 md:px-15">
      <div className="navbar-start">
        <Link href="/">
          <NavbarLogo />
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <NavLinks />
      </div>
      <div className="navbar-center block md:hidden">
        <div className="dropdown dropdown-end block md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle border-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <NavLinks isDropdown />
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <div className="flex gap-5">
          <label className="swap swap-rotate">
            <input type="checkbox" className="theme-controller" value="dracula" />
            <svg
              className="swap-off h-9 w-9 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              className="swap-on h-9 w-9 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          {status === "loading" ? (
            <div className="loading loading-spinner" />
          ) : status === "authenticated" ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    src={session?.user?.image || "/default.png"}
                    width={40}
                    height={40}
                    alt="User avatar"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="mb-2">
                  <span className="font-medium text-base">{session?.user?.name}</span>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost w-full justify-start border-none text-warning text-base"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-ghost">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const NavLinks = ({ isDropdown = false }: { isDropdown?: boolean }) => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Issues", href: "/dashboard/issues/list" },
  ];

  return (
    <ul className={isDropdown ? "menu" : "menu menu-horizontal px-1"}>
      {links.map((link) => {
        const isActive =
          link.href === currentPath ||
          (link.href === "/dashboard/issues/list" &&
            currentPath.startsWith("/dashboard/issues"));

        return (
          <li key={link.href}>
            <Link
              className={classnames("nav-link text-base font-medium", {
                "text-base": isActive,
                "text-neutral-content hover:text-neutral": !isActive,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavBar;