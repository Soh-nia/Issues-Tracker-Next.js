import { FaExpandArrowsAlt } from "react-icons/fa";
import { Lusitana } from 'next/font/google';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'], });

export function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <FaExpandArrowsAlt className="h-9 w-9 rotate-[15deg]" />
      <p className="text-[35px]">Issuer</p>
    </div>
  );
}

export function NavbarLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-base-content`}
    >
      <FaExpandArrowsAlt className="h-7 w-7 rotate-[15deg]" />
      <p className="text-[30px]">Issuer</p>
    </div>
  );
}
