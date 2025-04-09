import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Issue Tracker App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel">
      <body
        className={`${inter.variable}`}
      >
      <SessionProvider>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
