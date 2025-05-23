"use client";

import React from "react";
import { Logo } from "./Logo";
import { IoMdLogIn } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="navbar bg-primary-content shadow-sm px-8 py-3">
      <div className="flex-1">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex gap-10">
        <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="dracula" />
          <svg
            className="swap-off h-9 w-9 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg
            className="swap-on h-9 w-9 fill-white"
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
                <span className="font-medium text-base">{session?.user?.name || "User"}</span>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="btn btn-ghost w-full justify-start border-none text-base text-warning"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 self-start border bg-white rounded-selector border-primary-content px-4 py-2 text-sm font-medium text-primary-content hover:text-primary-content transition-colors hover:bg-primary md:text-base"
          >
            <span>Log in</span>
            <IoMdLogIn className="w-5 md:w-6" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;