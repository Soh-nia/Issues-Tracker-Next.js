// import ClientNavBarWrapper from './ClientNavBarWrapper';
// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <ClientNavBarWrapper>{children}</ClientNavBarWrapper>
//   );
// }

// import { SessionProvider } from 'next-auth/react';
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
import NavBar from './NavBar';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const [queryClient] = useState(() => new QueryClient());
  return (
    // <SessionProvider>
    //   <QueryClientProvider client={queryClient}>
    <>
        <NavBar />
        {children}
    </>
    //   </QueryClientProvider>
    // </SessionProvider>
  );
}