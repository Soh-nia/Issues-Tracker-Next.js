import { FaArrowRight } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { Lusitana } from 'next/font/google';
import NavBar from "./Navbar";

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'], });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 px-6 py-10 md:w-3/6 ">
            <h1 className={`text-5xl font-bold text-primary-content ${lusitana.className}`}>Welcome to Issuer!</h1>
            <p className="py-6 text-xl md:text-3xl md:leading-normal">
              This is an example of an{' '}
              <span className="text-primary-content font-semibold">
                Issue Tracker App
              </span>
              , brought to you by Issuer.
            </p>
            <div className="flex">
              <Link
              href="/signup"
              className="flex items-center gap-5 self-start rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-content transition-colors hover:bg-primary-content hover:text-white md:text-base"
            >
              <span>Get Started</span> <FaArrowRight className="w-5 md:w-6" />
            </Link>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/6 md:px-28 md:py-12">
            <Image
              src="/desktop.png"
              width={1000}
              height={760}
              className="max-w-sm rounded-lg shadow-2xl"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
