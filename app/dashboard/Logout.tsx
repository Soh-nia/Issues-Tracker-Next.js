import { auth } from "@/auth";
import { signOutAction } from '@/app/lib/action';
import Image from 'next/image';

export default async function LogOut() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    // {status === "loading" ? (
    //     <div className="loading loading-spinner" />
    //   ) : (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Image
                src={session?.user?.image ?? "/default.png"}
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
              <span className="font-medium">{session?.user?.name}</span>
            </li>
            <li>
              <form action={signOutAction}>
                <button className="btn btn-ghost w-full justify-start border-none">
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
    //   )}
  )
}