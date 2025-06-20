import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideNav from "./componentsMe/SideNav/SideNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedInnvoice",
  description: "Simple billing & insights for private clinics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex w-full h-screen justify-between items-center bg-gradient-to-br from-slate-50 to-blue-100">
          <SideNav />
          {children}
        </main>
      </body>
    </html>
  );
}
