import { SessionProvider } from 'next-auth/react';
import NavBar from './NavBar';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <NavBar />
      {children}
    </SessionProvider>
  );
}